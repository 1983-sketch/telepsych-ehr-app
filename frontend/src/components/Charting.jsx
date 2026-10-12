import React, { useState } from 'react';

export default function Charting({ patientId, authToken }) {
  // Frontend State Tracking
  const [rawNotes, setRawNotes] = useState('');
  const [aiSuggestedHPI, setAiSuggestedHPI] = useState('');
  const [officialHPI, setOfficialHPI] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState(null);

  // Calls our FastAPI backend secure AI route
  const handleAIAssist = async () => {
    if (!rawNotes.trim()) return alert("Please input raw narrative or shorthand text notes first.");
    
    setIsProcessing(true);
    setSafetyAlert(null);
    try {
      const response = await fetch('/api/clinical-ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ raw_notes: rawNotes })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Hydrate the layout with structured clinical outputs
        setAiSuggestedHPI(data.hpi);
        
        // Handle immediate safety flags if extracted by the clinical validator
        if (data.safety_alert_triggered) {
          setSafetyAlert(data.safety_justification || "Warning: Potential self-harm parameters extracted.");
        }
      } else {
        alert(`AI Engine Hook Error: ${data.detail || 'Processing failed'}`);
      }
    } catch (err) {
      console.error("AI Thread broken:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Pulls the text block from the AI box directly into your active editing lane
  const acceptAISuggestion = () => {
    setOfficialHPI(aiSuggestedHPI);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      
      {/* Header Framework */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>Ambient Clinical Documentation Co-Pilot</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Transform shorthand conversation notes securely into structured psychiatric charting blocks.</p>
      </div>

      {/* 🚨 Immediate Risk Notification Center */}
      {safetyAlert && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '12px 16px', borderRadius: '6px', color: '#991b1b', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
          ⚠️ <strong>Automated Safety Flag:</strong> {safetyAlert}
        </div>
      )}

      {/* Main Multi-Panel Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: Input Source Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Raw Shorthand Notes / Session Transcript</label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Example: pt reports mood is 3/10. sleep bad, waking up at 3am. work is super stressful due to new boss. feels overwhelmed. denies active suicidal intent but feels empty..."
            style={{ width: '100%', height: '350px', padding: '12px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', lineHeight: '1.5', resize: 'none', fontFamily: 'monospace' }}
          />
          <button
            onClick={handleAIAssist}
            disabled={isProcessing}
            style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#6366f1', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? 'Analyzing Clinical Narrative Parameters...' : '⚡ Generate Structured HPI Draft'}
          </button>
        </div>

        {/* RIGHT COLUMN: Interactive Double-Panel Review Lane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. The Suggested Sandbox Container */}
          <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase', tracking: '0.05em' }}>AI Co-Pilot Suggestion (Draft)</span>
              {aiSuggestedHPI && (
                <button 
                  onClick={acceptAISuggestion}
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Copy to Official Chart Lane ➔
                </button>
              )}
            </div>
            <div style={{ fontSize: '14px', color: '#1e3a8a', minHeight: '120px', lineHeight: '1.5', padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #dbeafe' }}>
              {aiSuggestedHPI || <span style={{ color: '#93c5fd', italic: 'true' }}>Clinical recommendations will parse here automatically when you execute the backend summary call.</span>}
            </div>
          </div>

          {/* 2. Official Medical Note Input Lane */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', flexGrow: 1 }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Official History of Present Illness (HPI)</label>
            <textarea
              value={officialHPI}
              onChange={(e) => setOfficialHPI(e.target.value)}
              placeholder="Review, modify, or elaborate the final clinical record text here..."
              style={{ width: '100%', flexGrow: 1, minHeight: '160px', padding: '12px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', lineHeight: '1.5' }}
            />
            <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
              ✏️ This box is fully editable. You maintain complete clinical oversight and sign-off control.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
