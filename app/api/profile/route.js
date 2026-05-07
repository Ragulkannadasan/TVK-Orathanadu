/**
 * app/api/profile/route.js
 * POST → Update user profile (mobile, voterId, panchayat, boothNumber, name)
 * GET  → Get current user profile
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const user = await User.findById(session.user.userId).lean();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json(user);
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, mobile, voterId, panchayat, boothNumber } = body;

  await dbConnect();
  const user = await User.findByIdAndUpdate(
    session.user.userId,
    { name, mobile, voterId, panchayat, boothNumber },
    { new: true }
  );

  return NextResponse.json({ success: true, user });
}
