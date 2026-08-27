import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, ArrowRight, PlusCircle, ArrowLeft, Building2, Phone, Stethoscope, CheckCircle2 } from 'lucide-react';
import { MedicalExtractor } from '../components/patient/MedicalExtractor';
import { PatientForm } from '../components/patient/PatientForm';
import { ExtractedPatientData, Patient } from '../types';
import { apiService } from '../services/api';

export const PatientProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(true);
  const [extractedData, setExtractedData] = useState<ExtractedPatientData | null>(null);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const data = await apiService.getPatients();
      setPatients(data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleApplyExtracted = (data: ExtractedPatientData) => {
    setExtractedData(data);
    const el = document.getElementById('patient-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSuccess = (patient: Patient) => {
    setShowForm(false);
    fetchPatients();
    navigate('/matching', { state: { patientId: patient.id } });
  };

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
      {/* Title Header with Top Right Add Patient Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Patient Profile Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            {showForm ? 'Patient Profile Intake & AI Medical Document Extractor' : 'Registered Patient Profiles'}
          </h1>
          <p className="text-xs text-slate-400">
            {showForm
              ? 'Upload medical files in Method 1 or fill patient details manually in Method 2.'
              : 'Review existing registered patient details or register a new candidate.'}
          </p>
        </div>

        {/* Top Right-Most Add Patient Button */}
        <div>
          {showForm ? (
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patient Details</span>
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-900/30 transition-all hover:scale-[1.02] border border-cyan-400/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      </div>

      {!showForm ? (
        /* Patient Details List View */
        <div className="space-y-4">
          {loadingPatients ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading registered patients...</div>
          ) : patients.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <User className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No patient profiles registered yet.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click the <strong>Add Patient</strong> button at the top right to extract or enter a patient profile.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Patient Profile Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {patients.map((patient) => {
                const isConfirmed = Boolean(patient.confirmed_trial_id);
                return (
                  <div
                    key={patient.id}
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                          #{patient.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {isConfirmed && (
                              <span className="text-emerald-400 font-bold text-xs bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/60 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ✔ Verified Candidate
                              </span>
                            )}
                            <h3 className="text-base font-bold text-slate-100">
                              {patient.patient_name || `Patient #${patient.id}`}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {patient.age} y/o {patient.gender} • <span className="text-cyan-300 font-medium">{patient.primary_condition}</span> ({patient.disease_stage || 'N/A'})
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/matching', { state: { patientId: patient.id } })}
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0"
                      >
                        <span>Match Against Trials</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Phone: <strong className="text-slate-200">{patient.phone_number || 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hospital: <strong className="text-slate-200">{patient.hospital_name || 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        <span>Physician: <strong className="text-slate-200">{patient.treating_physician || 'N/A'}</strong></span>
                      </div>
                    </div>

                    {isConfirmed && (
                      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✔ Confirmed Clinical Trial Protocol</span>
                        </div>
                        <div className="text-slate-200 font-mono text-[11px]">
                          <strong>Protocol ID:</strong> <span className="text-cyan-300">{patient.confirmed_trial_id}</span>
                        </div>
                        <div className="text-slate-300 text-xs">
                          <strong>Trial Title:</strong> {patient.confirmed_trial_title || 'Enrolled Study Protocol'}
                        </div>
                      </div>
                    )}

                    {((patient.biomarkers && patient.biomarkers.length > 0) || (patient.treatments && patient.treatments.length > 0)) && (
                      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800/40 text-[11px]">
                        {patient.biomarkers?.map((b, idx) => (
                          <span key={idx} className="bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 px-2.5 py-0.5 rounded-full font-medium">
                            Biomarker: {b.marker_name} ({b.status})
                          </span>
                        ))}
                        {patient.treatments?.map((t, idx) => (
                          <span key={idx} className="bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                            Prior Treatment: {t.treatment_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Patient Profile Intake & AI Extractor Form View */
        <div className="space-y-8 animate-fadeIn">
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
      )}
    </div>
  );
};

export default PatientProfilePage;
