import { cache } from 'react';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * Cached version of the auth() session fetch.
 * Dedupes calls within a single server-side request.
 */
export const getSession = cache(async () => {
  return await auth();
});

/**
 * Cached version of the user database fetch.
 * Returns the full user document from MongoDB based on the session email.
 * Dedupes calls within a single server-side request.
 */
export const getSessionUser = cache(async () => {
  const session = await getSession();
  if (!session?.user?.email) return null;

  try {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();
    
    if (!user) {
      // Return a mock user object for environment/JSON admins not in the DB yet
      return {
        _id: "system-user",
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.image,
        isProfileComplete: true,
      };
    }

    // Return a plain object suitable for Client Components
    return {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt?.toISOString(),
    };
  } catch (error) {
    console.error("getSessionUser Error:", error);
    return null;
  }
});
