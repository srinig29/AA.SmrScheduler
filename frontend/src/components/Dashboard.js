import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_BASE = 'http://localhost:5080/api';

function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodaySchedule();
  }, []);

  const fetchTodaySchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/dashboard/today`);
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s schedule');
      }
      const data = await response.json();
      setSchedule(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading today's schedule...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Today's Schedule</h2>
      
      {error && <div className="alert error">{error}</div>}
      
      <button onClick={fetchTodaySchedule} className="refresh-btn">
        Refresh Schedule
      </button>

      {schedule.length === 0 ? (
        <div className="empty-state">
          <p>No appointments scheduled for today</p>
        </div>
      ) : (
        <div className="schedule-grid">
          {schedule.map((mechanic, idx) => (
            <div key={idx} className="mechanic-schedule card">
              <h3>{mechanic.mechanicName}</h3>
              <div className="appointments-list">
                {mechanic.appointments && mechanic.appointments.length > 0 ? (
                  mechanic.appointments.map((apt, aptIdx) => (
                    <div key={aptIdx} className="appointment-item">
                      <div className="apt-time">
                        {new Date(apt.appointmentSlot.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="apt-details">
                        <div className="apt-customer">{apt.customerName}</div>
                        <div className="apt-service">{apt.appointmentSlot.serviceTypeName}</div>
                        <div className={`apt-status status-${apt.appointmentStatus.toLowerCase()}`}>
                          {apt.appointmentStatus}
                        </div>
                      </div>
                      <div className="apt-ref">Ref: {apt.referenceNumber}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-appointments">No appointments</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
