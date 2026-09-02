'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Upload, Image as ImageIcon, CheckCircle2, Trash2, Plus, RefreshCw, AlertTriangle, Sparkles, Wand2, HardDrive, Link2, ExternalLink } from 'lucide-react';
import { DEFAULT_POLTEKTRANS_LOGO, DEFAULT_BACKGROUND_SLIDES } from '@/lib/defaultBranding';
import { getGoogleDriveDirectLink, extractGoogleDriveFileId, loadGoogleDriveConfig, saveGoogleDriveConfig, GoogleDriveConfig } from '@/lib/googleDrive';

// High-Resolution Image Compressor for Full HD 1080p Crystal Sharpness
function compressImage(file: File, maxWidth = 1920, quality = 0.85, isLogo = false): Promise<string> {
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

        if (isLogo) {
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Automatic Black Background Removal Filter for Transparent PNG Logos
function makeLogoTransparent(imageSrc: string, threshold = 45): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxVal = Math.max(r, g, b);

        if (maxVal <= threshold) {
          data[i + 3] = 0; // 100% Transparent
        } else if (maxVal <= threshold + 35) {
          // Smooth edge anti-aliasing transition
          const alphaRatio = (maxVal - threshold) / 35;
          data[i + 3] = Math.round(data[i + 3] * alphaRatio);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

export default function AppSettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [backgrounds, setBackgrounds] = useState<string[]>(DEFAULT_BACKGROUND_SLIDES);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);

  // Google Drive Cloud Storage State
  const [driveConfig, setDriveConfig] = useState<GoogleDriveConfig>({ isDriveActive: false, folderUrl: '' });
  const [driveFolderInput, setDriveFolderInput] = useState('');
  const [driveLogoInput, setDriveLogoInput] = useState('');
  const [driveBgInput, setDriveBgInput] = useState('');

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

      const cfg = loadGoogleDriveConfig();
      setDriveConfig(cfg);
      if (cfg.folderUrl) setDriveFolderInput(cfg.folderUrl);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const persistBranding = (newLogo: string, newBgs: string[]) => {
    try {
      if (newLogo && newLogo.trim().length > 0) {
        localStorage.setItem('siakal_custom_logo', newLogo);
      } else {
        localStorage.removeItem('siakal_custom_logo');
      }

      if (newBgs && newBgs.length > 0) {
        localStorage.setItem('siakal_custom_backgrounds', JSON.stringify(newBgs));
      } else {
        localStorage.removeItem('siakal_custom_backgrounds');
      }

      // Broadcast custom event so LandingSlider & Navbar update in real-time
      window.dispatchEvent(new Event('siakal_branding_updated'));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('LocalStorage quota error:', err);
      alert('Gagal menyimpan memori lokal browser. Gunakan Google Drive Link untuk file besar.');
    }
  };

  const handleSaveDriveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCfg: GoogleDriveConfig = {
      folderUrl: driveFolderInput,
      isDriveActive: driveFolderInput.trim().length > 0,
    };
    setDriveConfig(updatedCfg);
    saveGoogleDriveConfig(updatedCfg);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddDriveLogo = () => {
    if (!driveLogoInput) return;
    const directLink = getGoogleDriveDirectLink(driveLogoInput);
    setLogoUrl(directLink);
    persistBranding(directLink, backgrounds);
    setDriveLogoInput('');
  };

  const handleAddDriveBgSlide = () => {
    if (!driveBgInput) return;
    const directLink = getGoogleDriveDirectLink(driveBgInput);
    const updatedBgs = [...backgrounds, directLink];
    setBackgrounds(updatedBgs);
    persistBranding(logoUrl, updatedBgs);
    setDriveBgInput('');
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessingLogo(true);
    try {
      const rawCompressed = await compressImage(file, 500, 0.95, true);
      // Auto-remove black background for clean transparent PNG
      const transparentLogo = await makeLogoTransparent(rawCompressed, 45);
      setLogoUrl(transparentLogo);
      persistBranding(transparentLogo, backgrounds);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingLogo(false);
    }
  };

  const handleCleanCurrentLogo = async () => {
    if (!logoUrl) return;
    setIsProcessingLogo(true);
    try {
      const cleaned = await makeLogoTransparent(logoUrl, 55);
      setLogoUrl(cleaned);
      persistBranding(cleaned, backgrounds);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingLogo(false);
    }
  };

  const handleBgFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const compressedList: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file, 1920, 0.85, false);
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
    localStorage.removeItem('siakal_google_drive_config');
    setLogoUrl('');
    setBackgrounds(DEFAULT_BACKGROUND_SLIDES);
    setDriveFolderInput('');
    setDriveConfig({ isDriveActive: false });
    window.dispatchEvent(new Event('siakal_branding_updated'));
    setShowResetConfirmModal(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveSettings = () => {
    persistBranding(logoUrl, backgrounds);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-500" />
            <span>Pengaturan Branding & Google Drive Cloud Storage</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-semibold">
            Integrasikan akun Google Drive kampus untuk menyimpan logo, foto latar belakang, & berkas tanpa batas kuota.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirmModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-500 font-bold text-xs flex items-center gap-2 border border-slate-300 dark:border-white/10 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Perubahan Branding & Integrasi Google Drive Berhasil Disimpan!</span>
        </div>
      )}

      {/* GOOGLE DRIVE CLOUD STORAGE INTEGRATION MODULE */}
      <div className="glass-panel p-6 space-y-4 border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-500" />
            <span>Integrasi Folder Google Drive Kampus</span>
          </h3>

          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${driveConfig.isDriveActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'}`}>
            {driveConfig.isDriveActive ? '🟢 TERHUBUNG CLOUD DRIVE' : '🟡 MODE LOKAL'}
          </span>
        </div>

        <form onSubmit={handleSaveDriveConfig} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Link Folder Google Drive Kampus (Tempat Menyimpan Berkas Official)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={driveFolderInput}
                onChange={(e) => setDriveFolderInput(e.target.value)}
                placeholder="Tempelkan Link Folder Google Drive (cth: https://drive.google.com/drive/folders/1A2B3C...)"
                className="w-full glass-input text-xs font-mono"
              />
              <button type="submit" className="glass-button text-xs font-bold py-2.5 px-5 shrink-0">
                Hubungkan Folder
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              Semua link berkas yang berada di dalam folder ini otomatis dapat diakses 100% oleh SIAKAL V2 secara instan.
            </p>
          </div>
        </form>
      </div>

      {/* SECTION 1: UPLOAD LOGO KAMPUS (FILE LOKAL ATAU GOOGLE DRIVE) */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <Upload className="w-5 h-5 text-sky-500" />
          <span>1. Logo Kampus Resmi (Upload Lokal / Google Drive Link)</span>
        </h3>

        {/* Option A: Paste Google Drive Link */}
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-2">
          <label className="block text-xs font-extrabold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-sky-500" />
            <span>Option A: Tempelkan Link Gambar dari Google Drive (Resolusi Tajam Ultra HD 4K)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={driveLogoInput}
              onChange={(e) => setDriveLogoInput(e.target.value)}
              placeholder="Tempelkan Link File Gambar Google Drive (cth: https://drive.google.com/file/d/1A2B3C.../view)"
              className="w-full glass-input text-xs font-mono"
            />
            <button type="button" onClick={handleAddDriveLogo} className="glass-button text-xs font-bold py-2 px-4 shrink-0">
              Gunakan Link Drive
            </button>
          </div>
        </div>

        {/* Option B: Local File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          <div className="md:col-span-8 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Option B: Pilih Gambar Logo dari Komputer (.PNG / .JPG / .SVG)
            </label>

            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                onChange={handleLogoFileUpload}
                className="hidden"
                id="logo-upload-input"
              />
              <label
                htmlFor="logo-upload-input"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-sky-500/40 hover:border-sky-500 bg-slate-50 dark:bg-slate-900/50 hover:bg-sky-500/5 cursor-pointer transition-all text-center group"
              >
                <Upload className="w-7 h-7 text-sky-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {isProcessingLogo ? 'Sedang Memproses & Membersihkan Background Logo...' : 'Klik untuk Upload File Logo Lokal'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  Sistem otomatis membersihkan background hitam menjadi PNG transparan 100%
                </span>
              </label>
            </div>
          </div>

          {/* Logo Preview Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3 text-center">
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              PRATINJAU LOGO
            </span>
            <div className="w-28 h-28 rounded-2xl bg-slate-200/60 dark:bg-slate-950 p-3 flex items-center justify-center border border-slate-300 dark:border-white/10 shadow-inner overflow-hidden">
              <img
                src={getGoogleDriveDirectLink(logoUrl || DEFAULT_POLTEKTRANS_LOGO)}
                alt="Logo Preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_POLTEKTRANS_LOGO;
                }}
              />
            </div>

            {logoUrl && (
              <div className="space-y-2 w-full">
                <button
                  type="button"
                  onClick={handleCleanCurrentLogo}
                  disabled={isProcessingLogo}
                  className="w-full py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>✨ Hilangkan Background Hitam</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl('');
                    persistBranding('', backgrounds);
                  }}
                  className="text-xs text-red-500 hover:underline font-bold"
                >
                  Hapus Logo Custom
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: CAROUSEL MULTI-FOTO BACKGROUND (GOOGLE DRIVE / LOKAL) */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <span>2. Carousel Multi-Foto Background Landing Page (Full HD 1080p Sharpness)</span>
          </h3>

          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBgFilesUpload}
              className="hidden"
              id="bg-upload-input"
            />
            <label
              htmlFor="bg-upload-input"
              className="glass-button text-xs font-bold py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Foto dari Komputer</span>
            </label>
          </div>
        </div>

        {/* Option A: Paste Google Drive Image Link for Background */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <label className="block text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-amber-500" />
            <span>Tambah Foto Latar Belakang dari Link Google Drive (Tajam Ultra HD 4K):</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={driveBgInput}
              onChange={(e) => setDriveBgInput(e.target.value)}
              placeholder="Tempelkan Link File Foto Google Drive (cth: https://drive.google.com/file/d/1A2B3C.../view)"
              className="w-full glass-input text-xs font-mono"
            />
            <button type="button" onClick={handleAddDriveBgSlide} className="glass-button text-xs font-bold py-2 px-4 shrink-0">
              Tambah Slide Drive
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {backgrounds.map((bg, idx) => {
            const displayUrl = getGoogleDriveDirectLink(bg);
            const isDriveLink = bg.includes('drive.google.com') || bg.includes('googleusercontent.com');

            return (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-slate-300 dark:border-white/15 bg-slate-950 aspect-video shadow-md"
              >
                <img src={displayUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-extrabold">
                    Slide {idx + 1}
                  </span>
                  {isDriveLink && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> Drive
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteSlideIndex(idx)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-500 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
                  title="Hapus Slide Ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveSettings}
          className="glass-button py-3.5 px-8 text-sm font-extrabold shadow-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Simpan Perubahan Branding</span>
        </button>
      </div>

      {/* CONFIRM DELETE SLIDE MODAL */}
      {deleteSlideIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 text-center space-y-4 border border-slate-300 dark:border-white/20 shadow-2xl relative bg-white dark:bg-slate-950">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Hapus Slide Latar Belakang?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Apakah Anda yakin ingin menghapus Slide #{deleteSlideIndex + 1} ini dari carousel landing page?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
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
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Ya, Hapus Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET DEFAULT MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 text-center space-y-4 border border-slate-300 dark:border-white/20 shadow-2xl relative bg-white dark:bg-slate-950">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Reset ke Branding Bawaan?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Logo dan foto latar belakang custom akan dikembalikan ke pengaturan awal institusi Poltektrans SDP.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
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
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Ya, Reset Bawaan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
