'use client';

import React, { useState } from 'react';
import { Archive, Download, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { createAcademicArchiveZip } from '@/lib/utils/zip';
import { getStoredItem, STORAGE_KEYS } from '@/lib/dbStorage';
import { initialAccounts, initialPeriodeList, initialProdiList } from '@/lib/mockStore';

export default function AdminArsipPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportZip = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const users = getStoredItem(STORAGE_KEYS.USERS, initialAccounts);
      const prodis = getStoredItem(STORAGE_KEYS.PRODIS, initialProdiList);
      const periods = getStoredItem(STORAGE_KEYS.PERIODES, initialPeriodeList);
      const activePeriod = periods.find((period: any) => period.isAktif) || periods[0];
      const achievements = getStoredItem<any[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
      const scholarships = getStoredItem<any[]>(STORAGE_KEYS.SCHOLARSHIP_APPLICATIONS, []);
      const clearances = getStoredItem<any[]>(STORAGE_KEYS.CLEARANCE_REQUESTS, []);
      const tracers = getStoredItem<any[]>(STORAGE_KEYS.TRACER_STUDIES, []);
      const surveys = getStoredItem<any[]>(STORAGE_KEYS.GRADUATE_SURVEYS, []);
      const scholarshipOffers = getStoredItem<any[]>(STORAGE_KEYS.SCHOLARSHIP_OFFERS, []);
      const scholarshipSelection = getStoredItem<any[]>(STORAGE_KEYS.SCHOLARSHIP_SELECTION, []);
      const magangGroups = getStoredItem<any[]>(STORAGE_KEYS.MAGANG_GROUPS, []);
      const magangLogs = getStoredItem<any[]>(STORAGE_KEYS.MAGANG_LOGS, []);
      const magangReports = getStoredItem<Record<string, any>>(STORAGE_KEYS.MAGANG_REPORTS, {});
      const fieldSupervisors = getStoredItem<any[]>(STORAGE_KEYS.FIELD_SUPERVISORS, []);
      const pralaData = getStoredItem<any>(STORAGE_KEYS.PRALA_DATA, null);
      const pralaReports = getStoredItem<any[]>(STORAGE_KEYS.PRALA_REPORTS, []);
      const pralaRecords = getStoredItem<any[]>(STORAGE_KEYS.PRALA_RECORDS, []);
      const surveyFollowUps = getStoredItem<any[]>(STORAGE_KEYS.SURVEY_FOLLOW_UPS, []);
      const unitProfiles = getStoredItem<any[]>(STORAGE_KEYS.UNIT_PROFILES, []);
      const summaryStats = [
        { Parameter: 'Total Program Studi', Value: prodis.length },
        { Parameter: 'Total Pengguna', Value: users.length },
        { Parameter: 'Total Prestasi', Value: achievements.length },
        { Parameter: 'Total Pengajuan Beasiswa', Value: scholarships.length },
        { Parameter: 'Total Clearance', Value: clearances.length },
        { Parameter: 'Total Tracer Study', Value: tracers.length },
        { Parameter: 'Total Survei Pengguna', Value: surveys.length },
        { Parameter: 'Tanggal Ekspor Arsip', Value: new Date().toLocaleDateString('id-ID') },
      ];

      await createAcademicArchiveZip(activePeriod?.tahun || 'Belum-Diatur', activePeriod?.semester || '-', {
        Ringkasan: summaryStats,
        Pengguna: users.map(({ initialPassword, ...user }) => user),
        Program_Studi: prodis,
        Prestasi: achievements,
        Beasiswa: scholarships,
        Penawaran_Beasiswa: scholarshipOffers,
        Seleksi_Beasiswa: scholarshipSelection,
        Clearance: clearances,
        Tracer_Study: tracers,
        Survei: surveys,
        RTL_Survei: surveyFollowUps,
        Kelompok_Magang: magangGroups,
        Aktivitas_Magang: magangLogs,
        Laporan_Magang: Object.values(magangReports),
        Pembimbing_Lapangan: fieldSupervisors,
        Data_PRALA: pralaData ? [pralaData] : [],
        Laporan_PRALA: pralaReports,
        Rekam_PRALA: pralaRecords,
        Profil_Unit: unitProfiles,
      });
      setDownloadSuccess(true);
    } catch (err) {
      alert('Gagal membuat paket arsip ZIP. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-purple-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            <span>Arsip Database Akademik (Format ZIP / PDF / Excel)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-semibold">
            Unduh seluruh arsip cadangan (backup) data akademik institusi dalam 1 paket file terkompresi ZIP.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold text-center shadow-lg">
          ✓ Paket Arsip Database Akademik (.ZIP) Berhasil Diunduh ke Komputer Anda!
        </div>
      )}

      <div className="glass-panel p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
          <Database className="w-8 h-8" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Ekspor Paket Arsip Cadangan (.ZIP)</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Paket ini berisi ringkasan data statistik akademik (CSV), dokumen pendukung, dan manifest lisensi sistem SIAKAL.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="glass-button py-3.5 px-8 text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            <span>{isExporting ? 'Membuat Paket ZIP...' : 'Unduh Arsip Cadangan Akademik (.ZIP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
