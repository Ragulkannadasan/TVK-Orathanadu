import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.map(p => {
      if (p.name === 'OTP') {
        return {
          ...p,
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.otp) {
              throw new Error('Email and OTP are required');
            }
            await dbConnect();
            const validOtp = await Otp.findOne({
              email: credentials.email.toLowerCase(),
              otp: credentials.otp,
              expiresAt: { $gt: new Date() }
            });
            if (!validOtp) throw new Error('Invalid or expired OTP');
            await Otp.deleteOne({ _id: validOtp._id });
            let user = await User.findOne({ email: credentials.email.toLowerCase() });
            if (user && user.isBlocked) {
              throw new Error('Your account has been blocked. Please contact support.');
            }
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
        };
      }
      if (p.id === 'admin-login') {
        return {
          ...p,
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error('Email and password are required');
            }
            if (
              credentials.email === process.env.ADMIN_EMAIL &&
              credentials.password === process.env.ADMIN_PASSWORD
            ) {
              await dbConnect();
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
        };
      }
      return p;
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.profileComplete = user.profileComplete;
      }
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
  }
});
