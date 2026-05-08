'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function signupLoginAction(email, otp) {
  try {
    await signIn('otp', {
      email,
      otp,
      redirectTo: '/profile-setup',
    });
  } catch (error) {
    if (error.message?.includes('NEXT_REDIRECT') || error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { error: 'Invalid or expired OTP' };
    }
    console.error('[SIGNUP ACTION ERROR]', error);
    return { error: 'An unexpected response was received from the server.' };
  }
}
