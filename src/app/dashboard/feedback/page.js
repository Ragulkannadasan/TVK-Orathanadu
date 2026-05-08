import FeedbackForm from "./feedback-form";
import { MessageSquare, Heart, Bug, Lightbulb } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white display-font mb-1 tracking-tight">
          Feedback <span className="gradient-text">& Support</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base mt-2 tamil">
          கட்சியின் வளர்ச்சிக்கான உங்கள் கருத்துக்களையும் ஆலோசனைகளையும் இங்கே பகிரவும்
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-l-4 border-yellow-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Lightbulb size={20} />
              </div>
              <h3 className="text-white font-bold tracking-tight">Suggestions</h3>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Have an idea to make our constituency better? We are all ears! Your suggestions go directly to our planning team.
            </p>
          </div>

          <div className="glass-card p-6 border-l-4 border-red-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <Bug size={20} />
              </div>
              <h3 className="text-white font-bold tracking-tight">Bug Reports</h3>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Is something not working right on the portal? Let us know the details so we can fix it immediately.
            </p>
          </div>

          <div className="glass-card p-6 border-l-4 border-green-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <Heart size={20} />
              </div>
              <h3 className="text-white font-bold tracking-tight">Appreciation</h3>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Happy with the service? Share your positive experiences to motivate our volunteers and booth leaders.
            </p>
          </div>
        </div>

        {/* Right: The Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} />
             </div>
             <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6">Send Message</h2>
                <FeedbackForm />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

