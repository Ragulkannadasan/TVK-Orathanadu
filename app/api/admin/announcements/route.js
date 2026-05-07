/**
 * app/api/admin/announcements/route.js
 * GET  → List announcements
 * POST → Post a new announcement
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .limit(10)
    .lean();
  
  return NextResponse.json({ announcements });
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { title, content, type } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();
  const announcement = await Announcement.create({
    title,
    content,
    type: type || 'General',
    createdBy: session.user.userId,
  });

  return NextResponse.json({ success: true, announcement });
}
