'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Reminder, AdherenceReport } from '../../types';
import { getTodaySchedule, getAdherenceReport, loadDemoFixture, cleanupScheduleDuplicates } from '../../services/api';
import { useLanguage } from '../../hooks/useLanguage';
import AdherenceCard from '../../components/AdherenceCard';
import TodayScheduleTimeline from '../../components/TodayScheduleTimeline';
import {
  Upload, Sparkles, AlertTriangle, ShieldCheck,
  Calendar, CheckCircle2, ArrowRight, FileText, RotateCcw
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [adherence, setAdherence] = useState<AdherenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [rems, adh] = await Promise.all([
        getTodaySchedule().catch(() => []),
        getAdherenceReport().catch(() => null)
      ]);
      setReminders(rems);
      setAdherence(adh);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLaunchDemo = async (type: 'success' | 'controlled_failure' | 'actual_prescription') => {
    try {
      setDemoLoading(type);
      const res = await loadDemoFixture(type);
      if (res && res.prescription_id) {
        router.push('/verify/' + res.prescription_id);
      }
    } catch (err) {
      console.error('Failed to load demo:', err);
    } finally {
      setDemoLoading(null);
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      setCleaning(true);
      await cleanupScheduleDuplicates();
      await fetchData();
    } catch (err) {
      console.error('Failed to cleanup duplicates:', err);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Medication & Adherence Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('tagline')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/upload"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{t('cta_upload')}</span>
            </Link>

            <button
              type="button"
              onClick={() => handleLaunchDemo('actual_prescription')}
              disabled={demoLoading !== null}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/40 font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>{demoLoading === 'actual_prescription' ? 'Loading Real Rx...' : 'Actual Rx (Sai Ram Clinic)'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchDemo('controlled_failure')}
              disabled={demoLoading !== null}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{demoLoading === 'controlled_failure' ? 'Loading...' : 'Demo: Controlled Failure'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchDemo('success')}
              disabled={demoLoading !== null}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{demoLoading === 'success' ? 'Loading...' : 'Demo: Verified Path'}</span>
            </button>

            <button
              type="button"
              onClick={handleCleanupDuplicates}
              disabled={cleaning}
              title="Clean duplicate test doses"
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-medium text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${cleaning ? 'animate-spin text-teal-600' : 'text-slate-500'}`} />
              <span>{cleaning ? 'Cleaning...' : 'Deduplicate Doses'}</span>
            </button>
          </div>
        </div>


        {/* Top Grid: Adherence + Safety Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdherenceCard report={adherence} />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Deterministic Safety Gate</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                Prescription Verification Rules
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduling is permanently blocked for medications with missing or uncertain frequency, duration, or unverified drug identity.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 font-mono">
              Status: Safety Gate Active (v1.0.0)
            </div>
          </div>
        </div>

        {/* Bottom Section: Today's Timeline */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mb-3" />
            <p className="text-sm font-medium">Loading schedule and reminders...</p>
          </div>
        ) : (
          <TodayScheduleTimeline
            reminders={reminders}
            onStatusChange={fetchData}
          />
        )}

      </div>
    </div>
  );
}
