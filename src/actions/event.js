"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getEvents() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ date: -1 }).lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Get Events Error:", error);
    return [];
  }
}

export async function createEvent(formData) {
  try {
    await checkAdmin();
    await dbConnect();
    
    const session = await auth();
    const title = formData.get("title");
    const description = formData.get("description");
    const date = formData.get("date");
    const location = formData.get("location");

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      location,
      createdBy: session.user.email
    });

    await newEvent.save();
    revalidatePath("/dashboard/admin/events");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteEvent(id) {
  try {
    await checkAdmin();
    await dbConnect();
    await Event.findByIdAndDelete(id);
    revalidatePath("/dashboard/admin/events");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function toggleEventStatus(id, currentStatus) {
  try {
    await checkAdmin();
    await dbConnect();
    await Event.findByIdAndUpdate(id, { isActive: !currentStatus });
    revalidatePath("/dashboard/admin/events");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
