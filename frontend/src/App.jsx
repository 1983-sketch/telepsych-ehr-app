import React, { useState } from 'react';
import PatientAuth from './components/PatientAuth';
import PatientDashboardView from './components/PatientDashboardView';
import PatientProfileDashboard from './components/PatientProfileDashboard';
import PsychCalendar from './components/PsychCalendar';
import MentalStatusExam from './components/MentalStatusExam';
import Charting from './components/Charting';

export default function App() {
  // Global Security Application State
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'PATIENT' or 'PMHNP'
  const [activePatientId, setActivePatientId] = useState(null);
  const [providerSubView, setProviderSubView] = useState('calendar'); // 'calendar', 'charting', 'ai-copilot'

  // Callback function triggered when Part 2 / PatientAuth logs in successfully
  const handleAuthSuccess = (token, role, entityId) => {
    setAuthToken(token);
    setUserRole(role); // Sets the explicit security barrier role
    if (role === 'PATIENT') {
      setActivePatientId(entityId);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUserRole(null);
    setActivePatientId(null);
  };

  // 🚪 LAYER 1: PUBLIC SECURITY GATE (No Token = Force Login View)
  if (!authToken) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px' }}>
        {/* Simple Developer Toggle to test both entry roles inside your Replit environment */}
        <div style={{ maxWidth: '420px', margin: '0 auto 20px auto', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ fontWeight: 'bold' }}>🧪 Replit Dev Quick-Login:</span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '6px' }}>
            <button onClick={() => handleAuthSuccess('mock-jwt-token-123', 'PATIENT', 'jane-doe-uuid')} style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>As Patient</button>
            <button onClick={() => handleAuthSuccess('mock-jwt-token-456', 'PMHNP', null)} style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>As PMHNP Provider</button>
          </div>
        </div>

        {/* The main authentication logic component */}
        <PatientAuth onAuthSuccess={(token, id) => handleAuthSuccess(token, 'PATIENT', id)} />
      </div>
    );
  }

  // 🛡️ LAYER 2: SECURE PATIENT ROUTING AREA
  if (userRole === 'PATIENT') {
    return (
      <div>
        <nav style={{ backgroundColor: '#fff', padding: '12px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'sans-serif' }}>
          <span style={{ fontWeight: 'bold', color: '#2563eb' }}>🔒 Patient Health Portal</span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Log Out</button>
        </nav>
        <PatientDashboardView patientId={activePatientId} authToken={authToken} />
      </div>
    );
  }

  // ⚕️ LAYER 3: SECURE PROVIDER EHR ROUTING AREA (PMHNP Tier)
  if (userRole === 'PMHNP') {
    return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Professional Navigation Banner */}
        <nav style={{ backgroundColor: '#1e293b', color: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '16px' }}>⚕️ PMHNP EHR Workspace</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setProviderSubView('calendar')} style={{ background: providerSubView === 'calendar' ? '#334155' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Calendar</button>
              <button onClick={() => setProviderSubView('charting')} style={{ background: providerSubView === 'charting' ? '#334155' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Patient Chart Summary</button>
              <button onClick={() => setProviderSubView('ai-copilot')} style={{ background: providerSubView === 'ai-copilot' ? '#334155' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>AI Document Co-Pilot</button>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Log Out</button>
        </nav>

        {/* Dynamic Inner-Workspace Rendering Module */}
        <div style={{ padding: '20px' }}>
          {providerSubView === 'calendar' && <PsychCalendar />}
          {providerSubView === 'charting' && <PatientProfileDashboard patientId="jane-doe-uuid" authToken={authToken} />}
          {providerSubView === 'charting' && <MentalStatusExam patientId="8f3b2d1a-4c5e-4f7g-8a9b-0c1d2e3f4a5b0" authToken={authToken} />}
        </div>
      </div>
    );
  }

  // Fallback protection handler
  return <div style={{ padding: '40px', textAlign: 'center' }}>Critical Access Matrix Exception. Please clear session cache.</div>;
}
