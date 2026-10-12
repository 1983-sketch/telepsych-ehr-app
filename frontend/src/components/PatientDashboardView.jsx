import React, { useState, useEffect } from 'react';
import { Calendar, ClipboardList, Video, CreditCard, Shield, User, ExternalLink } from 'lucide-react';

export default function PatientDashboardView({ patientId, authToken }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In production, this pulls directly from your protected FastAPI patient endpoints
    // e.g., fetch(`/api/patient-portal/dashboard`, { headers: { 'Authorization': `Bearer ${authToken}` } })
    const fetchPatientDashboardData = async () => {
      try {
        setLoading(true);
        // Simulated latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock payload matching the database models we established
        const mockPayload = {
          patientName: "Jane Doe",
          upcomingAppointment: {
            id: "appt-99",
            date: "2026-10-14",
            time: "02:30 PM",
            type: "Psychiatric Intake Evaluation",
            provider: "Your Name, PMHNP-BC",
            telehealthUrl: "https://whereby.com",
            isPaid: false,
            fee: 250
          },
          pendingScreeners: [
            { id: "scr-1", type: "PHQ9", name: "Depression Screening Checklist (PHQ-9)" },
            { id: "scr-2", type: "GAD7", name: "Anxiety Tracking Assessment (GAD-7)" }
          ],
          pastInvoices: [
            { id: "inv-21", date: "2026-09-01", description: "Follow-up Session", amount: 150, status: "Paid" }
          ]
        };

        setDashboardData(mockPayload);
      } catch (err) {
        console.error("Secure record parsing decryption failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDashboardData();
  }, [patientId]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#4b5563' }}>Loading encrypted health portal summary...</div>;
  }

  const { patientName, upcomingAppointment, pendingScreeners, pastInvoices } = dashboardData;

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#1f2937' }}>
      
      {/* Upper Navigation Greeting Framework */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: '#eff6ff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <User size={26} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>Welcome back, {patientName}</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#6b7280' }}>Manage your treatment requirements and secure digital data.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#16a34a', backgroundColor: '#dcfce7', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
          <Shield size={14} /> End-to-End Encrypted Session
        </div>
      </div>

      {/* Main Multi-Layout Panel Blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px' }}>
        
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', name: 'Overview Home', icon: <Shield size={16} /> },
            { id: 'appointments', name: 'Appointments', icon: <Calendar size={16} /> },
            { id: 'screeners', name: 'Intake Forms', icon: <ClipboardList size={16} /> },
            { id: 'billing', name: 'Billing History', icon: <CreditCard size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
                backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#4b5563',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content Portal Screen View */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e5e7eb', minHeight: '380px' }}>
          
          {/* TAB 1: OVERVIEW SUMMARY */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Urgent Intake Forms Notification Alert */}
              {pendingScreeners.length > 0 && (
                <div style={{ border: '1px solid #fde047', backgroundColor: '#fef9c3', padding: '16px', borderRadius: '8px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <ClipboardList style={{ color: '#a16207', shrink: '0' }} />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: '0 0 2px 0', color: '#713f12', fontSize: '14px', fontWeight: '700' }}>Pre-Visit Intake Checklists Pending</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#854d0e' }}>You have {pendingScreeners.length} clinical forms to complete before your telehealth consultation session.</p>
                  </div>
                  <button onClick={() => setActiveTab('screeners')} style={{ backgroundColor: '#ca8a04', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    Complete Forms
                  </button>
                </div>
              )}

              {/* Upcoming Telehealth Appointment Module */}
              {upcomingAppointment && (
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: '#2563eb' }} /> Next Telehealth Session Coordinates
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                    <div><strong>Date:</strong> {upcomingAppointment.date}</div>
                    <div><strong>Time:</strong> {upcomingAppointment.time}</div>
                    <div><strong>Clinician:</strong> {upcomingAppointment.provider}</div>
                    <div><strong>Service Type:</strong> {upcomingAppointment.type}</div>
                  </div>
                  
                  {/* Action Link Elements */}
                  <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                    <a 
                      href={upcomingAppointment.telehealthUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ flexGrow: 1, textDecoration: 'none', textAlign: 'center', padding: '10px', backgroundColor: '#10b981', color: '#fff', borderRadius: '6px', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Video size={16} /> Enter Safe Video Room <ExternalLink size={12} />
                    </a>
                    {!upcomingAppointment.isPaid && (
                      <button onClick={() => setActiveTab('billing')} style={{ padding: '10px 16px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                        Pay Copy Invoice (${upcomingAppointment.fee})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPOINTMENTS FULL VIEW */}
          {activeTab === 'appointments' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Your Telehealth Appointments</h3>
              {upcomingAppointment ? (
                <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{upcomingAppointment.type}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{upcomingAppointment.date} at {upcomingAppointment.time} • with {upcomingAppointment.provider}</div>
                  </div>
                  <span style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontWeight: 'bold' }}>Confirmed</span>
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '14px' }}>No active bookings scheduled.</p>
              )}
            </div>
          )}

          {/* TAB 3: SCREENERS ENTRY LIST */}
          {activeTab === 'screeners' && (
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Assigned Clinical Assessments</h3>
              {pendingScreeners.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  {pendingScreeners.map((screener) => (
                    <div key={screener.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{screener.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{screener.type}</div>
                      </div>
                      <button
                        type="button"
                        style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Open Form
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '16px' }}>No pending assessments at the moment.</p>
              )}
            </div>
          )}

          {/* TAB 4: BILLING HISTORY */}
          {activeTab === 'billing' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Billing History</h3>
              {pastInvoices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pastInvoices.map((invoice) => (
                    <div key={invoice.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{invoice.description}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{invoice.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>${invoice.amount}</div>
                        <div style={{ fontSize: '12px', color: invoice.status === 'Paid' ? '#16a34a' : '#d97706', marginTop: '4px', fontWeight: '600' }}>{invoice.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '14px' }}>No billing records available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
