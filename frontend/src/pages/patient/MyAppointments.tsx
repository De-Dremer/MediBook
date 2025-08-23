import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Appointment {
    id: number;
    doctorId: number;
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
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // ✅ Fetch appointments from backend
    const fetchAppointments = async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) setRefreshing(true);
            else setLoading(true);

            console.log('🔄 Fetching appointments from backend...');
            const response = await api.get('/appointments/my-appointments');

            if (response.data.success) {
                setAppointments(response.data.appointments || []);
                console.log('✅ Appointments loaded:', response.data.appointments?.length);

                if (showRefreshLoader) {
                    toast.success('Appointments refreshed');
                }
            } else {
                console.error('❌ Failed to load appointments:', response.data.message);
                toast.error(response.data.message || 'Failed to load appointments');
                setAppointments([]);
            }
        } catch (error: any) {
            console.error('❌ Error loading appointments:', error);

            if (error.response?.status === 401) {
                toast.error('Please login again');
            } else {
                toast.error('Failed to load appointments');
            }
            setAppointments([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // ✅ Cancel appointment
    const handleCancelAppointment = async (appointmentId: number) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            console.log('🔄 Cancelling appointment...');
            const response = await api.put(`/appointments/${appointmentId}/cancel`);

            if (response.data.success) {
                toast.success('Appointment cancelled successfully');

                // Update local state
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
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    // ✅ Reschedule appointment
    const handleRescheduleAppointment = async (appointmentId: number) => {
        const newDate = prompt('Enter new date (YYYY-MM-DD):');
        const newTime = prompt('Enter new time (HH:MM AM/PM):');

        if (!newDate || !newTime) {
            return;
        }

        try {
            console.log('🔄 Rescheduling appointment...');
            const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
                date: newDate,
                time: newTime
            });

            if (response.data.success) {
                toast.success('Appointment rescheduled successfully');

                // Update local state
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === appointmentId
                            ? { ...apt, date: newDate, time: newTime }
                            : apt
                    )
                );
            } else {
                toast.error(response.data.message || 'Failed to reschedule appointment');
            }
        } catch (error: any) {
            console.error('❌ Error rescheduling appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (activeTab === 'all') return true;
        return appointment.status === activeTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'badge-confirmed';
            case 'completed':
                return 'badge-completed';
            case 'cancelled':
                return 'badge-cancelled';
            case 'pending':
                return 'badge-pending';
            default:
                return 'badge-pending';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                            <p className="text-gray-600">
                                Manage your upcoming and past appointments
                            </p>
                        </div>
                        <button
                            onClick={() => fetchAppointments(true)}
                            disabled={refreshing}
                            className="btn-secondary flex items-center"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'upcoming'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Upcoming ({appointments.filter(a => a.status === 'upcoming').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Completed ({appointments.filter(a => a.status === 'completed').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'all'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All ({appointments.length})
                        </button>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-6">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* Doctor Image */}
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                        <img
                                            src={appointment.doctorImage || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face`}
                                            alt={appointment.doctorName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face`;
                                            }}
                                        />
                                    </div>

                                    {/* Appointment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {appointment.doctorName}
                                                </h3>
                                                <p className="text-blue-600 font-medium">{appointment.specialization}</p>
                                                <p className="text-sm text-gray-600 capitalize">{appointment.appointmentType}</p>
                                            </div>
                                            <span className={`${getStatusBadge(appointment.status)} capitalize`}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

                                        {/* Symptoms */}
                                        {appointment.symptoms && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Symptoms/Reason:</p>
                                                <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {appointment.notes && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm font-medium text-blue-700 mb-1">Doctor's Notes:</p>
                                                <p className="text-sm text-blue-700">{appointment.notes}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-gray-600">
                                                Fee: ₹{appointment.consultationFee}
                                            </div>
                                            <div className="flex space-x-3">
                                                {appointment.status === 'upcoming' && (
                                                    <>
                                                        <button
                                                            className="btn-secondary"
                                                            onClick={() => handleRescheduleAppointment(appointment.id)}
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button className="btn-primary">
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Join Call
                                                        </button>
                                                        <button
                                                            className="btn-secondary text-red-600 hover:bg-red-50"
                                                            onClick={() => handleCancelAppointment(appointment.id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.status === 'completed' && (
                                                    <button className="btn-primary">
                                                        Download Report
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-600 mb-4">
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming appointments"
                                : activeTab === 'completed'
                                    ? "You don't have any completed appointments"
                                    : "You don't have any appointments yet"
                            }
                        </p>
                        <Link to="/patient/find-doctors" className="btn-primary">
                            Find Doctors
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
