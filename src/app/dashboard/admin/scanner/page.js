"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { verifyUserAction } from "@/actions/verification";
import { getEvents } from "@/actions/event";
import { User, CheckCircle, XCircle, Loader2, ShieldCheck, Camera, Calendar } from "lucide-react";

export default function ScannerPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("Constituency Meeting");
  const scannerRef = useRef(null);

  useEffect(() => {
    async function fetchEvents() {
      const activeEvents = await getEvents();
      setEvents(activeEvents.filter(e => e.isActive));
      if (activeEvents.length > 0) {
        setSelectedEvent(activeEvents[0].title);
      }
    }
    fetchEvents();
  }, []);

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
        scannerRef.current.clear().catch(console.error);
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

      // Verify with server using selected event
      const res = await verifyUserAction(data.id, selectedEvent);
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
        <h1 className="text-4xl font-bold text-foreground display-font mb-2 uppercase tracking-tight">
          Identity <span className="gradient-text">Scanner</span>
        </h1>
        <p className="text-text-muted text-xs md:text-sm uppercase font-black tracking-widest">
          Event Verification Terminal
        </p>
      </div>

      {isScanning && (
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col gap-1 mb-2 px-1">
            <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.2em] flex items-center gap-2">
              <Calendar size={12} className="text-gold-dynamic" /> Active Event
            </label>
          </div>
          <select 
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="input-dark bg-black/40 border-surface-border py-3 text-sm font-bold uppercase tracking-wider"
          >
            {events.length > 0 ? events.map(e => (
              <option key={e._id} value={e.title}>{e.title}</option>
            )) : (
              <option value="Constituency Meeting">Constituency Meeting</option>
            )}
          </select>
        </div>
      )}

      <div className="glass-card overflow-hidden border-surface-border relative transition-colors shadow-2xl">
        {isScanning && (
          <div 
            className="p-6 transition-colors"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <div id="reader" className="w-full overflow-hidden rounded-2xl border border-surface-border shadow-inner" />
            <div className="mt-6 flex items-center justify-center gap-3 text-text-muted animate-pulse">
              <Camera size={16} className="text-gold-dynamic" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Align QR Code in Frame</span>
            </div>
          </div>
        )}

        {(loading || result || error) && (
          <div 
            className="p-8 flex flex-col items-center justify-center min-h-[350px] animate-fade-in"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            {loading && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-gold-dynamic" />
                <p className="text-gold-dynamic text-xs font-black uppercase tracking-widest">Verifying Identity...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <XCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 uppercase tracking-tight">Verification Failed</h3>
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
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-1">Access Granted</h3>
                  <div className="flex items-center gap-2 text-green-500">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Member</span>
                  </div>
                </div>

                <div className="bg-surface-border/10 rounded-2xl p-6 border border-surface-border space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#FFD700]/20 flex items-center justify-center overflow-hidden">
                      {result.image ? <img src={result.image} className="w-full h-full object-cover" /> : <User className="text-gold-dynamic" size={20} />}
                    </div>
                    <div className="text-left">
                      <p className="text-foreground font-bold text-lg leading-none">{result.name}</p>
                      <p className="text-gold-dynamic text-[10px] font-black uppercase tracking-widest mt-1">{result.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-border">
                    <div>
                      <p className="text-[8px] uppercase font-black text-text-muted/50 tracking-widest mb-1">Booth</p>
                      <p className="text-xs font-bold text-foreground">{result.boothNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase font-black text-text-muted/50 tracking-widest mb-1">Panchayat</p>
                      <p className="text-xs font-bold text-foreground truncate">{result.panchayat || "N/A"}</p>
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
          background: transparent !important;
        }
        #reader__scan_region {
          background: var(--background) !important;
          border-radius: 1.5rem !important;
        }
        #reader__dashboard_section_csr button {
          background: #800000 !important;
          color: #FFD700 !important;
          border: 1px solid rgba(255,215,0,0.2) !important;
          border-radius: 10px !important;
          padding: 10px 20px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          box-shadow: 0 4px 14px 0 rgba(128,0,0,0.3) !important;
        }
        #reader__dashboard_section_csr span {
          color: var(--text-muted) !important;
          font-size: 11px !important;
          font-weight: bold !important;
        }
        #reader__dashboard_section_csr a {
          color: var(--gold-text) !important;
          font-weight: bold !important;
        }
      `}</style>
    </div>
  );
}
