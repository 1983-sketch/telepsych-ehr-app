import { useState } from 'react';
import { ClipboardList, Plus, Trash2, HeartPulse, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PatientIntakeForm({ patientId, authToken, onSubmissionComplete }) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    chiefComplaint: '',
    pastPsychiatricHistory: '',
    pastMedicalHistory: '',
    historyOfSelfHarmOrSuicide: '',
    substanceUseHistory: '',
    familyPsychiatricHistory: '',
    currentMedications: [],
    knownAllergies: []
  });

  const [newMed, setNewMed] = useState({ name: '', dose: '', freq: '' });
  const [newAllergy, setNewAllergy] = useState({ allergy: '', reaction: '' });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addMedicationRow = () => {
    if (!newMed.name.trim()) return;

    setFormData((prev) => ({
      ...prev,
      currentMedications: [...prev.currentMedications, { ...newMed }]
    }));
    setNewMed({ name: '', dose: '', freq: '' });
  };

  const removeMedicationRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index)
    }));
  };

  const addAllergyRow = () => {
    if (!newAllergy.allergy.trim()) return;

    setFormData((prev) => ({
      ...prev,
      knownAllergies: [...prev.knownAllergies, { ...newAllergy }]
    }));
    setNewAllergy({ allergy: '', reaction: '' });
  };

  const removeAllergyRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      knownAllergies: prev.knownAllergies.filter((_, i) => i !== index)
    }));
  };

  const executeFormSubmission = async () => {
    if (!formData.chiefComplaint.trim()) {
      alert('Please complete Step 1: Chief Complaint before finalizing submission.');
      setStep(1);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/patient-portal/submit-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          patient_id: patientId || '8f3b2d1a-4c5e-6f7g-8h9i-0j1k2l3m4n5o',
          chief_complaint: formData.chiefComplaint,
          past_psychiatric_history: formData.pastPsychiatricHistory,
          past_medical_history: formData.pastMedicalHistory,
          history_of_self_harm_or_suicide: formData.historyOfSelfHarmOrSuicide,
          substance_use_history: formData.substanceUseHistory,
          family_psychiatric_history: formData.familyPsychiatricHistory,
          current_medications: formData.currentMedications,
          known_allergies: formData.knownAllergies
        })
      });

      if (response.ok) {
        alert('Success: Your clinical intake documentation has been encrypted and saved successfully!');
        if (onSubmissionComplete) onSubmissionComplete();
      } else {
        const errData = await response.json();
        alert(`Validation Error: ${errData.detail || 'Health record formatting failure.'}`);
      }
    } catch (err) {
      console.error('Transmission breakdown:', err);
      alert('Network processing error connecting to local FastAPI port 8000 server.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '30px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontFamily: 'sans-serif', color: '#1f2937', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ClipboardList style={{ color: '#2563eb' }} />
          <h2 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Clinical Intake Questionnaire</h2>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4b5563', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '12px' }}>
          Step {step} of 3
        </span>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Chief Complaint / Reason for Seeking Care *</label>
            <textarea
              required
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleTextChange}
              rows={4}
              placeholder="Please describe the main symptoms or issues you want to address in your own words..."
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', lineHeight: '1.5' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Past Psychiatric History</label>
            <textarea
              name="pastPsychiatricHistory"
              value={formData.pastPsychiatricHistory}
              onChange={handleTextChange}
              rows={3}
              placeholder="List any past psychiatric diagnoses, outpatient treatments, hospitalizations, or previous therapies..."
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#fef2f2', padding: '14px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> History of Self-Harm or Suicide Attempts
            </label>
            <textarea
              name="historyOfSelfHarmOrSuicide"
              value={formData.historyOfSelfHarmOrSuicide}
              onChange={handleTextChange}
              rows={2}
              placeholder="If applicable, please describe any past self-harm, suicidal intent, or critical behavioral crises safely..."
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '14px', backgroundColor: '#fff' }}
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}
          >
            Continue to Medical & Allergy Sheets ➔
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse size={16} style={{ color: '#ec4899' }} /> Current Medications Log
            </h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6b7280' }}>
              Add all active prescriptions, over-the-counter drugs, or nutritional supplements.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Medication Name"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Dose (e.g. 20mg)"
                value={newMed.dose}
                onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Frequency (e.g. Daily)"
                value={newMed.freq}
                onChange={(e) => setNewMed({ ...newMed, freq: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <button
                type="button"
                onClick={addMedicationRow}
                style={{ backgroundColor: '#ec4899', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={18} />
              </button>
            </div>

            {formData.currentMedications.map((med, i) => (
              <div
                key={`med-${i}`}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '8px', padding: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '4px', marginBottom: '4px' }}
              >
                <span style={{ fontWeight: '600' }}>{med.name}</span>
                <span>{med.dose}</span>
                <span>{med.freq}</span>
                <button type="button" onClick={() => removeMedicationRow(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'center' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#374151' }}>Drug Allergies & Adverse Reactions</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6b7280' }}>
              Document any drug allergies, sensitivities, or previous reactions that may affect treatment planning.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 40px', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Allergy / Trigger"
                value={newAllergy.allergy}
                onChange={(e) => setNewAllergy({ ...newAllergy, allergy: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Reaction / Notes"
                value={newAllergy.reaction}
                onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <button
                type="button"
                onClick={addAllergyRow}
                style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={18} />
              </button>
            </div>

            {formData.knownAllergies.map((allergy, i) => (
              <div
                key={`allergy-${i}`}
                style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 40px', gap: '8px', padding: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', alignItems: 'center', backgroundColor: '#fff7ed', borderRadius: '4px', marginBottom: '4px' }}
              >
                <span style={{ fontWeight: '600' }}>{allergy.allergy}</span>
                <span>{allergy.reaction}</span>
                <button type="button" onClick={() => removeAllergyRow(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'center' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', color: '#374151', fontWeight: '600', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
            >
              Continue to Review →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Past Medical History</label>
            <textarea
              name="pastMedicalHistory"
              value={formData.pastMedicalHistory}
              onChange={handleTextChange}
              rows={3}
              placeholder="Include chronic medical conditions, prior surgeries, or relevant diagnoses, hospitalizations, and overall health concerns..."
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Substance Use History</label>
            <textarea
              name="substanceUseHistory"
              value={formData.substanceUseHistory}
              onChange={handleTextChange}
              rows={3}
              placeholder="Optional: Describe alcohol, nicotine, recreational substances, or substance-related concerns in a nonjudgmental way..."
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Family Psychiatric History</label>
            <textarea
              name="familyPsychiatricHistory"
              value={formData.familyPsychiatricHistory}
              onChange={handleTextChange}
              rows={3}
              placeholder="Document any known psychiatric conditions or notable mental health history among immediate family members..."
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
            <ShieldCheck size={18} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: '600' }}>Confidentiality Notice: This information is protected and intended only for clinical review.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', color: '#374151', fontWeight: '600', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={executeFormSubmission}
              disabled={isSaving}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: isSaving ? '#9ca3af' : '#16a34a', color: '#fff', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer' }}
            >
              {isSaving ? 'Saving...' : 'Submit Intake'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
            
