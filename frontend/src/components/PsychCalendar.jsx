import React, { useState, useEffect } from 'react';

// Mock appointment objects matching the DB schema layout we built
const MOCK_APPOINTMENTS = [
  { id: 'app-1', date: '2026-10-12', time: '09:00 AM', patientName: 'Arthur Pendragon', type: 'Psychiatric Intake', status: 'Confirmed', paid: true },
  { id: 'app-2', date: '2026-10-12', time: '10:30 AM', patientName: 'Guinevere Smith', type: 'Medication Management', status: 'Confirmed', paid: true },
  { id: 'app-3', date: '2026-10-14', time: '01:00 PM', patientName: 'Merlin Ambrosius', type: 'Follow-up + Therapy', status: 'Pending', paid: false },
  { id: 'app-4', date: '2026-10-14', time: '02:30 PM', patientName: 'Morgana Le Fay', type: 'Psychiatric Intake', status: 'Confirmed', paid: true },
  { id: 'app-5', date: '2026-10-23', time: '11:00 AM', patientName: 'Lancelot Du Lac', type: 'Medication Management', status: 'No_Show', paid: true }
];

export default function PsychCalendar() {
  // Center initial view state around our current date target
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 11)); // October 2026
  const [selectedDateStr, setSelectedDateStr] = useState('2026-10-12');
  const [dailyAppointments, setDailyAppointments] = useState([]);

  // Filter roster items dynamically when selected calendar block changes
  useEffect(() => {
    const dailyList = MOCK_APPOINTMENTS.filter(appt => appt.date === selectedDateStr);
    // Sort chronologically by time block parameters
    setDailyAppointments(dailyList.sort((a, b) => a.time.localeCompare(b.time)));
  }, [selectedDateStr]);

  // Calendar math functions
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handleDayClick = (dayNum) => {
    const formattedDay = String(dayNum).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    setSelectedDateStr(`${year}-${formattedMonth}-${formattedDay}`);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Confirmed': return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Pending': return { bg: '#fef3c7', color: '#b45309' };
      case 'No_Show': return { bg: '#fee2e2', color: '#b91c1c' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', maxWidth: '1050px', margin: '20px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontFamily: 'sans-serif' }}>
      
      {/* LEFT MODULE: The Interactive Grid Calendar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>{monthNames[month]} {year}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>◀</button>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>▶</button>
          </div>
        </div>

        {/* Week Day Labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} style={{ padding: '6px 0' }}>{d}</div>)}
        </div>

        {/* Numeric Day Grid matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {/* Pad early grid boundaries based on empty index alignment offset */}
          {Array(firstDayIndex).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const currentStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDateStr === currentStr;
            const hasAppts = MOCK_APPOINTMENTS.some(a => a.date === currentStr);

            return (
              <div 
                key={dayNum} 
                onClick={() => handleDayClick(dayNum)}
                style={{ 
                  height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6px', borderRadius: '6px', border: isSelected ? '2px solid #2563eb' : '1px solid #f3f4f6', 
                  backgroundColor: isSelected ? '#eff6ff' : '#f9fafb', cursor: 'pointer', transition: 'all 0.15s ease' 
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '400', color: isSelected ? '#2563eb' : '#1f2937' }}>{dayNum}</span>
                {hasAppts && <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', alignSelf: 'center' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT MODULE: Selected Day Appointment Roster Sidebar */}
      <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '24px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#111827' }}>Roster Schedule</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280' }}>Selected Session Date: <strong>{selectedDateStr}</strong></p>

        {dailyAppointments.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db', color: '#6b7280', fontSize: '14px' }}>
            No clinical telehealth sessions scheduled for this timeline boundary block.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dailyAppointments.map((appt) => {
              const statusColors = getStatusStyle(appt.status);
              return (
                <div key={appt.id} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4b5563' }}>🕒 {appt.time}</span>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: statusColors.bg, color: statusColors.color }}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>{appt.patientName}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>Service: {appt.type}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: appt.paid ? '#16a34a' : '#dc2626', fontWeight: '500' }}>
                      {appt.paid ? '✓ Invoice Paid' : '⚠ Stripe Balance Pending'}
                    </span>
                    <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      Open Intake Chart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
