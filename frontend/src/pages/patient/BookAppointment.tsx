import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, Star, CreditCard, Phone } from 'lucide-react';
import { useAuth, api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Doctor {
    id: number;
    name: string;
    specialization: string;
    qualification: string;
    experience: number;
    rating: number;
    reviewCount: number;
    consultationFee: number;
    location: string;
    image: string;
    about: string;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

const BookAppointment: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow-up' | 'check-up'>('consultation');
    const [symptoms, setSymptoms] = useState<string>('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [booking, setBooking] = useState<boolean>(false);
    const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

    // ✅ Fetch doctor details from backend
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                console.log('🔄 Fetching doctor details from backend...');
                const response = await api.get(`/doctors/${doctorId}`);

                if (response.data.success) {
                    setDoctor(response.data.doctor);
                    console.log('✅ Doctor loaded:', response.data.doctor.name);
                } else {
                    toast.error('Doctor not found');
                    navigate('/patient/find-doctors');
                }
            } catch (error) {
                console.error('❌ Error fetching doctor:', error);
                toast.error('Failed to load doctor details');
                navigate('/patient/find-doctors');
            } finally {
                setLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctor();
        }
    }, [doctorId, navigate]);

    // ✅ Fetch available time slots when date is selected
    useEffect(() => {
        const fetchTimeSlots = async () => {
            if (!selectedDate || !doctorId) return;

            setLoadingSlots(true);
            try {
                console.log('🔄 Fetching available slots...');
                const response = await api.get(`/appointments/available-slots/${doctorId}?date=${selectedDate}`);

                if (response.data.success) {
                    setTimeSlots(response.data.slots || []);
                    console.log('✅ Time slots loaded:', response.data.slots?.length);
                } else {
                    setTimeSlots([]);
                    toast.error('No slots available for selected date');
                }
            } catch (error) {
                console.error('❌ Error fetching slots:', error);
                // Fallback to default slots if API fails
                setTimeSlots([
                    { time: '09:00 AM', available: true },
                    { time: '09:30 AM', available: false },
                    { time: '10:00 AM', available: true },
                    { time: '10:30 AM', available: true },
                    { time: '11:00 AM', available: false },
                    { time: '11:30 AM', available: true },
                    { time: '02:00 PM', available: true },
                    { time: '02:30 PM', available: true },
                    { time: '03:00 PM', available: false },
                    { time: '03:30 PM', available: true },
                ]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchTimeSlots();
    }, [selectedDate, doctorId]);

    // ✅ Book appointment with backend
    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            toast.error('Please select date and time');
            return;
        }

        if (!doctor) {
            toast.error('Doctor information not available');
            return;
        }

        setBooking(true);

        try {
            console.log('🔄 Booking appointment with backend...');

            const bookingData = {
                doctorId: parseInt(doctorId || '0'),
                date: selectedDate,
                time: selectedTime,
                appointmentType,
                symptoms: symptoms.trim() || undefined
            };

            const response = await api.post('/appointments/book', bookingData);

            if (response.data.success) {
                toast.success('Appointment booked successfully! 🎉');
                console.log('✅ Appointment booked:', response.data.appointment);
                navigate('/patient/appointments');
            } else {
                toast.error(response.data.message || 'Failed to book appointment');
            }
        } catch (error: any) {
            console.error('❌ Booking error:', error);

            if (error.response?.status === 409) {
                toast.error('Time slot no longer available. Please select another time.');
                // Refresh time slots
                const fetchSlots = async () => {
                    try {
                        const response = await api.get(`/appointments/available-slots/${doctorId}?date=${selectedDate}`);
                        if (response.data.success) {
                            setTimeSlots(response.data.slots || []);
                        }
                    } catch (err) {
                        console.error('Error refreshing slots:', err);
                    }
                };
                fetchSlots();
            } else {
                toast.error(error.response?.data?.message || 'Failed to book appointment');
            }
        } finally {
            setBooking(false);
        }
    };

    if (loading || !doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
                    <p className="text-gray-600">Schedule your appointment with {doctor.name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Doctor Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                            <div className="text-center mb-6">
                                <img
                                    src={doctor.image || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face`}
                                    alt={doctor.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face`;
                                    }}
                                />
                                <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
                                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                <p className="text-sm text-gray-600">{doctor.qualification}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Experience</span>
                                    <span className="font-semibold">{doctor.experience}+ years</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Rating</span>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                        <span className="font-semibold">{doctor.rating || 4.5}</span>
                                        <span className="text-gray-500 ml-1">({doctor.reviewCount || 0})</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-semibold">{doctor.location}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-semibold text-green-600">₹{doctor.consultationFee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Appointment Details</h3>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="form-label">Select Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedTime(''); // Reset time when date changes
                                    }}
                                />
                            </div>

                            {/* Time Selection */}
                            <div className="mb-6">
                                <label className="form-label">Select Time</label>
                                {selectedDate ? (
                                    <div>
                                        {loadingSlots ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="loading-spinner"></div>
                                                <span className="ml-2 text-gray-600">Loading available slots...</span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                                                {timeSlots.length > 0 ? (
                                                    timeSlots.map((slot) => (
                                                        <button
                                                            key={slot.time}
                                                            type="button"
                                                            disabled={!slot.available}
                                                            onClick={() => setSelectedTime(slot.time)}
                                                            className={`p-3 text-sm font-medium rounded-lg border transition-colors ${selectedTime === slot.time
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : slot.available
                                                                    ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {slot.time}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full text-center py-8 text-gray-500">
                                                        No available slots for this date. Please select another date.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-2">Please select a date first</p>
                                )}
                            </div>

                            {/* Appointment Type */}
                            <div className="mb-6">
                                <label className="form-label">Appointment Type</label>
                                <select
                                    className="form-input"
                                    value={appointmentType}
                                    onChange={(e) => setAppointmentType(e.target.value as 'consultation' | 'follow-up' | 'check-up')}
                                >
                                    <option value="consultation">Consultation</option>
                                    <option value="follow-up">Follow-up</option>
                                    <option value="check-up">Check-up</option>
                                </select>
                            </div>

                            {/* Symptoms/Notes */}
                            <div className="mb-6">
                                <label className="form-label">Symptoms / Reason for Visit</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Please describe your symptoms or reason for the appointment..."
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                />
                            </div>

                            {/* Patient Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Patient Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-medium">{user?.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2 font-medium">{user?.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="ml-2 font-medium">{user?.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment Summary
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Consultation Fee</span>
                                        <span className="font-medium">₹{doctor.consultationFee}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Platform Fee</span>
                                        <span className="font-medium">₹50</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span className="text-green-600">₹{doctor.consultationFee + 50}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Button */}
                            <button
                                onClick={handleBooking}
                                disabled={booking || !selectedDate || !selectedTime || loadingSlots}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${booking || !selectedDate || !selectedTime || loadingSlots
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {booking ? (
                                    <div className="flex items-center justify-center">
                                        <div className="loading-spinner mr-2"></div>
                                        Booking Appointment...
                                    </div>
                                ) : (
                                    `Book Appointment for ₹${doctor.consultationFee + 50}`
                                )}
                            </button>

                            <p className="text-sm text-gray-500 text-center mt-4">
                                By booking, you agree to our terms and conditions. You will receive a confirmation email shortly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
