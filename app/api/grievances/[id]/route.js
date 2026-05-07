/**
 * app/api/grievances/[id]/route.js
 * PATCH → Update grievance status and action notes (Poruppalar/Admin only)
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import { NextResponse } from 'next/server';

export async function PATCH(req, { params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { role, userId } = session.user;
  if (role !== 'Poruppalar' && role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { status, actionNotes, assignedTo } = body;

  await dbConnect();
  const grievance = await Grievance.findByIdAndUpdate(
    id,
    {
      ...(status && { status }),
      ...(actionNotes && { actionNotes }),
      ...(assignedTo && { assignedTo }),
      ...(role === 'Poruppalar' && { assignedTo: userId }),
    },
    { new: true }
  ).populate('userId', 'name email').populate('assignedTo', 'name');

  if (!grievance) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true, grievance });
}
