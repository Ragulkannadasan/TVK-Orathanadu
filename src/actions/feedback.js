"use server";

import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitFeedbackAction(prevState, formData) {
  const session = await auth();
  if (!session) return { error: "You must be logged in to submit feedback" };

  const category = formData.get("category");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (!subject || !message) {
    return { error: "Subject and message are required" };
  }

  try {
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { error: "User not found" };

    const newFeedback = new Feedback({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      category,
      subject,
      message,
    });

    await newFeedback.save();

    revalidatePath("/dashboard/feedback");
    return { success: "Thank you! Your feedback has been submitted successfully." };
  } catch (error) {
    console.error("Feedback Submission Error:", error);
    return { error: "Failed to submit feedback. Please try again later." };
  }
}
