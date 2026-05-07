import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'OTP',
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error('Email and OTP are required');
        }

        await dbConnect();

        // Check if OTP is valid
        const validOtp = await Otp.findOne({
          email: credentials.email.toLowerCase(),
          otp: credentials.otp,
          expiresAt: { $gt: new Date() }
        });

        if (!validOtp) {
          throw new Error('Invalid or expired OTP');
        }

        // Delete OTP to prevent reuse
        await Otp.deleteOne({ _id: validOtp._id });

        // Find or create user
        let user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) {
          user = await User.create({
            email: credentials.email.toLowerCase(),
            name: '',
            emailVerified: new Date(),
            role: 'Voter',
          });
        } else if (!user.emailVerified) {
          user.emailVerified = new Date();
          await user.save();
        }

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          await dbConnect();
          
          // Find or forcefully create the master admin user in DB so the session has a valid ID
          let user = await User.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user) {
            user = await User.create({
              email: credentials.email.toLowerCase(),
              name: 'Super Admin',
              role: 'Admin',
              emailVerified: new Date(),
              mobile: '0000000000',
              voterId: 'MASTER_ADMIN',
              panchayat: 'Headquarters',
            });
          } else if (user.role !== 'Admin') {
            user.role = 'Admin';
            await user.save();
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: 'Admin',
            profileComplete: true,
          };
        }

        throw new Error('Invalid admin credentials');
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.profileComplete = user.profileComplete;
      }

      // When frontend calls update(), refresh the profileComplete status from DB
      if (trigger === 'update' && token.userId) {
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
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
