import React, { useState, useEffect } from 'react';
import './MechanicConsole.css';

const API_BASE = 'http://localhost:5080/api';

function MechanicConsole() {
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [workNoteText, setWorkNoteText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchMechanics();
  }, []);

  useEffect(() => {
    if (selectedMechanicId) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMechanicId]);

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/mechanics`);
      if (!response.ok) {
        throw new Error('Failed to fetch mechanics');
      }
      const data = await response.json();
      setMechanics(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/mechanics/${selectedMechanicId}/appointments`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data || []);
      setSelectedAppointment(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentDetail = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/appointments/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment details');
      }
      const data = await response.json();
      setSelectedAppointment(data);
      setWorkNoteText('');
      setNewStatus('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkNote = async () => {
    if (!workNoteText.trim()) {
      setError('Please enter a work note');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE}/appointments/${selectedAppointment.appointmentId}/work-notes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ noteText: workNoteText })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add work note');
      }

      setSuccess('Work note added successfully');
      setWorkNoteText('');
      
      // Refresh appointment details
      await fetchAppointmentDetail(selectedAppointment.appointmentId);
      
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      setError('Please select a new status');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE}/appointments/${selectedAppointment.appointmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ appointmentStatus: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      setSuccess('Status updated successfully');
      setNewStatus('');
      
      // Refresh appointment details and list
      await fetchAppointmentDetail(selectedAppointment.appointmentId);
      await fetchAppointments();
      
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mechanic-console">
      <h2>Mechanic Console</h2>

      {success && <div className="alert success">{success}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="console-layout">
        {/* Mechanic Selection */}
        <div className="mechanic-selector card">
          <h3>Select Mechanic</h3>
          {loading && mechanics.length === 0 ? (
            <div className="loading">Loading mechanics...</div>
          ) : (
            <div className="mechanic-list">
              {mechanics.map(mechanic => (
                <button
                  key={mechanic.mechanicId}
                  className={`mechanic-btn ${selectedMechanicId === mechanic.mechanicId ? 'active' : ''}`}
                  onClick={() => setSelectedMechanicId(mechanic.mechanicId)}
                >
                  <div className="mechanic-name">{mechanic.name}</div>
                  <div className="mechanic-branch">{mechanic.branchName}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Appointments List & Detail */}
        {selectedMechanicId && (
          <div className="appointments-section">
            {/* Appointments List */}
            <div className="appointments-list card">
              <h3>Appointments (48 Hours)</h3>
              {appointments.length === 0 ? (
                <div className="empty-state">No appointments</div>
              ) : (
                <div className="apt-list">
                  {appointments.map(apt => (
                    <button
                      key={apt.appointmentId}
                      className={`apt-list-item ${selectedAppointment?.appointmentId === apt.appointmentId ? 'active' : ''}`}
                      onClick={() => fetchAppointmentDetail(apt.appointmentId)}
                    >
                      <div className="apt-list-time">
                        {new Date(apt.appointmentSlot.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="apt-list-info">
                        <div className="apt-list-customer">{apt.customerName}</div>
                        <div className="apt-list-ref">{apt.referenceNumber}</div>
                      </div>
                      <div className={`apt-list-status status-${apt.appointmentStatus.toLowerCase()}`}>
                        {apt.appointmentStatus}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Appointment Detail */}
            {selectedAppointment && (
              <div className="appointment-detail card">
                <h3>Appointment Details</h3>
                
                <div className="detail-section">
                  <div className="detail-row">
                    <span className="detail-label">Reference:</span>
                    <span className="detail-value">{selectedAppointment.referenceNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Customer:</span>
                    <span className="detail-value">{selectedAppointment.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedAppointment.customerPhone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vehicle:</span>
                    <span className="detail-value">{selectedAppointment.vehicleNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">
                      {selectedAppointment.appointmentSlot.serviceTypeName}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">
                      {new Date(selectedAppointment.appointmentSlot.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-${selectedAppointment.appointmentStatus.toLowerCase()}`}>
                      {selectedAppointment.appointmentStatus}
                    </span>
                  </div>
                </div>

                {/* Work Notes */}
                <div className="work-notes-section">
                  <h4>Work Notes</h4>
                  <div className="work-notes-list">
                    {selectedAppointment.workNotes && selectedAppointment.workNotes.length > 0 ? (
                      selectedAppointment.workNotes.map((note, idx) => (
                        <div key={idx} className="work-note-item">
                          <div className="note-time">
                            {new Date(note.createdAt).toLocaleString()}
                          </div>
                          <div className="note-text">{note.noteText}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-notes">No work notes yet</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="workNote">Add Work Note</label>
                    <textarea
                      id="workNote"
                      value={workNoteText}
                      onChange={(e) => setWorkNoteText(e.target.value)}
                      placeholder="Enter your work note..."
                      rows="3"
                      disabled={loading}
                    />
                  </div>
                  <button onClick={handleAddWorkNote} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Note'}
                  </button>
                </div>

                {/* Status Update */}
                {selectedAppointment.appointmentStatus === 'Scheduled' && (
                  <div className="status-update-section">
                    <h4>Update Status</h4>
                    <div className="form-group">
                      <label htmlFor="newStatus">New Status</label>
                      <select
                        id="newStatus"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select status</option>
                        <option value="InProgress">In Progress</option>
                      </select>
                    </div>
                    <button onClick={handleUpdateStatus} disabled={loading}>
                      {loading ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                )}

                {selectedAppointment.appointmentStatus === 'InProgress' && (
                  <div className="status-update-section">
                    <h4>Complete Appointment</h4>
                    <div className="form-group">
                      <label htmlFor="finalStatus">Final Status</label>
                      <select
                        id="finalStatus"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select status</option>
                        <option value="Completed">Completed</option>
                        <option value="NoShow">No Show</option>
                      </select>
                    </div>
                    <button onClick={handleUpdateStatus} disabled={loading}>
                      {loading ? 'Updating...' : 'Complete Appointment'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MechanicConsole;
