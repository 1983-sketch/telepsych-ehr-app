import React, { useState, useEffect } from 'react';

export default function PatientProfileDashboard({ patientId, authToken }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In production, you would fetch this combined payload from your FastAPI backend
    // e.g., fetch(`/api/patients/${patientId}/dashboard`, { headers: { 'Authorization': `Bearer ${authToken}` } })
    const fetchDashboardData = async () => {
      try {
        // Simulating API loading latency
        setLoading(true);
        
        // Mocked response tracking the clinical history schema we built earlier
        const mockResponse = {
          demographics: {
            name: "Jane Doe",
            dob: "1992-05-14",
            email: "jane.doe@example.com",
            phone: "(555) 019-2834",
            emergencyContact: "John Doe (Spouse) - (555) 019-2835"
          },
          intake: {
            chiefComplaint: "Worsening depression, heavy anxiety related to recent occupational transition, and severe terminal insomnia over the last 3 weeks.",
            allergies: ["Penicillin (Rash)"],
            currentMeds: [
              { name: "Lexapro", dose: "10mg", freq: "Daily" },
              { name: "Melatonin", dose: "5mg", freq: "QHS (At Bedtime)" }
            ]
          },
          screenerTrends: [
            { date: "2026-08-01", phq9: 8, gad7: 6 },
            { date: "2026-09-01", phq9: 14, gad7: 11 },
            { date: "2026-10-11", phq9: 19, gad7: 15 } // Showing standard longitudinal trajectory
          ]
        };
        
        setProfileData(mockResponse);
      } catch (err) {
        setError("Failed to compile patient profile metadata securely.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [patientId]);

  if (loading) return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Decrypting protected health record summary...</div>;
  if (error) return <div style={{ padding: '20px', color: '#dc2626' }}>{error}</div>;

  const { demographics, intake, screenerTrends } = profileData;
  const criticalAlert = screenerTrends[screenerTrends.length - 1]?.phq9 >= 15;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* 🚨 High Risk Global Banner */}
      {criticalAlert && (
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '500' }}>
          <span>⚠️ CRITICAL TRACKING: This patient's latest evaluation shows Moderately Severe to Severe screening parameters. Review safety routing logs immediately.</span>
        </div>
      )}

      {/* Header Module */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', color: '#111827' }}>{demographics.name}</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>DOB: {demographics.dob} | Patient Tracking ID: {patientId.substring(0,8)}...</p>
        </div>
        <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          + New Psychiatric Evaluation Note
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: Sidebar Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151' }}>Demographics</h3>
            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#4b5563' }}>
              <div><strong>Phone:</strong> {demographics.phone}</div>
              <div><strong>Email:</strong> {demographics.email}</div>
              <div><strong>Emergency Alert Line:</strong> <br/><span style={{ fontSize: '13px' }}>{demographics.emergencyContact}</span></div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151', color: '#b91c1c' }}>Active Allergies</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#4b5563' }}>
              {intake.allergies.map((all, i) => <li key={i}>{all}</li>)}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Analysis & Historical Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Intake Medical Summary */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#374151' }}>Subjective Chief Complaint</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>"{intake.chiefComplaint}"</p>
            
            <h3 style={{ margin: '18px 0 8px 0', fontSize: '16px', color: '#374151' }}>Current Medication Spreadsheet</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Medication</th>
                  <th style={{ padding: '8px' }}>Dosage</th>
                  <th style={{ padding: '8px' }}>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {intake.currentMeds.map((med, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: '500' }}>{med.name}</td>
                    <td style={{ padding: '8px' }}>{med.dose}</td>
                    <td style={{ padding: '8px' }}>{med.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Historical Trend Monitoring Graph Block */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#374151' }}>Psychiatric Metric Assessment History</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280' }}>Tracking symptom trajectory over consecutive tracking boundaries</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Evaluation Date</th>
                  <th>PHQ-9 (Depression)</th>
                  <th>GAD-7 (Anxiety)</th>
                </tr>
              </thead>
              <tbody>
                {screenerTrends.map((trend, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ textAlign: 'left', padding: '12px 10px', fontWeight: '500' }}>{trend.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: trend.phq9 >= 15 ? '#fee2e2' : '#f3f4f6', color: trend.phq9 >= 15 ? '#b91c1c' : '#111827', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {trend.phq9}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: trend.gad7 >= 10 ? '#fff7ed' : '#f3f4f6', color: trend.gad7 >= 10 ? '#c2410c' : '#111827', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        {trend.gad7}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
