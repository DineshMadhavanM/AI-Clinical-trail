import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Upload, FileText, X, Database } from 'lucide-react';
import { apiService } from '../../services/api';
import { ExtractedPatientData } from '../../types';

interface MedicalExtractorProps {
  onApplyExtractedData: (data: ExtractedPatientData) => void;
}

export const MedicalExtractor: React.FC<MedicalExtractorProps> = ({ onApplyExtractedData }) => {
  const navigate = useNavigate();
  const [text, setText] = useState<string>(
    'I am a 55-year-old male diagnosed with Stage III Non-Small Cell Lung Cancer. I previously received chemotherapy and currently have EGFR positive results.'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [extracted, setExtracted] = useState<ExtractedPatientData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler for .pdf, .txt, .docx, .csv, .json
  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    try {
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const fileContent = await file.text();
        setText(fileContent);
      }
      // Upload file to backend endpoint which extracts AND stores patient in DB
      const result = await apiService.uploadMedicalDocument(file);
      setExtracted(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to extract medical document data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleExtractText = async () => {
    if (!text || !text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.extractMedicalInfo(text);
      setExtracted(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to extract medical information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Method 1: AI Medical Document File Upload & NLP Extractor</h2>
          <p className="text-xs text-slate-400">
            Upload medical files (<strong>.PDF, .TXT, .DOCX, .CSV, .JSON</strong>) to extract patient parameters and automatically store them in the database for trial matching.
          </p>
        </div>
      </div>

      {/* File Upload Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          accept=".txt,.pdf,.doc,.docx,.md,.json,.csv"
          className="hidden"
        />

        <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>

        <div>
          <p className="text-xs font-bold text-slate-200">
            {selectedFile ? `Uploaded File: ${selectedFile.name}` : 'Click to Select or Drag & Drop File (.PDF, .TXT, .DOCX, .CSV, .JSON)'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Extracts patient details, saves profile directly to database, and enables Explainable AI Matching.
          </p>
        </div>
      </div>

      {/* Manual Clinical Text Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Or Paste Clinical Narrative Notes</label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., 55 y/o female diagnosed with Stage II Triple-Negative Breast Cancer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 italic">
            Supports extraction & database storage for Demographics, Condition, Stage, Biomarkers, & Therapies.
          </span>

          <button
            onClick={handleExtractText}
            disabled={loading || (!text && !selectedFile)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Processing Document...' : 'Run AI Extractor'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-800/60 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted Data & Database Save Confirmation */}
      {extracted && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
          {extracted.saved_patient_id && (
            <div className="bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 p-3 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Extracted Patient Stored in Database as Patient #{extracted.saved_patient_id} ({extracted.patient_name})</span>
              </div>
              <button
                onClick={() => navigate('/matching', { state: { patientId: extracted.saved_patient_id } })}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow"
              >
                <span>Run XAI Matching</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Extracted Clinical Parameters</span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Confidence: {(extracted.confidence_score * 100).toFixed(0)}%</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Patient Name / ID</span>
              <span className="font-bold text-slate-200">{extracted.patient_name || 'Extracted Patient'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Primary Condition</span>
              <span className="font-bold text-cyan-300">{extracted.primary_condition || 'Unspecified'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Disease Stage</span>
              <span className="font-bold text-slate-200">{extracted.disease_stage || 'Unspecified'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Biomarkers Detected</span>
              <span className="font-bold text-purple-300">{extracted.biomarkers?.map(b => `${b.marker_name}:${b.status}`).join(', ') || 'None'}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => onApplyExtractedData(extracted)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Apply to Form (Method 2)</span>
            </button>

            {extracted.saved_patient_id && (
              <button
                onClick={() => navigate('/matching', { state: { patientId: extracted.saved_patient_id } })}
                className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Go to Explainable AI Matching</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
