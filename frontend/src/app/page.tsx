'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../hooks/useLanguage';
import { loadDemoFixture } from '../services/api';
import {
  ShieldCheck, Upload, Sparkles, AlertTriangle, CheckCircle2,
  Calendar, Volume2, ArrowRight, Pill, FileText, Lock
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  const handleDemo = async (type: 'success' | 'controlled_failure' | 'actual_prescription') => {
    try {
      setLoadingDemo(type);
      const res = await loadDemoFixture(type);
      if (res && res.prescription_id) {
        router.push('/verify/' + res.prescription_id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Safety Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold tracking-wide shadow-xs">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Safety-First Healthcare Prescription Assistant</span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-teal-700">
            {t('tagline')}
          </p>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Core CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-lg mx-auto">
          <Link
            href="/upload"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>{t('cta_upload')}</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base flex items-center justify-center space-x-2 border border-slate-300 shadow-sm transition-all"
          >
            <Calendar className="w-5 h-5 text-slate-600" />
            <span>{t('nav_dashboard')}</span>
          </Link>
        </div>

        {/* Featured Prototype: Actual Real-World Prescription Card */}
        <div className="pt-4 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-teal-500/30 text-left space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-500 text-slate-950 p-2.5 rounded-2xl font-black">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black tracking-tight text-white">
                      Actual Prescription Prototype
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider bg-teal-400 text-slate-950 font-black px-2 py-0.5 rounded">
                      Real Rx
                    </span>
                  </div>
                  <p className="text-xs text-teal-200">
                    Sai Ram Clinic (Dr. Sachin Patil) • Patient: Mr. Aman (19 yr, M)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDemo('actual_prescription')}
                disabled={loadingDemo !== null}
                className="px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all self-stretch sm:self-auto cursor-pointer"
              >
                <span>{loadingDemo === 'actual_prescription' ? 'Processing Real Rx...' : 'Launch Actual Rx Prototype'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
              Features genuine handwritten cursive from Sai Ram Clinic for Cold, Throat irritation, and Fever. Contains 4 medications: <strong>Opox-CV 200mg</strong> (1-0-1), <strong>Aldigesic-SP</strong> (1-0-1), <strong>Breezy</strong> (0-0-1), and <strong>Pan-D 40mg</strong> with Safety-Gated timing verification!
            </p>
          </div>
        </div>

        {/* Other Interactive Demo Fixtures */}
        <div className="max-w-3xl mx-auto pt-2">
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Standard Test Benchmarks
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-slate-600">
                Deterministic Synthetic Fixtures
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Demo 1: Verified */}
              <button
                type="button"
                onClick={() => handleDemo('success')}
                disabled={loadingDemo !== null}
                className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-300 text-left transition-all group flex flex-col justify-between space-y-2 cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Path (Paracetamol 650mg)</span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Paracetamol 650mg, BD x 5 days. All fields high confidence. Unlocks instantly.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 pt-1">
                  <span>{loadingDemo === 'success' ? 'Loading...' : 'Launch Verified Path'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* Demo 2: Controlled Failure */}
              <button
                type="button"
                onClick={() => handleDemo('controlled_failure')}
                disabled={loadingDemo !== null}
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-300 text-left transition-all group flex flex-col justify-between space-y-2 cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Controlled Failure (Unclear BD 58%)</span>
                  </div>
                  <p className="text-xs text-amber-900 mt-1">
                    Pantoprazole 40mg with low confidence frequency. Scheduling is strictly BLOCKED!
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 flex items-center space-x-1 pt-1">
                  <span>{loadingDemo === 'controlled_failure' ? 'Loading...' : 'Launch Failure Path'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Safety Gate Pillars */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('safety_principle_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('safety_principle_text')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Deterministic Safety Gate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never delegate medical decisions to an LLM alone. The backend enforces strict validation: any missing, conflicting, or low-confidence frequency or duration blocks schedule generation.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center font-bold">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reference Formulary Validation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every recognized medicine is normalized against verified reference formularies for canonical names, active generic substances, strengths, and standard indications.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Multilingual Voice Reminders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accessible reminders in English, Hindi (हिंदी), and Telugu (తెలుగు) using browser SpeechSynthesis with robust visible text fallbacks so no dose is forgotten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Footer Callout */}
      <section className="py-8 px-4 max-w-4xl mx-auto text-center">
        <p className="text-xs text-slate-500 italic">
          * MEDEASE does not diagnose, prescribe, change dosages, or substitute medications. It is designed to assist patients in understanding their doctor's verified instructions.
        </p>
      </section>

    </div>
  );
}
