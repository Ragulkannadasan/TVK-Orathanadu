import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2000ms' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-accent rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '4000ms' }}></div>
      </div>

      <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 drop-shadow-2xl">
          <Image
            src="/icon.png"
            alt="TVK Loading"
            fill
            priority
            className="object-contain animate-pulse"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary display-font mb-4 tracking-tight">
          TVK Orathanadu
        </h1>
        
        <div className="flex items-center gap-2 text-text-muted mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="mt-6 text-sm font-medium tracking-widest uppercase text-muted-foreground animate-pulse">
          Loading your workspace...
        </p>
      </div>
    </div>
  );
}
