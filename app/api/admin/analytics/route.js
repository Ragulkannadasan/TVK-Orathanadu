/**
 * app/api/admin/analytics/route.js
 * GET → Aggregated stats for the admin dashboard
 */

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Grievance from '@/models/Grievance';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();

  const [
    totalMembers,
    totalGrievances,
    pendingCount,
    investigatingCount,
    resolvedCount,
    roleBreakdown,
    categoryBreakdown,
    recentGrievances,
  ] = await Promise.all([
    User.countDocuments(),
    Grievance.countDocuments(),
    Grievance.countDocuments({ status: 'Pending' }),
    Grievance.countDocuments({ status: 'Investigating' }),
    Grievance.countDocuments({ status: 'Resolved' }),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Grievance.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Grievance.find().sort({ createdAt: -1 }).limit(5)
      .populate('userId', 'name panchayat')
      .lean(),
  ]);

  return NextResponse.json({
    totalMembers,
    totalGrievances,
    statusBreakdown: { Pending: pendingCount, Investigating: investigatingCount, Resolved: resolvedCount },
    roleBreakdown,
    categoryBreakdown,
    recentGrievances,
  });
}
