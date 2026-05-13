import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import localUsers from "./data/users.json";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        flow: { label: "Flow", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        try {
          const dbConnectModule = await import("@/lib/db");
          const dbConnect = dbConnectModule.default || dbConnectModule;
          
          const UserModule = await import("@/models/User");
          const User = UserModule.default || UserModule;

          await dbConnect();

          let user = null;

          // --- OTP FLOW ---
          if (credentials.flow === "otp") {
            const OTPModule = await import("@/models/OTP");
            const OTP = OTPModule.default || OTPModule;
            
            const otpRecord = await OTP.findOne({ email: credentials.email, otp: credentials.otp });
            if (!otpRecord) return null;

            await OTP.deleteOne({ _id: otpRecord._id });

            user = await User.findOne({ email: credentials.email }).lean();
            if (!user) {
              const { nanoid } = await import("nanoid");
              const bcrypt = (await import("bcryptjs")).default;
              const emailPrefix = credentials.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
              user = new User({
                name: credentials.email.split("@")[0],
                username: `${emailPrefix}_${nanoid(4)}`,
                email: credentials.email,
                password: await bcrypt.hash(nanoid(), 10),
                role: "Voter",
              });
              await user.save();
              user = user.toObject();
            }
          } else {
            // --- PASSWORD FLOW ---
            if (!credentials.password) return null;

            // 1. Check environment variables
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPass = process.env.ADMIN_PASSWORD;

            if (adminEmail && adminPass && 
                credentials.email === adminEmail && 
                credentials.password === adminPass) {
              user = {
                id: "admin-env",
                name: "System Admin",
                email: adminEmail,
                role: "Admin",
              };
            } else {
              // 2. Check users.json
              const localUser = localUsers.find(u => u.email === credentials.email && u.password === credentials.password);
              if (localUser) {
                user = {
                  id: localUser.email,
                  name: localUser.name,
                  email: localUser.email,
                  role: localUser.role,
                };
              } else {
                // 3. Database User
                const bcrypt = (await import("bcryptjs")).default;
                const dbUser = await User.findOne({ email: credentials.email }).select("+password").lean();
                
                if (dbUser && dbUser.password) {
                  const isPasswordCorrect = await bcrypt.compare(credentials.password, dbUser.password);
                  if (isPasswordCorrect) {
                    user = {
                      id: dbUser._id.toString(),
                      name: dbUser.name,
                      email: dbUser.email,
                      role: dbUser.role,
                    };
                  }
                }
              }
            }
          }

          if (user) {
            return {
              id: user._id?.toString() || user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Critical Auth Error:", error);
        }

        return null;
      }
    })
  ],
});
