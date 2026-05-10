import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InstallButton from "@/components/InstallButton";
import PublicNavbar from "@/components/PublicNavbar";

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
    <main className="min-h-screen bg-transparent overflow-x-hidden grid-overlay">
      <PublicNavbar />
      {/* Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-maroon/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-maroon/5 rounded-full blur-[120px]" />
      </div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-border/10 border border-surface-border text-gold-dynamic text-xs mb-8 animate-fade-in">
            ஒரத்தநாடு சட்டமன்றத் தொகுதி – 175
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 leading-tight animate-fade-in-up display-font">
            <span className="tamil gradient-text">தமிழக வெற்றி</span>
            <br />
            <span className="text-foreground">கழகம்</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl mb-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Thamizhaga Vetri Kazhagam
          </p>

          {/* Motto */}
          <div className="my-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="inline-block px-8 py-4 rounded-2xl bg-white/2 border border-surface-border">
              <p className="tamil text-gold-dynamic text-2xl md:text-3xl font-bold tracking-wide">
                "பிறப்பொக்கும் எல்லா உயிர்க்கும்"
              </p>
              <p className="text-text-muted text-sm mt-1">All beings are equal in birth</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/login"
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
        <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-4 display-font">
          மக்களுக்கான <span className="gradient-text">சேவைகள்</span>
        </h2>
        <p className="text-center text-text-muted mb-16 uppercase text-xs font-bold tracking-widest">Digital services for Constituency 175</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-10 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center text-xl mb-6 border border-surface-border">
                {f.icon}
              </div>
              <h3 className="text-foreground font-bold text-lg mb-1">{f.title}</h3>
              <p className="tamil text-gold-dynamic font-bold text-sm mb-4">{f.titleTa}</p>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 px-4 text-center">
        <p className="tamil text-gold-dynamic font-black text-lg">தமிழக வெற்றி கழகம்</p>
        <p className="text-text-muted text-sm mt-1">ஒரத்தநாடு சட்டமன்றத் தொகுதி – 175</p>
        <p className="text-text-muted/50 text-xs mt-3">© 2026 TVK Orathanadu. All rights reserved.</p>
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
