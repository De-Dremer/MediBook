import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, Heart, User, Search, Plus, Activity, Clock } from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

type AppointmentType = {
    id: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
    doctorName: string;
    specialization: string;
};

const SimpleDashboard: React.FC = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ 
        totalAppointments: number;
        upcomingAppointments: number;
        completedAppointments: number;
        nextAppointment: AppointmentType | null;
    }>({
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        nextAppointment: null
    });

    useEffect(() => {
        fetchPatientData();
    }, []);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/appointments/my-appointments');
            
            if (response.data.success) {
                const appointmentsList = response.data.appointments || [];
                setAppointments(appointmentsList);
                
                // Calculate stats from real data
                const total = appointmentsList.length;
                const upcoming = appointmentsList.filter((apt: AppointmentType) => apt.status === 'upcoming').length;
                const completed = appointmentsList.filter((apt: AppointmentType) => apt.status === 'completed').length;
                
                // Find next upcoming appointment
                const nextAppt = (appointmentsList as AppointmentType[])
                    .filter((apt: AppointmentType) => apt.status === 'upcoming')
                    .sort((a: AppointmentType, b: AppointmentType) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
                
                setStats({
                    totalAppointments: total,
                    upcomingAppointments: upcoming,
                    completedAppointments: completed,
                    nextAppointment: nextAppt
                });
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-4 border-[#FFD700]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-[#1A1A2E]/80">
                                Here's your patient dashboard - ready to manage your health journey.
                            </p>
                        </div>
                        <button
                            onClick={fetchPatientData}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                                loading 
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                    : 'bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-[#FFD700]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Activity className="h-4 w-4 mr-2" />
                                    Refresh
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#1A1A2E]">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-[#E6E6FA]">
                                <Calendar className="h-6 w-6 text-[#1A1A2E]" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-[#1A1A2E]">Appointments</h3>
                                <p className="text-2xl font-bold text-[#1A1A2E]">
                                    {loading ? '...' : stats.totalAppointments}
                                </p>
                                <p className="text-sm text-[#1A1A2E]/70">
                                    {stats.nextAppointment 
                                        ? `Next: ${new Date(stats.nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                        : 'No upcoming appointments'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#FFD700]">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-[#FFD700]/20">
                                <User className="h-6 w-6 text-[#FFD700]" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-[#1A1A2E]">Upcoming</h3>
                                <p className="text-2xl font-bold text-[#FFD700]">
                                    {loading ? '...' : stats.upcomingAppointments}
                                </p>
                                <p className="text-sm text-[#1A1A2E]/70">Scheduled</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#E6E6FA]">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-[#E6E6FA]">
                                <Heart className="h-6 w-6 text-[#1A1A2E]" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-[#1A1A2E]">Completed</h3>
                                <p className="text-2xl font-bold text-[#E6E6FA]">
                                    {loading ? '...' : stats.completedAppointments}
                                </p>
                                <p className="text-sm text-[#1A1A2E]/70">Past visits</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/patient/find-doctors"
                        className="bg-white border-2 border-[#1A1A2E] rounded-xl shadow-md p-6 hover:border-[#FFD700] hover:shadow-lg transition-all duration-200 group text-decoration-none hover:bg-[#F5F5F5]"
                    >
                        <div className="text-center">
                            <div className="p-3 rounded-full bg-[#E6E6FA] group-hover:bg-[#FFD700]/20 transition-colors mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                <Search className="h-8 w-8 text-[#1A1A2E]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                                Find Doctors
                            </h3>
                            <p className="text-[#1A1A2E]/80">
                                Search specialists by location & rating
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/patient/book-appointment"
                        className="bg-white border-2 border-[#FFD700] rounded-xl shadow-md p-6 hover:border-[#1A1A2E] hover:shadow-lg transition-all duration-200 group text-decoration-none hover:bg-[#F5F5F5]"
                    >
                        <div className="text-center">
                            <div className="p-3 rounded-full bg-[#FFD700]/20 group-hover:bg-[#1A1A2E]/10 transition-colors mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                <Plus className="h-8 w-8 text-[#FFD700]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                                Book Appointment
                            </h3>
                            <p className="text-[#1A1A2E]/80">
                                Schedule with your preferred doctor
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/patient/appointments"
                        className="bg-white border-2 border-[#E6E6FA] rounded-xl shadow-md p-6 hover:border-[#FFD700] hover:shadow-lg transition-all duration-200 group text-decoration-none hover:bg-[#F5F5F5]"
                    >
                        <div className="text-center">
                            <div className="p-3 rounded-full bg-[#E6E6FA] group-hover:bg-[#FFD700]/20 transition-colors mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                <Activity className="h-8 w-8 text-[#1A1A2E]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                                My Appointments
                            </h3>
                            <p className="text-[#1A1A2E]/80">
                                View your appointment history
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-[#FFD700]">
                    <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6">Recent Activity</h2>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
                            <p className="text-[#1A1A2E]/80">Loading appointments...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-[#E6E6FA] mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">No appointments yet</h3>
                            <p className="text-[#1A1A2E]/80 mb-4">Start your health journey by booking your first appointment</p>
                            <Link
                                to="/patient/find-doctors"
                                className="bg-[#1A1A2E] text-[#FFD700] px-6 py-2 rounded-lg hover:bg-[#1A1A2E]/90 transition-colors"
                            >
                                Find Doctors
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.slice(0, 3).map((appointment: AppointmentType) => (
                                <div key={appointment.id} className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full mr-4 ${
                                            appointment.status === 'completed' ? 'bg-[#E6E6FA]' : 
                                            appointment.status === 'upcoming' ? 'bg-[#FFD700]/20' : 'bg-[#E6E6FA]/50'
                                        }`}>
                                            {appointment.status === 'completed' ? (
                                                <User className="h-5 w-5 text-[#1A1A2E]" />
                                            ) : appointment.status === 'upcoming' ? (
                                                <Calendar className="h-5 w-5 text-[#FFD700]" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-[#1A1A2E]" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#1A1A2E]">
                                                {appointment.status === 'upcoming' ? 'Upcoming: ' : ''}
                                                Dr. {appointment.doctorName}
                                            </h3>
                                            <p className="text-sm text-[#1A1A2E]/80">
                                                {appointment.specialization} - {appointment.date} at {appointment.time}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        appointment.status === 'completed' ? 'bg-[#E6E6FA] text-[#1A1A2E]' :
                                        appointment.status === 'upcoming' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                                        'bg-[#E6E6FA]/50 text-[#1A1A2E]'
                                    }`}>
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {appointments.length > 0 && (
                        <div className="mt-6 text-center">
                            <Link
                                to="/patient/appointments"
                                className="text-[#1A1A2E] hover:text-[#FFD700] font-medium transition-colors"
                            >
                                View all appointments →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimpleDashboard;
