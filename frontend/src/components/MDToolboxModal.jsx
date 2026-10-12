import React from 'react';

export default function MDToolboxModal({ isOpen, launchUrl, onClose }) {
  if (!isOpen || !launchUrl) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', width: '90%', height: '85%', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        
        {/* Modal Window Control Header Bar */}
        <div style={{ padding: '12px 20px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>🔒 MDToolbox Certified Electronic Prescribing Portal (EPCS Enabled)</span>
          <button 
            onClick={onClose} 
            style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Close Prescription Window
          </button>
        </div>

        {/* Secure Browser Sandbox Frame */}
        <iframe 
          src={launchUrl} 
          title="MDToolbox Rx Frame"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          style={{ width: '100%', flexGrow: 1, border: 'none' }}
        />
      </div>
    </div>
  );
}
