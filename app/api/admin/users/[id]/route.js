/**
 * app/api/admin/users/[id]/route.js
 * PATCH → Promote/demote user role (Admin only)
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { role } = await req.json();
  if (!['Voter', 'Poruppalar', 'Admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(params.id, { role }, { new: true }).lean();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ success: true, user });
}
