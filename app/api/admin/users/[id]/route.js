/**
 * app/api/admin/users/[id]/route.js
 * PATCH → Promote/demote user role (Admin only)
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { role, isBlocked } = await req.json();
  
  const updateData = {};
  if (role) {
    if (!['Voter', 'Poruppalar', 'Admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    updateData.role = role;
  }
  
  if (typeof isBlocked === 'boolean') {
    updateData.isBlocked = isBlocked;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ success: true, user });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();
  const user = await User.findByIdAndDelete(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ success: true, message: 'User deleted successfully' });
}
