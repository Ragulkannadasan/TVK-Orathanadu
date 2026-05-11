import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    await dbConnect();
    const events = await Event.find({ isActive: true }).sort({ date: -1 }).lean();

    let bookings = [];
    if (userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        bookings = await Booking.find({ userId: user._id }).lean();
      }
    }

    const bookedEventIds = bookings.map(b => b.eventId?.toString());

    return NextResponse.json({
      events: JSON.parse(JSON.stringify(events)),
      bookedEventIds
    });
  } catch (error) {
    console.error("Events GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email, eventId } = await req.json();
    if (!email || !eventId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await Booking.findOne({ eventId, userId: user._id });
    if (existing) return NextResponse.json({ error: "Already registered" }, { status: 409 });

    const event = await Event.findById(eventId);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const count = await Booking.countDocuments({ eventId });
    if (count >= event.capacity) return NextResponse.json({ error: "Event is full" }, { status: 400 });

    const seatNumber = `${event.seatPrefix}-${count + 1}`;
    await Booking.create({ eventId, userId: user._id, seatNumber });

    return NextResponse.json({ success: true, seatNumber });
  } catch (error) {
    console.error("Events POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
