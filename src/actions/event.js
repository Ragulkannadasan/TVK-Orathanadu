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
    const capacity = parseInt(formData.get("capacity")) || 100;
    const seatPrefix = formData.get("seatPrefix") || "S";

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      location,
      capacity,
      seatPrefix,
      createdBy: session.user.email
    });

    await newEvent.save();
    revalidatePath("/dashboard/admin/events");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function registerForEvent(eventId) {
  try {
    const session = await auth();
    if (!session) throw new Error("Please login to register");

    const BookingModule = await import("@/models/Booking");
    const Booking = BookingModule.default || BookingModule;

    await dbConnect();

    // 1. Check if already registered
    const existing = await Booking.findOne({ eventId, userId: session.user.id });
    if (existing) return { error: "Already registered for this event" };

    // 2. Get event details
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) throw new Error("Event is not available");

    // 3. Count current bookings to assign seat
    const count = await Booking.countDocuments({ eventId });
    if (count >= event.capacity) throw new Error("Event is full");

    // 4. Assign next seat
    const seatNumber = `${event.seatPrefix}-${count + 1}`;

    const newBooking = new Booking({
      eventId,
      userId: session.user.id,
      seatNumber
    });

    await newBooking.save();
    revalidatePath("/dashboard/ticket");
    revalidatePath("/dashboard/admin/events");
    return { success: true, seatNumber };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getBookings() {
  try {
    const session = await auth();
    if (!session) return [];

    const BookingModule = await import("@/models/Booking");
    const Booking = BookingModule.default || BookingModule;

    await dbConnect();
    const bookings = await Booking.find({ userId: session.user.id })
      .populate('eventId')
      .lean();

    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    return [];
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
