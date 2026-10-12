import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, KeyRound } from 'lucide-react';

export default function PatientAuth({ onAuthSuccess }) {
  // Step 1 = Login Credentials, Step 2 = 2FA Verification Code
  const [authStep, setAuthStep] = useState(1); 
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 1: Handle Initial Password Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Direct call to your FastAPI /api/auth/login endpoint
      const response = await fetch('/api/auth/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        // Backend successfully validated password and triggered an SMS/Email 2FA OTP
        setAuthStep(2);
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Invalid login credentials. Please try again.");
      }
    } catch (err) {
      alert("Communication breakdown during secure gateway verification.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle One-Time Verification Code Submission
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) return alert("Please enter a valid 6-digit verification code.");
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          otp_code: verificationCode
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Token received! Pass the secure JWT up to your application state
        onAuthSuccess(data.token, data.patient_id);
      } else {
        alert(data.detail || "Invalid or expired security verification code.");
      }
    } catch (err) {
      alert("Authentication pipeline verification failure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '32px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontFamily: 'sans-serif' }}>
      
      {/* STEP 1: INITIAL LOGIN VIEW */}
      {authStep === 1 && (
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ backgroundColor: '#eff6ff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#2563eb' }}>
              <Lock size={24} />
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#111827' }}>Patient Portal Access</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Sign in to complete intakes and view telehealth links.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#9ca3af' }} />
              <input required type="email" name="email" value={credentials.email} onChange={handleCredentialChange} placeholder="yourname@example.com" style={{ width: '100%', padding: '8px 12px 8px 36px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#9ca3af' }} />
              <input required type="password" name="password" value={credentials.password} onChange={handleCredentialChange} placeholder="••••••••" style={{ width: '100%', padding: '8px 12px 8px 36px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
            </div>
          </div>

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', marginTop: '4px', border: 'none', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Verifying Identity Credentials...' : 'Sign In Safely'}
          </button>
        </form>
      )}

      {/* STEP 2: 2FA MFA VERIFICATION CODE VIEW */}
      {authStep === 2 && (
        <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ backgroundColor: '#dcfce7', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#16a34a' }}>
              <ShieldCheck size={24} />
            </div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#111827' }}>Enter Verification Code</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
              We sent a 6-digit temporary secure validation code to <br /><strong>{credentials.email}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <input required type="text" maxLength={6} placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))} style={{ width: '160px', padding: '12px', textAlign: 'center', letterSpacing: '8px', fontSize: '22px', fontWeight: 'bold', borderRadius: '8px', border: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Code expires inside 5 minutes.</span>
          </div>

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Decrypting Secure Session...' : 'Confirm & Authenticate'}
          </button>
          
          <button type="button" onClick={() => setAuthStep(1)} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Back to username entry
          </button>
        </form>
      )}

    </div>
  );
}
