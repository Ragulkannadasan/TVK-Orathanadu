/**
 * app/api/auth/[...nextauth]/route.js
 * NextAuth App Router handler
 */

import { handlers } from '@/auth';
export const { GET, POST } = handlers;
