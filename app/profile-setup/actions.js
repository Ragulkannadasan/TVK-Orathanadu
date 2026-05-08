'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function getUserProfileAction() {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  try {
    await dbConnect();
    const user = await User.findById(session.user.userId).lean();
    if (!user) return { error: 'User not found' };
    
    // Convert Mongo object to plain JS
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return { error: 'Failed to fetch profile' };
  }
}

export async function updateProfileAction(formData) {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  try {
    await dbConnect();
    const { name, mobile, voterId, panchayat, boothNumber } = formData;
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.userId,
      { 
        name, 
        mobile, 
        voterId, 
        panchayat, 
        boothNumber: parseInt(boothNumber) || null 
      },
      { new: true }
    ).lean();

    if (!updatedUser) return { error: 'User not found' };

    revalidatePath('/dashboard');
    return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile' };
  }
}

export async function deleteAccountAction() {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(session.user.userId);
    if (!user) return { error: 'User not found' };
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete account' };
  }
}
