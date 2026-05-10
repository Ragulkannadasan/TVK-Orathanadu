"use client";

import { useActionState, useState, useRef } from "react";
import { updateProfileAction } from "@/actions/profile";
import { Camera, Upload } from "lucide-react";

import { PANCHAYATS } from "@/lib/constants";

export default function ProfileForm({ user }) {
  const [state, action, isPending] = useActionState(updateProfileAction, null);
  const [imagePreview, setImagePreview] = useState(user.image || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 400; // Max width/height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG base64
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setImagePreview(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="userId" value={user._id} />
      <input type="hidden" name="image" value={imagePreview} />

      {/* Profile Photo Section (Instagram Style) */}
      <div className="flex flex-col items-center gap-6 mb-10 pb-8 border-b border-surface-border">
        <div className="relative group">
          {/* Animated Ring */}
          <div className="w-32 h-32 p-1 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#800000] to-[#FFD700] shadow-2xl">
            <div className="w-full h-full rounded-full bg-black p-1">
              <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-surface-border">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-text-muted/50 text-5xl font-bold">{user.name[0]}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 p-3 bg-[#FFD700] rounded-2xl text-black hover:scale-110 active:scale-95 transition-all shadow-xl border-4 border-black"
            title="Change Photo"
          >
            <Camera size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-gold-dynamic text-sm font-bold hover:underline transition-all"
          >
            Change Profile Photo
          </button>
          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold">Square JPG/PNG (Max 2MB)</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dynamic font-bold">@</span>
            <input
              name="username"
              type="text"
              defaultValue={user.username}
              placeholder="username"
              className="input-dark pl-9"
              required
            />
          </div>
          <p className="text-[9px] text-text-muted/50 ml-1">Your unique handle (e.g., @ragul_tvk)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Mobile Number</label>
            <input
              name="mobile"
              type="tel"
              defaultValue={user.mobile}
              placeholder="9876543210"
              className="input-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Voter ID Number</label>
            <input
              name="voterId"
              type="text"
              defaultValue={user.voterId}
              placeholder="ABC1234567"
              className="input-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Panchayat</label>
            <select name="panchayat" defaultValue={user.panchayat} className="input-dark bg-black/40">
              <option value="">Select Panchayat</option>
              {PANCHAYATS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Booth Number</label>
            <input
              name="boothNumber"
              type="text"
              defaultValue={user.boothNumber}
              placeholder="Enter Booth Number (e.g., 175/A)"
              className="input-dark"
            />
          </div>
        </div>

        {state?.error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] uppercase font-bold text-center">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-[10px] uppercase font-bold text-center">
            {state.success}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full sm:w-auto px-10"
          >
            {isPending ? "Updating..." : "Save Profile Details"}
          </button>
        </div>
      </div>
    </form>
  );
}
