'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function adminLoginAction(email, password) {
  try {
    await signIn('admin-login', {
      email,
      password,
      redirectTo: '/admin',
    });
  } catch (error) {
    if (error.message?.includes('NEXT_REDIRECT') || error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { error: 'Invalid admin credentials. Access Denied.' };
    }
    console.error('[ADMIN ACTION ERROR]', error);
    return { error: 'An unexpected response was received from the server.' };
  }
}
