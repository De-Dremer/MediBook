import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, FileText, ArrowLeft } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Doctor {
    id: string; // ✅ Ensure this is string, not number
    name: string;
    specialization: string;
    qualification: string;
    consultationFee: number;
    location: string;
    image: string;
}

const BookAppointment: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<string>('consultation');
    const [symptoms, setSymptoms] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [doctorLoading, setDoctorLoading] = useState<boolean>(true);

    // Fetch doctor details
    useEffect(() => {
        const fetchDoctor = async () => {
            if (!doctorId) {
                toast.error('Doctor ID is required');
                navigate('/patient/find-doctors');
                return;
            }

            try {
                setDoctorLoading(true);
                console.log('🔄 Fetching doctor with ID:', doctorId);

                const response = await api.get(`/doctors/${doctorId}`);

                if (response.data.success) {
                    setDoctor(response.data.doctor);
                    console.log('✅ Doctor loaded:', response.data.doctor);
                } else {
                    toast.error('Doctor not found');
                    navigate('/patient/find-doctors');
                }
            } catch (error: any) {
                console.error('❌ Error fetching doctor:', error);
                toast.error('Failed to load doctor details');
                navigate('/patient/find-doctors');
            } finally {
                setDoctorLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId, navigate]);

    const handleBookAppointment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to book appointment');
            navigate('/login');
            return;
        }

        if (!selectedDate || !selectedTime) {
            toast.error('Please select both date and time');
            return;
        }

        try {
            setLoading(true);
            console.log('🔄 Booking appointment with data:', {
                doctorId: doctorId, // ✅ This should be a UUID string
                date: selectedDate,
                time: selectedTime,
                appointmentType,
                symptoms
            });

            const response = await api.post('/appointments/book', {
                doctorId: doctorId, // ✅ Send as string UUID
                date: selectedDate,
                time: selectedTime,
                appointmentType,
                symptoms: symptoms || null
            });

            if (response.data.success) {
                toast.success('Appointment booked successfully!');
                navigate('/patient/appointments');
            } else {
                toast.error(response.data.message || 'Failed to book appointment');
            }
        } catch (error: any) {
            console.error('❌ Error booking appointment:', error);

            if (error.response?.status === 401) {
                toast.error('Please login to book appointment');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to book appointment');
            }
        } finally {
            setLoading(false);
        }
    };

    // Generate available time slots
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ];

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    // Get maximum date (30 days from now)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const _maxDateString = maxDate.toISOString().split('T');

    if (doctorLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor not found</h2>
                    <button
                        onClick={() => navigate('/patient/find-doctors')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Find Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/patient/find-doctors')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Find Doctors
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
                    <p className="text-gray-600">Schedule your consultation with the doctor</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Doctor Information */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor Information</h2>

                        <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                <p className="text-sm text-gray-600">{doctor.qualification}</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-600">
                                        <strong>Fee:</strong> ₹{doctor.consultationFee}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Location:</strong> {doctor.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h2>

                        <form onSubmit={handleBookAppointment} className="space-y-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        id="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={today}
                                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Time *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-3 text-sm border rounded-lg transition-colors ${selectedTime === time
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Type
                                </label>
                                <select
                                    id="appointmentType"
                                    value={appointmentType}
                                    onChange={(e) => setAppointmentType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="consultation">Consultation</option>
                                    <option value="follow-up">Follow-up</option>
                                    <option value="check-up">Check-up</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                                    Symptoms / Reason for Visit
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea
                                        id="symptoms"
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        rows={3}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        placeholder="Describe your symptoms or reason for visit..."
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-900">Consultation Fee:</span>
                                    <span className="text-2xl font-bold text-blue-600">₹{doctor.consultationFee}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !selectedDate || !selectedTime}
                                    className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading || !selectedDate || !selectedTime
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                        } transition-colors duration-200`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Booking...
                                        </div>
                                    ) : (
                                        'Book Appointment'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
