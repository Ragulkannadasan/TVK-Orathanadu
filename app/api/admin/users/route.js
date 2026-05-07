/**
 * app/api/admin/users/route.js
 * GET  → Paginated list of all users
 * PATCH → Promote user role
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const search = url.searchParams.get('search') || '';
  const limit = 15;
  const skip = (page - 1) * limit;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { panchayat: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}
