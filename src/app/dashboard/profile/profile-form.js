"use client";

import { useActionState, useState, useRef } from "react";
import { updateProfileAction } from "@/actions/profile";
import { Camera, Upload } from "lucide-react";

export default function ProfileForm({ user }) {
  const [state, action, isPending] = useActionState(updateProfileAction, null);
  const [imagePreview, setImagePreview] = useState(user.image || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please select a file under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="userId" value={user._id} />
      <input type="hidden" name="image" value={imagePreview} />

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center sm:items-start gap-4 mb-8 pb-8 border-b border-white/5">
        <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Profile Photo</label>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-[#800000]/10 border-2 border-white/10 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/20 text-4xl font-bold">{user.name[0]}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-2 -right-2 p-2 bg-[#FFD700] rounded-xl text-black hover:scale-110 transition-transform shadow-lg"
            >
              <Camera size={16} strokeWidth={3} />
            </button>
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Upload size={14} /> Change Photo
            </button>
            <p className="text-[10px] text-white/30 mt-2">JPG or PNG. Max size 2MB.</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Mobile Number</label>
          <input
            name="mobile"
            type="tel"
            defaultValue={user.mobile}
            placeholder="9876543210"
            className="input-dark"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Voter ID Number</label>
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
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Panchayat</label>
          <select name="panchayat" defaultValue={user.panchayat} className="input-dark bg-black/40">
            <option value="">Select Panchayat</option>
            <option value="Orathanadu">Orathanadu</option>
            <option value="Kavarappattu">Kavarappattu</option>
            <option value="Vaduvoor">Vaduvoor</option>
            <option value="Mandalakkottai">Mandalakkottai</option>
            <option value="Thekkur">Thekkur</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-white/50 ml-1">Booth Number</label>
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
    </form>
  );
}
