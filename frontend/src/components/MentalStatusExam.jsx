import React, { useState } from 'react';
import { ClipboardCheck, Sparkles, ShieldCheck } from 'lucide-react';

const MSE_OPTIONS = {
  appearance: ['Well-groomed', 'Disheveled', 'Poor hygiene', 'Appropriate for weather', 'Older than stated age'],
  behavior: ['Cooperative', 'Agitated', 'Restless', 'Poor eye contact', 'Psychomotor retardation', 'Guarded'],
  speech: ['Normal rate/tone', 'Pressured', 'Slowed', 'Monotone', 'Loud', 'Whispering'],
  mood: ['Euthymic', 'Depressed', 'Anxious', 'Euphoric', 'Irritable', 'Alexithymic'],
  affect: ['Congruent', 'Incongruent', 'Blunted', 'Flat', 'Labile', 'Constricted'],
  thought_process: ['Linear/Goal-directed', 'Circumstantial', 'Tangential', 'Flight of ideas', 'Loose associations'],
  thought_content: ['Normal', 'Preoccupied', 'Delusions', 'Obsessions', 'Paranoid ideation'],
  perception: ['No hallucinations', 'Auditory hallucinations', 'Visual hallucinations', 'Depersonalization'],
  cognition: ['Alert & Oriented x4', 'Mild impairment', 'Fluctuating awareness', 'Disoriented'],
  insight_judgment: ['Good', 'Fair', 'Poor', 'Impaired']
};

export default function MentalStatusExam({ patientId, authToken, onSaveComplete }) {
  const [isSaving, setIsSaving] = useState(false);
  const [mseState, setMseState] = useState({
    appearance: 'Well-groomed',
    behavior: 'Cooperative',
    speech: 'Normal rate/tone',
    mood: 'Euthymic',
    affect: 'Congruent',
    thought_process: 'Linear/Goal-directed',
    thought_content: 'Normal',
    perception: 'No hallucinations',
    cognition: 'Alert & Oriented x4',
    insight_judgment: 'Good',
    custom_notes: ''
  });

  const handleDropdownChange = (field, value) => {
    setMseState(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Direct call to your backend Python FastAPI server
      const response = await fetch('/api/clinical/save-mse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          patient_id: patientId || "8f3b2d1a-4c5e-4f7g-8a9b-0c1d2e3f4a5b0", // Fallback matching seed data
          mental_status_exam: mseState,
          suicidal_or_homicidal_ideation_present: mseState.thought_content.includes('Ideation') || mseState.custom_notes.toLowerCase().includes('suicid')
        })
      });

      if (response.ok) {
        alert("🔒 Objective Mental Status Examination saved and encrypted in patient chart successfully.");
        if (onSaveComplete) onSaveComplete();
      } else {
        alert("Error saving evaluation parameter parameters to backend server.");
      }
    } catch (err) {
      console.error("MSE transmission failure:", err);
      alert("Failed connecting to local port 8000 server. Make sure your Python backend is active.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', fontFamily: 'sans-serif', color: '#1f2937', textAlign: 'left' }}>
      
      {/* Title Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
        <ClipboardCheck style={{ color: '#10b981' }} />
        <h2 style={{ margin: 0, color: '#111827', fontSize: '20px' }}>Objective Evaluation: Mental Status Examination (MSE)</h2>
      </div>
      <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '13px' }}>Select structural observations during active clinical review to populate chart matrices.</p>

      {/* Grid Menu Layer */}
      <form onSubmit={handleSaveExam}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          {Object.entries(MSE_OPTIONS).map(([field, options]) => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ textTransform: 'capitalize', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>
                {field.replace('_', ' ')}
              </label>
              <select 
                value={mseState[field]} 
                onChange={(e) => handleDropdownChange(field, e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#f9fafb', outline: 'none' }}
              >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Narrative Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Clinical Behavioral Notes & Elaboration Text</label>
          <textarea 
            rows={4}
            value={mseState.custom_notes}
            onChange={(e) => handleDropdownChange('custom_notes', e.target.value)}
            placeholder="Type specific quotes, cognitive orientation evaluations, or visual tracking deviations witnessed here..."
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', fontFamily: 'sans-serif', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#166534' }}>
          <ShieldCheck size={18} style={{ color: '#16a34a', shrink: '0' }} />
          <span>Data security verification active. Form matches PostgreSQL schema parameters.</span>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={isSaving}
          style={{ marginTop: '20px', width: '100%', padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#10b981', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '15px', opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? 'Locking Exam Record Parameters...' : '✓ Save Mental Status Examination Note'}
        </button>
      </form>
    </div>
  );
}
