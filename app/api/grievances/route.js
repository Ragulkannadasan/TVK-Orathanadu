/**
 * app/api/grievances/route.js
 * GET  → Fetch grievances (scoped by role)
 * POST → Create a new grievance
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function GET(req) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { role, userId } = session.user;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  let query = {};

  if (role === 'Voter') {
    // Voters see only their own grievances
    query = { userId };
  } else if (role === 'Poruppalar') {
    // Poruppalar sees grievances from their panchayat
    const poruppalar = await User.findById(userId).lean();
    const votersInBooth = await User.find({ panchayat: poruppalar.panchayat }).select('_id').lean();
    const voterIds = votersInBooth.map((v) => v._id);
    query = { userId: { $in: voterIds } };
  }
  // Admin sees all — no filter

  const [grievances, total] = await Promise.all([
    Grievance.find(query)
      .populate('userId', 'name email panchayat boothNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Grievance.countDocuments(query),
  ]);

  return NextResponse.json({ grievances, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { category, description, imageUrl, location } = body;

  if (!category || !description) {
    return NextResponse.json({ error: 'Category and description are required.' }, { status: 400 });
  }

  await dbConnect();

  const ticketId = `TVK-${nanoid(6).toUpperCase()}`;
  const grievance = await Grievance.create({
    ticketId,
    userId: session.user.userId,
    category,
    description,
    imageUrl,
    location,
    status: 'Pending',
  });

  return NextResponse.json({ success: true, grievance }, { status: 201 });
}
