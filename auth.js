import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: 'otp',
      name: 'OTP',
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        console.log(`[AUTH] Authorize called for: ${credentials?.email}`);
        if (!credentials?.email || !credentials?.otp) return null;
        
        await dbConnect();
        const email = credentials.email.toLowerCase().trim();
        const otp = String(credentials.otp).trim();

        // Find valid OTP
        const validOtp = await Otp.findOne({
          email,
          otp,
          expiresAt: { $gt: new Date() }
        });

        if (!validOtp) {
          console.log(`[AUTH] OTP mismatch or expired for ${email}. Provided: ${otp}`);
          return null;
        }

        console.log(`[AUTH] OTP valid for ${email}`);

        // Delete used OTP
        await Otp.deleteOne({ _id: validOtp._id });

        // Get or Create User
        let user = await User.findOne({ email });
        
        if (user && user.isBlocked) {
          console.log(`[AUTH] User ${email} is blocked`);
          return null;
        }

        if (!user) {
          console.log(`[AUTH] Creating new user for ${email}`);
          user = await User.create({
            email,
            name: '',
            emailVerified: new Date(),
            role: 'Voter',
          });
        } else if (!user.emailVerified) {
          user.emailVerified = new Date();
          await user.save();
        }

        console.log(`[AUTH] Login successful for ${email}`);

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          profileComplete: !!(user.mobile && user.voterId && user.panchayat)
        };
      }
    }),
    Credentials({
      id: 'admin-login',
      name: 'Admin',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          await dbConnect();
          let user = await User.findOne({ email });
          
          if (!user) {
            user = await User.create({
              email,
              name: 'Super Admin',
              role: 'Admin',
              emailVerified: new Date(),
              mobile: '0000000000',
              voterId: 'MASTER_ADMIN',
              panchayat: 'Headquarters',
            });
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: 'Admin',
            profileComplete: true,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log(`[AUTH] JWT Callback - Trigger: ${trigger}, User present: ${!!user}`);
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.profileComplete = user.profileComplete;
        console.log(`[AUTH] JWT User Data Injected: ${user.email}`);
      }
      if (trigger === 'update' && token.userId) {
        console.log(`[AUTH] JWT Update triggered for ${token.userId}`);
        await dbConnect();
        const dbUser = await User.findById(token.userId).lean();
        if (dbUser) {
          token.profileComplete = !!(dbUser.mobile && dbUser.voterId && dbUser.panchayat);
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(`[AUTH] Session Callback - Token present: ${!!token}`);
      if (token) {
        session.user.role = token.role;
        session.user.userId = token.userId;
        session.user.profileComplete = token.profileComplete;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
