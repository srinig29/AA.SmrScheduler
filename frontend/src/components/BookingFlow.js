import React, { useState, useEffect } from 'react';
import './BookingFlow.css';

const API_BASE = 'http://localhost:5080/api';

function BookingFlow() {
    const [step, setStep] = useState(1); // 1: Select, 2: Confirm
    const [services, setServices] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        vehicleNumber: '',
        serviceTypeId: '',
        branchId: '',
        appointmentSlotId: ''
    });

    const [confirmation, setConfirmation] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const fetchReferenceData = async () => {
        try {
            setLoading(true);
            const [branchRes, serviceRes] = await Promise.all([
                fetch(`${API_BASE}/reference-data/branches`),
                fetch(`${API_BASE}/reference-data/service-types`)
            ]);

            if (!branchRes.ok || !serviceRes.ok) {
                throw new Error('Failed to fetch reference data');
            }

            const serviceData = await serviceRes.json();
            setServices(serviceData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const url = formData.serviceTypeId
                ? `${API_BASE}/slots/available?serviceTypeId=${formData.serviceTypeId}`
                : `${API_BASE}/slots/available`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch available slots');
            }

            const data = await response.json();
            setAvailableSlots(data || []);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchReferenceData();
    }, []);

    useEffect(() => {
        if (formData.serviceTypeId) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.serviceTypeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSelectSlot = (slot) => {
        setFormData(prev => ({
            ...prev,
            appointmentSlotId: slot.slotId,
            branchId: slot.branchId
        }));
        setSelectedSlot(slot);
        setStep(2);
    };

    const handleConfirmBooking = async () => {
        // Validation
        if (!formData.customerName || !formData.customerPhone || !formData.vehicleNumber) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const bookingData = {
                appointmentSlotId: Number(formData.appointmentSlotId),
                branchId: Number(formData.branchId),
                serviceTypeId: Number(formData.serviceTypeId),
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                vehicleRegistration: formData.vehicleNumber,
                notes: 'Booked via React UI'
            };

            const response = await fetch(`${API_BASE}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            if (response.status === 409) {
                setError('This slot has been booked. Please select another slot.');
                setStep(1);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to create appointment');
            }

            const data = await response.json();

            let details = null;
            if (data?.appointmentId) {
                const detailsResponse = await fetch(`${API_BASE}/appointments/${data.appointmentId}`);
                if (detailsResponse.ok) {
                    details = await detailsResponse.json();
                }
            }

            setConfirmation({ ...data, details });
            setSuccess(`Booking confirmed! Reference: ${data.referenceNumber}`);

            // Reset form after 3 seconds
            setTimeout(() => {
                setStep(1);
                setFormData({
                    customerName: '',
                    customerPhone: '',
                    vehicleNumber: '',
                    serviceTypeId: '',
                    branchId: '',
                    appointmentSlotId: ''
                });
                setSelectedSlot(null);
                setConfirmation(null);
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-flow">
            <h2>Book an Appointment</h2>

            {success && <div className="alert success">{success}</div>}
            {error && <div className="alert error">{error}</div>}

            {confirmation ? (
                <div className="confirmation-card card">
                    <h3>✓ Booking Confirmed</h3>
                    <div className="confirmation-details">
                        <p><strong>Reference Number:</strong> {confirmation.referenceNumber}</p>
                        <p><strong>Customer:</strong> {formData.customerName}</p>
                        <p><strong>Date & Time:</strong> {selectedSlot ? new Date(selectedSlot.startTime).toLocaleString() : 'N/A'}</p>
                        <p><strong>Service:</strong> {selectedSlot?.serviceTypeName || confirmation?.details?.serviceTypeName || 'N/A'}</p>
                        <p><strong>Mechanic:</strong> {selectedSlot?.mechanicName || confirmation?.details?.mechanicName || 'N/A'}</p>
                        <p><strong>Status:</strong> {confirmation.status}</p>
                    </div>
                </div>
            ) : step === 1 ? (
                <div className="step-1">
                    <div className="form-group">
                        <label htmlFor="serviceTypeId">Service Type *</label>
                        <select
                            id="serviceTypeId"
                            name="serviceTypeId"
                            value={formData.serviceTypeId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name} ({service.durationMinutes} min)
                                </option>
                            ))}
                        </select>
                    </div>

                    {availableSlots.length > 0 && (
                        <div>
                            <h3>Available Slots</h3>
                            <div className="slots-grid">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot.slotId}
                                        className="slot-card"
                                        onClick={() => handleSelectSlot(slot)}
                                    >
                                        <div className="slot-date">
                                            {new Date(slot.startTime).toLocaleDateString()}
                                        </div>
                                        <div className="slot-time">
                                            {new Date(slot.startTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div className="slot-mechanic">{slot.mechanicName}</div>
                                        <div className="slot-branch">{slot.branchName}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {formData.serviceTypeId && availableSlots.length === 0 && (
                        <div className="empty-state">
                            <p>No available slots for this service</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="step-2 card">
                    <h3>Confirm Your Booking</h3>

                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name *</label>
                        <input
                            id="customerName"
                            name="customerName"
                            type="text"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="customerPhone">Phone Number *</label>
                        <input
                            id="customerPhone"
                            name="customerPhone"
                            type="tel"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="085 123 4567"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="vehicleNumber">Vehicle Number *</label>
                        <input
                            id="vehicleNumber"
                            name="vehicleNumber"
                            type="text"
                            value={formData.vehicleNumber}
                            onChange={handleInputChange}
                            placeholder="191 D 1234"
                        />
                    </div>

                    <div className="button-group">
                        <button
                            className="secondary-btn"
                            onClick={() => setStep(1)}
                            disabled={loading}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={loading}
                        >
                            {loading ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingFlow;
