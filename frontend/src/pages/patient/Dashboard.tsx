import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    Heart,
    Search,
    Plus,
    Activity
} from 'lucide-react';

// ✅ Define TypeScript interfaces
interface Appointment {
    id: number;
    doctor: string;
    specialization: string;
    date: string;
    time: string;
    status: string;
    type: string;
}

interface Stat {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    change: string;
}

const PatientDashboard: React.FC = () => {
    const { user } = useAuth();

    // ✅ Use typed state declarations
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Mock data for now - we'll replace with real API calls later
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setRecentAppointments([
                {
                    id: 1,
                    doctor: "Dr. Sarah Wilson",
                    specialization: "Cardiology",
                    date: "2025-08-20",
                    time: "10:00 AM",
                    status: "completed",
                    type: "Follow-up"
                },
                {
                    id: 2,
                    doctor: "Dr. Michael Chen",
                    specialization: "Dermatology",
                    date: "2025-08-15",
                    time: "2:30 PM",
                    status: "completed",
                    type: "Consultation"
                }
            ]);

            setUpcomingAppointments([
                {
                    id: 3,
                    doctor: "Dr. Emily Brown",
                    specialization: "General Medicine",
                    date: "2025-08-25",
                    time: "11:00 AM",
                    status: "confirmed",
                    type: "Check-up"
                }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const stats: Stat[] = [
        {
            title: "Total Appointments",
            value: "12",
            icon: Calendar,
            color: "bg-blue-500",
            change: "+2 this month"
        },
        {
            title: "Upcoming",
            value: "3",
            icon: Clock,
            color: "bg-green-500",
            change: "Next: Aug 25"
        },
        {
            title: "Doctors Visited",
            value: "5",
            icon: User,
            color: "bg-purple-500",
            change: "3 specialists"
        },
        {
            title: "Health Score",
            value: "85%",
            icon: Activity,
            color: "bg-orange-500",
            change: "+5% improved"
        }
    ];

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
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's your health overview and upcoming appointments
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="medical-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/patient/book-appointment"
                        className="medical-card hover:border-blue-300 transition-all duration-200 group"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-blue-200">
                                <Plus className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Book Appointment
                            </h3>
                            <p className="text-gray-600">
                                Schedule with your preferred doctor
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/patient/find-doctors"
                        className="medical-card hover:border-green-300 transition-all duration-200 group"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-green-200">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Find Doctors
                            </h3>
                            <p className="text-gray-600">
                                Search specialists by location & rating
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/patient/profile"
                        className="medical-card hover:border-purple-300 transition-all duration-200 group"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-purple-200">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Health Profile
                            </h3>
                            <p className="text-gray-600">
                                Manage your medical information
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Appointments Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Appointments */}
                    <div className="medical-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Upcoming Appointments
                            </h2>
                            <Link
                                to="/patient/appointments"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                View all
                            </Link>
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment) => (
                                    <div key={appointment.id} className="appointment-card">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {appointment.doctor}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.specialization}
                                                </p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {appointment.date}
                                                    <Clock className="h-4 w-4 ml-3 mr-1" />
                                                    {appointment.time}
                                                </div>
                                            </div>
                                            <span className="badge-confirmed">
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No upcoming appointments</p>
                                <Link
                                    to="/patient/book-appointment"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Book your first appointment
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Appointments */}
                    <div className="medical-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Appointments
                            </h2>
                            <Link
                                to="/patient/appointments"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                View history
                            </Link>
                        </div>

                        {recentAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {recentAppointments.map((appointment) => (
                                    <div key={appointment.id} className="appointment-card">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {appointment.doctor}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.specialization}
                                                </p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {appointment.date}
                                                    <Clock className="h-4 w-4 ml-3 mr-1" />
                                                    {appointment.time}
                                                </div>
                                            </div>
                                            <span className="badge-completed">
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No appointment history</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
