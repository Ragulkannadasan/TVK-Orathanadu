/**
 * app/api/admin/notifications/route.js
 * POST → Send notification to a specific user
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, title, message } = await req.json();
  if (!userId || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await dbConnect();
  const notification = await Notification.create({
    userId,
    title,
    message,
  });

  return NextResponse.json({ success: true, notification });
}
