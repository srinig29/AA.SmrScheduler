import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_BASE = 'http://localhost:5080/api';

const STATUS_LABELS = {
    1: 'Scheduled',
    2: 'InProgress',
    3: 'Completed',
    4: 'NoShow'
};

function getStatusLabel(status) {
    if (typeof status === 'number') {
        return STATUS_LABELS[status] || `Unknown(${status})`;
    }

    return status || 'Unknown';
}

function getStatusClass(status) {
    return getStatusLabel(status).toLowerCase();
}

function groupByMechanic(appointments) {
    const grouped = {};

    appointments.forEach((apt) => {
        const key = `${apt.mechanicId}-${apt.mechanicName}`;
        if (!grouped[key]) {
            grouped[key] = {
                mechanicId: apt.mechanicId,
                mechanicName: apt.mechanicName,
                appointments: []
            };
        }

        grouped[key].appointments.push(apt);
    });

    return Object.values(grouped);
}

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
            setSchedule(groupByMechanic(data || []));
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
                                                {new Date(apt.startTime).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="apt-details">
                                                <div className="apt-customer">{apt.customerName}</div>
                                                <div className="apt-service">{apt.serviceTypeName}</div>
                                                <div className={`apt-status status-${getStatusClass(apt.status)}`}>
                                                    {getStatusLabel(apt.status)}
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
