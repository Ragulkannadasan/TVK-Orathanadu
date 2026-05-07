import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedback, rating, category } = await req.json();

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback is required' }, { status: 400 });
    }

    await dbConnect();
    await Feedback.create({
      userId: session.user.userId,
      feedback,
      rating,
      category,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to submit feedback' }, { status: 500 });
  }
}
