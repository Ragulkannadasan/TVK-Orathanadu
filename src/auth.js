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

          // --- OTP FLOW ---
          if (credentials.flow === "otp") {
            const OTPModule = await import("@/models/OTP");
            const OTP = OTPModule.default || OTPModule;
            
            const otpRecord = await OTP.findOne({ email: credentials.email, otp: credentials.otp });
            if (!otpRecord) return null;

            // OTP is valid, delete it
            await OTP.deleteOne({ _id: otpRecord._id });

            // Find or create user
            let user = await User.findOne({ email: credentials.email }).lean();
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

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          // --- PASSWORD FLOW ---
          if (!credentials.password) return null;

          // 1. Check environment variables first (most secure for Vercel)
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPass = process.env.ADMIN_PASSWORD;

          if (adminEmail && adminPass && 
              credentials.email === adminEmail && 
              credentials.password === adminPass) {
            console.log("Authenticated via Environment Variables:", adminEmail);
            return {
              id: "admin-env",
              name: "System Admin",
              email: adminEmail,
              role: "Admin",
            };
          }

          // 2. Fallback to local users.json (now bundled via import)
          const localUser = localUsers.find(u => u.email === credentials.email && u.password === credentials.password);

          if (localUser) {
            // Check DB for any overrides (like profile image)
            let dbImage = localUser.image;
            try {
              const dbUser = await User.findOne({ email: localUser.email }).lean();
              if (dbUser?.image) dbImage = dbUser.image;
            } catch (e) {
              console.error("Auth DB Error (ignoring):", e);
            }

            console.log("Authenticated via users.json:", localUser.email);

            return {
              id: localUser.email,
              name: localUser.name,
              email: localUser.email,
              role: localUser.role,
            };
          }

          // 3. Database User
          const bcrypt = (await import("bcryptjs")).default;
          const dbUser = await User.findOne({ email: credentials.email }).select("+password").lean();
          
          if (dbUser && dbUser.password) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, dbUser.password);
            if (isPasswordCorrect) {
              return {
                id: dbUser._id.toString(),
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
              };
            }
          }
        } catch (error) {
          console.error("Critical Auth Error:", error);
          // In production, we don't want to leak error details, but we should log them for debugging
        }

        console.log("Authentication failed for:", credentials.email);
        return null;
      }
    })
  ],
});

