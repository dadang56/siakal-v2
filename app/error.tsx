'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Client Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="glass-panel max-w-md p-8 border border-white/20 space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">SIAKAL V2 - Pemulihan Halaman</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Terjadi pembaruan data tampilan atau penyesuaian memori lokal. Silakan klik tombol di bawah untuk menyegarkan tampilan.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              try {
                localStorage.removeItem('siakal_custom_backgrounds');
              } catch (e) {}
              reset();
              window.location.reload();
            }}
            className="glass-button text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      </div>
    </div>
  );
}
