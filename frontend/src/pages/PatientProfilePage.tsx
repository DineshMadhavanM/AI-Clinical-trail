import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, ArrowRight, FileText, Edit3 } from 'lucide-react';
import { MedicalExtractor } from '../components/patient/MedicalExtractor';
import { PatientForm } from '../components/patient/PatientForm';
import { ExtractedPatientData, Patient } from '../types';

export const PatientProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [extractedData, setExtractedData] = useState<ExtractedPatientData | null>(null);

  const handleApplyExtracted = (data: ExtractedPatientData) => {
    setExtractedData(data);
    // Smooth scroll to structured form
    const el = document.getElementById('patient-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSuccess = (patient: Patient) => {
    // Navigate to matching page with created patient ID
    navigate('/matching', { state: { patientId: patient.id } });
  };

  // Convert ExtractedPatientData to Partial<Patient>
  const initialFormData: Partial<Patient> | undefined = extractedData
    ? {
        age: extractedData.age || 55,
        gender: extractedData.gender || 'Male',
        primary_condition: extractedData.primary_condition || 'Non-Small Cell Lung Cancer',
        disease_stage: extractedData.disease_stage || 'Stage III',
        biomarkers: extractedData.biomarkers.map((b) => ({
          marker_name: b.marker_name,
          status: b.status as any,
        })),
        treatments: extractedData.treatments.map((t) => ({
          treatment_name: t,
          treatment_type: 'prior',
        })),
        comorbidities: extractedData.comorbidities.map((c) => ({
          condition_name: c,
        })),
      }
    : undefined;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Patient Profile Management</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Patient Data Intake & AI Clinical Extractor</h1>
        <p className="text-xs text-slate-400">
          Choose <strong>Method 1</strong> to upload medical documents for AI extraction, or <strong>Method 2</strong> to enter patient profile details manually.
        </p>
      </div>

      {/* Method 1: AI NLP Document Extractor */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
          <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 text-xs">M1</div>
          <span>Method 1: Upload Medical File or Clinical Text (AI NLP Extractor)</span>
        </div>
        <MedicalExtractor onApplyExtractedData={handleApplyExtracted} />
      </div>

      {/* Method 2: Manual Patient Profile Form */}
      <div id="patient-form-section" className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs">M2</div>
            <span>Method 2: Patient Registration & Profile Form</span>
          </div>

          {extractedData && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800/40 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Pre-filled from Method 1 NLP Extraction
            </span>
          )}
        </div>

        <PatientForm
          key={extractedData ? JSON.stringify(extractedData) : 'default'}
          initialData={initialFormData}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  );
};
