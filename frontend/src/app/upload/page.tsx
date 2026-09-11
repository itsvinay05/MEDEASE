'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPrescription, processPrescription } from '../../services/api';
import { useLanguage } from '../../hooks/useLanguage';
import {
  UploadCloud, FileImage, AlertTriangle,
  CheckCircle2, ArrowRight, X
} from 'lucide-react';

export default function UploadPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [qualityWarning, setQualityWarning] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    t('processing_step1'),
    t('processing_step2'),
    t('processing_step3'),
    t('processing_step4')
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);
    setQualityWarning([]);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setCurrentStep(0);
      setErrorMessage(null);

      const uploadRes = await uploadPrescription(selectedFile);
      if (uploadRes.warning && uploadRes.warning.length > 0) {
        setQualityWarning(uploadRes.warning);
      }

      setCurrentStep(1);
      await new Promise(r => setTimeout(r, 600));

      setCurrentStep(2);
      await new Promise(r => setTimeout(r, 700));

      setCurrentStep(3);
      await processPrescription(uploadRes.prescription_id);
      await new Promise(r => setTimeout(r, 500));

      router.push(`/verify/${uploadRes.prescription_id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process prescription.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('upload_title')}
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Upload a clear photo or scan of your doctor's prescription. MEDEASE validates quality, runs extraction, and requires your verification before scheduling.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-xs sm:text-sm text-rose-900 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-teal-50/40 space-y-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  {t('upload_drop')}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {t('upload_support')}
                </p>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 flex items-center space-x-1.5">
                  <FileImage className="w-4 h-4 text-slate-500" />
                  <span>{t('btn_choose_file')}</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden max-h-[420px] flex items-center justify-center p-4 border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl!}
                  alt="Prescription Preview"
                  className="max-h-[380px] w-auto object-contain rounded shadow-lg"
                />

                {!isProcessing && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setQualityWarning([]);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {qualityWarning.length > 0 && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                  <div className="font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Image Quality Notice:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {qualityWarning.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isProcessing ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Processing Prescription</span>
                    <span>Step {currentStep + 1} of {steps.length}</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    {steps.map((s, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-2 text-xs transition-opacity ${
                          idx === currentStep
                            ? 'text-teal-900 font-bold opacity-100'
                            : idx < currentStep
                            ? 'text-slate-400 opacity-60'
                            : 'text-slate-300 opacity-40'
                        }`}
                      >
                        {idx < currentStep ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : idx === currentStep ? (
                          <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUploadAndAnalyze}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all"
                  >
                    <span>{t('btn_process')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
