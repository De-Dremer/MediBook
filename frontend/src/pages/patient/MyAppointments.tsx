import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Appointment {
    id: string;
    doctorId: string;
    doctorName: string;
    doctorImage?: string;
    specialization: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
    appointmentType: string;
    consultationFee: number;
    location: string;
    symptoms?: string;
    notes?: string;
    createdAt: string;
}

const MyAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching appointments...');

            const response = await api.get('/appointments/my-appointments');

            if (response.data.success) {
                setAppointments(response.data.appointments || []);
                console.log('✅ Appointments loaded:', response.data.appointments?.length);
            } else {
                toast.error(response.data.message || 'Failed to load appointments');
                setAppointments([]);
            }
        } catch (error: any) {
            console.error('❌ Error loading appointments:', error);

            if (error.response?.status === 401) {
                toast.error('Please login to view appointments');
            } else {
                toast.error('Failed to load appointments');
            }
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Cancel Appointment Function
    const handleCancelAppointment = async (appointmentId: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            setCancellingId(appointmentId);
            console.log('🔄 Cancelling appointment:', appointmentId);

            const response = await api.put(`/appointments/cancel/${appointmentId}`);

            if (response.data.success) {
                toast.success('Appointment cancelled successfully');

                // Update the appointment status in the local state
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === appointmentId
                            ? { ...apt, status: 'cancelled' as const }
                            : apt
                    )
                );
            } else {
                toast.error(response.data.message || 'Failed to cancel appointment');
            }
        } catch (error: any) {
            console.error('❌ Error cancelling appointment:', error);

            if (error.response?.status === 403) {
                toast.error('You are not authorized to cancel this appointment');
            } else if (error.response?.status === 404) {
                toast.error('Appointment not found');
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Cannot cancel this appointment');
            } else {
                toast.error('Failed to cancel appointment');
            }
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancelled
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">
                        Manage your appointments and medical consultations
                    </p>
                </div>

                {/* Appointments List */}
                <div className="space-y-6">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                            <img
                                                src={appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'}
                                                alt={appointment.doctorName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {appointment.doctorName}
                                                    </h3>
                                                    <p className="text-blue-600 font-medium">{appointment.specialization}</p>
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            {formatDate(appointment.date)}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="h-4 w-4 mr-2" />
                                                            {appointment.time}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="h-4 w-4 mr-2" />
                                                            {appointment.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    {getStatusBadge(appointment.status)}
                                                    <p className="text-sm text-gray-600 mt-2">₹{appointment.consultationFee}</p>
                                                </div>
                                            </div>

                                            {appointment.symptoms && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Symptoms:</strong> {appointment.symptoms}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="mt-4 flex space-x-3">
                                                {appointment.status === 'upcoming' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCancelAppointment(appointment.id)}
                                                            disabled={cancellingId === appointment.id}
                                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${cancellingId === appointment.id
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                }`}
                                                        >
                                                            {cancellingId === appointment.id ? (
                                                                <div className="flex items-center">
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                                                                    Cancelling...
                                                                </div>
                                                            ) : (
                                                                'Cancel'
                                                            )}
                                                        </button>
                                                        <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                                            Reschedule
                                                        </button>
                                                    </>
                                                )}

                                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                            <p className="text-gray-600 mb-6">
                                You haven't booked any appointments yet.
                            </p>
                            <a
                                href="/patient/find-doctors"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Find Doctors
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAppointments;
