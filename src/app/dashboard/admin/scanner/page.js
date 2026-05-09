"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { verifyUserAction } from "@/actions/verification";
import { User, CheckCircle, XCircle, Loader2, ShieldCheck, Camera } from "lucide-react";

export default function ScannerPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
      });

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isScanning]);

  async function onScanSuccess(decodedText) {
    try {
      setIsScanning(false);
      setLoading(true);
      setError(null);

      // Parse the QR data
      const data = JSON.parse(decodedText);
      if (data.type !== "TVK_VERIFY" || !data.id) {
        throw new Error("Invalid QR Code: Not a TVK verification code");
      }

      // Verify with server
      const res = await verifyUserAction(data.id);
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.user);
      }
    } catch (err) {
      setError(err.message || "Failed to process QR code");
    } finally {
      setLoading(false);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    }
  }

  function onScanError(err) {
    // Silent errors during scanning are normal (no code in view)
  }

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white display-font mb-2 uppercase tracking-tight">
          Identity <span className="gradient-text">Scanner</span>
        </h1>
        <p className="text-white/40 text-xs md:text-sm uppercase font-black tracking-widest">
          Event Verification Terminal
        </p>
      </div>

      <div className="glass-card overflow-hidden border-white/5 relative">
        {isScanning && (
          <div className="p-4 bg-black">
            <div id="reader" className="w-full overflow-hidden rounded-xl border border-white/10" />
            <div className="mt-4 flex items-center justify-center gap-2 text-white/30 animate-pulse">
              <Camera size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Align QR Code in Frame</span>
            </div>
          </div>
        )}

        {(loading || result || error) && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
            {loading && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-[#FFD700]" />
                <p className="text-[#FFD700] text-xs font-black uppercase tracking-widest">Verifying Identity...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <XCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Verification Failed</h3>
                <p className="text-red-400/80 text-sm mb-8 font-medium max-w-[250px]">{error}</p>
                <button onClick={resetScanner} className="btn-secondary w-full">Try Again</button>
              </div>
            )}

            {result && (
              <div className="w-full animate-fade-in-up">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Access Granted</h3>
                  <div className="flex items-center gap-2 text-green-500">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Member</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#FFD700]/20 flex items-center justify-center overflow-hidden">
                      {result.image ? <img src={result.image} className="w-full h-full object-cover" /> : <User className="text-[#FFD700]" size={20} />}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-lg leading-none">{result.name}</p>
                      <p className="text-[#FFD700] text-[10px] font-black uppercase tracking-widest mt-1">{result.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[8px] uppercase font-black text-white/20 tracking-widest mb-1">Booth</p>
                      <p className="text-xs font-bold text-white">{result.boothNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase font-black text-white/20 tracking-widest mb-1">Panchayat</p>
                      <p className="text-xs font-bold text-white truncate">{result.panchayat || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <button onClick={resetScanner} className="btn-primary w-full mt-8 uppercase tracking-widest font-black text-xs">
                  Next Verification
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        #reader {
          border: none !important;
        }
        #reader__scan_region {
          background: #000;
        }
        #reader__dashboard_section_csr button {
          background: #800000 !important;
          color: #FFD700 !important;
          border: 1px solid rgba(255,215,0,0.2) !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.1em !important;
        }
      `}</style>
    </div>
  );
}
