'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Upload, Image as ImageIcon, CheckCircle2, Trash2, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function AppSettingsPage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [backgrounds, setBackgrounds] = useState<string[]>([
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modal confirm targets
  const [deleteSlideIndex, setDeleteSlideIndex] = useState<number | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  useEffect(() => {
    try {
      const storedLogo = localStorage.getItem('siakal_custom_logo');
      if (storedLogo) setLogoUrl(storedLogo);

      const storedBgs = localStorage.getItem('siakal_custom_backgrounds');
      if (storedBgs) {
        const parsed = JSON.parse(storedBgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBackgrounds(parsed);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const persistBranding = (newLogo: string, newBgs: string[]) => {
    try {
      localStorage.setItem('siakal_custom_logo', newLogo);
      localStorage.setItem('siakal_custom_backgrounds', JSON.stringify(newBgs));
      window.dispatchEvent(new Event('siakal_branding_updated'));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('LocalStorage error:', err);
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (PNG, JPG, WEBP).');
      return;
    }

    const compressedLogo = await compressImage(file, 300, 0.8);
    setLogoUrl(compressedLogo);
    persistBranding(compressedLogo, backgrounds);
  };

  const handleBgFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const compressedList: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file, 800, 0.7);
        compressedList.push(compressed);
      }
    }

    if (compressedList.length > 0) {
      const updatedBgs = [...backgrounds, ...compressedList];
      setBackgrounds(updatedBgs);
      persistBranding(logoUrl, updatedBgs);
    }
  };

  const confirmRemoveBg = () => {
    if (deleteSlideIndex === null) return;
    const updatedBgs = backgrounds.filter((_, i) => i !== deleteSlideIndex);
    setBackgrounds(updatedBgs);
    persistBranding(logoUrl, updatedBgs);
    setDeleteSlideIndex(null);
  };

  const confirmResetToDefault = () => {
    localStorage.removeItem('siakal_custom_logo');
    localStorage.removeItem('siakal_custom_backgrounds');
    const defaultBgs = [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
    ];
    setLogoUrl('');
    setBackgrounds(defaultBgs);
    window.dispatchEvent(new Event('siakal_branding_updated'));
    setShowResetConfirmModal(false);
  };

  const handleSaveSettings = () => {
    persistBranding(logoUrl, backgrounds);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Pengaturan Branding & Landing Page Dinamis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Unggah Logo Kampus resmi dan atur multi-foto latar belakang dari perangkat komputer Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirmModal(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:text-red-500 flex items-center gap-1.5 shrink-0 shadow-sm"
          title="Reset ke Standar"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold text-center shadow-lg">
          ✓ Pengaturan Logo & Multi-Foto Background Lokal Berhasil Disimpan!
        </div>
      )}

      {/* 1. UPLOAD LOGO KAMPUS DARI LOCAL FILE */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4.5 h-4.5 text-sky-500 dark:text-sky-400" />
          <span>1. Upload Logo Kampus Resmi (File Lokal)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Gambar Logo dari Komputer (.PNG / .JPG / .SVG)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileUpload}
              className="hidden"
              id="local-logo-input"
            />
            <label
              htmlFor="local-logo-input"
              className="glass-panel p-5 border-2 border-dashed border-sky-500/40 hover:border-sky-500 cursor-pointer flex flex-col items-center justify-center text-center transition-all bg-sky-500/5 hover:bg-sky-500/10 rounded-xl"
            >
              <Upload className="w-7 h-7 text-sky-500 dark:text-sky-400 mb-1.5" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Klik untuk Upload File Logo Lokal</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Format PNG Transparan direkomendasikan</span>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-center space-y-2 flex flex-col items-center justify-center h-full">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pratinjau Logo</span>
            <div className="w-24 h-24 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 shadow-inner">
              {logoUrl ? (
                <img src={logoUrl} alt="Pratinjau Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">Belum Ada Logo</span>
              )}
            </div>
            {logoUrl && (
              <button
                type="button"
                onClick={() => {
                  setLogoUrl('');
                  persistBranding('', backgrounds);
                }}
                className="text-xs text-red-500 hover:underline font-bold"
              >
                Hapus Logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. UPLOAD MULTI-FOTO BACKGROUND CAROUSEL DARI LOCAL FILE */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400" />
              <span>2. Carousel Multi-Foto Background Fluid Landing Page</span>
            </h3>
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBgFilesUpload}
              className="hidden"
              id="local-bg-files-input"
            />
            <label
              htmlFor="local-bg-files-input"
              className="glass-button text-xs font-bold py-2.5 px-4 cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Upload Foto dari Komputer</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {backgrounds.map((bg, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 group h-44 bg-slate-900 shadow-md"
            >
              <img src={bg} alt={`Background Slide ${idx + 1}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => setDeleteSlideIndex(idx)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Slide Ini</span>
                </button>
              </div>

              <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-sky-400 border border-white/10">
                Slide {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={handleSaveSettings} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-3 px-6 shadow-xl">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>Simpan Perubahan Branding</span>
        </button>
      </div>

      {/* POPUP MODAL KONFIRMASI HAPUS SLIDE FOTO */}
      {deleteSlideIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-sm p-6 space-y-4 shadow-2xl border border-red-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Hapus Slide Foto</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Apakah Anda yakin ingin menghapus Slide Foto Carousel ini? Foto tidak akan ditampilkan lagi di landing page.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteSlideIndex(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmRemoveBg}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL KONFIRMASI RESET DEFAULTS */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-sm p-6 space-y-4 shadow-2xl border border-amber-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Reset Pengaturan</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Apakah Anda yakin ingin mengembalikan logo & foto carousel ke pengaturan standar bawaan?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmResetToDefault}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
