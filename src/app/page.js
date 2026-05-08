import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InstallButton from "@/components/InstallButton";

export const metadata = {
  title: 'TVK Orathanadu – மக்கள் போர்ட்டல் | People\'s Portal',
  description: 'Join TVK Orathanadu. Submit grievances, track booth activity, and participate in constituency management.',
};

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden">
      {/* Absolute Header Controls */}
      <div className="absolute top-6 right-6 z-50">
        <InstallButton />
      </div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#800000]/20 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#800000]/5 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5 -z-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(128,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,0,0,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/20 border border-[#800000]/40 text-[#FFD700] text-sm mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            ஓரத்தநாடு சட்டமன்றத் தொகுதி – 175
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-fade-in-up display-font" style={{ animationDelay: '0.1s' }}>
            <span className="tamil gradient-text">தமிழக வெற்றி</span>
            <br />
            <span className="text-white">கழகம்</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Thamizhaga Vetri Kazhagam
          </p>

          {/* Motto */}
          <div className="my-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="inline-block px-8 py-4 rounded-2xl glass-card border border-[#FFD700]/20">
              <p className="tamil text-[#FFD700] text-2xl md:text-3xl font-bold tracking-wide">
                "பிறப்பொக்கும் எல்லா உயிர்க்கும்"
              </p>
              <p className="text-white/50 text-sm mt-1">All beings are equal in birth</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/signup"
              className="btn-primary text-base px-8 py-3.5 rounded-xl"
            >
              🗳️ கட்சியில் சேரு / Join Party
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-3.5 rounded-xl"
            >
              📢 புகார் தெரிவி / Report Issue
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          மக்களுக்கான <span className="gradient-text">சேவைகள்</span>
        </h2>
        <p className="text-center text-white/50 mb-12">Digital services for Orathanadu constituency</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-8 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800000]/40 to-[#4a0000]/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg border border-[#800000]/30">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{f.title}</h3>
              <p className="tamil text-[#FFD700]/70 text-sm mb-2">{f.titleTa}</p>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center">
        <p className="tamil text-[#FFD700] font-semibold">தமிழக வெற்றி கழகம்</p>
        <p className="text-white/40 text-sm mt-1">ஓரத்தநாடு சட்டமன்றத் தொகுதி – 175</p>
        <p className="text-white/20 text-xs mt-3">© 2026 TVK Orathanadu. All rights reserved.</p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: '🆔',
    title: 'Digital Membership',
    titleTa: 'டிஜிட்டல் உறுப்பினர் அட்டை',
    desc: 'Get your digital TVK membership card with booth and panchayat details instantly.',
  },
  {
    icon: '📢',
    title: 'Grievance Redressal',
    titleTa: 'புகார் தீர்வு அமைப்பு',
    desc: 'Submit and track constituency issues — roads, water, electricity, agriculture — in real time.',
  },
  {
    icon: '🏛️',
    title: 'Booth Management',
    titleTa: 'சாவடி மேலாண்மை',
    desc: 'Poruppalar and Admin tools to manage voters, assign tasks, and track resolution progress.',
  },
];
