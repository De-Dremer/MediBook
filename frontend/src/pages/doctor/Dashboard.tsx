import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar,
    Clock,
    Users,
    DollarSign,
    TrendingUp,
    Bell,
    Activity,
    CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';

interface DashboardStats {
    totalAppointments: number;
    todayAppointments: number;
    totalPatients: number;
    monthlyEarnings: number;
    upcomingAppointments: any[];
    recentPatients: any[];
}

const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalAppointments: 0,
        todayAppointments: 0,
        totalPatients: 0,
        monthlyEarnings: 0,
        upcomingAppointments: [],
        recentPatients: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log('🔄 Fetching doctor dashboard data...');
                const response = await api.get('/doctor/dashboard');

                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error('❌ Error fetching dashboard:', error);
                // Use mock data for now
                setStats({
                    totalAppointments: 156,
                    todayAppointments: 8,
                    totalPatients: 124,
                    monthlyEarnings: 85000,
                    upcomingAppointments: [
                        {
                            id: 1,
                            patientName: 'John Doe',
                            time: '10:00 AM',
                            type: 'Consultation',
                            status: 'confirmed'
                        },
                        {
                            id: 2,
                            patientName: 'Jane Smith',
                            time: '11:30 AM',
                            type: 'Follow-up',
                            status: 'confirmed'
                        }
                    ],
                    recentPatients: [
                        {
                            id: 1,
                            name: 'Alice Johnson',
                            lastVisit: '2025-08-22',
                            condition: 'Hypertension'
                        },
                        {
                            id: 2,
                            name: 'Bob Wilson',
                            lastVisit: '2025-08-21',
                            condition: 'Diabetes'
                        }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Total Appointments',
            value: stats.totalAppointments,
            icon: Calendar,
            color: 'bg-blue-500',
            change: '+12% from last month'
        },
        {
            title: 'Today\'s Appointments',
            value: stats.todayAppointments,
            icon: Clock,
            color: 'bg-green-500',
            change: 'Next: 10:00 AM'
        },
        {
            title: 'Total Patients',
            value: stats.totalPatients,
            icon: Users,
            color: 'bg-purple-500',
            change: '+8 new this month'
        },
        {
            title: 'Monthly Earnings',
            value: `₹${stats.monthlyEarnings.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-orange-500',
            change: '+15% from last month'
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
                        Welcome back, {user?.name?.split(' ')[1]}! 👨‍⚕️
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's your practice overview for today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Link
                        to="/doctor/appointments"
                        className="medical-card hover:border-blue-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-blue-200">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Appointments
                            </h3>
                            <p className="text-gray-600">
                                Manage your schedule
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/doctor/patients"
                        className="medical-card hover:border-green-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-green-200">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Patients
                            </h3>
                            <p className="text-gray-600">
                                View patient records
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/doctor/profile"
                        className="medical-card hover:border-purple-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-purple-200">
                                <Activity className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Profile
                            </h3>
                            <p className="text-gray-600">
                                Update your information
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/doctor/analytics"
                        className="medical-card hover:border-orange-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-orange-200">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Analytics
                            </h3>
                            <p className="text-gray-600">
                                Practice insights
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Today's Appointments */}
                    <div className="medical-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Today's Appointments
                            </h2>
                            <Link
                                to="/doctor/appointments"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                View all
                            </Link>
                        </div>

                        {stats.upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {stats.upcomingAppointments.map((appointment) => (
                                    <div key={appointment.id} className="appointment-card">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <Users className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {appointment.patientName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {appointment.type} • {appointment.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="badge-confirmed">
                                                    {appointment.status}
                                                </span>
                                                <button className="btn-primary text-xs px-3 py-1">
                                                    Start
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No appointments scheduled for today</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Patients */}
                    <div className="medical-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Recent Patients
                            </h2>
                            <Link
                                to="/doctor/patients"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                View all
                            </Link>
                        </div>

                        {stats.recentPatients.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentPatients.map((patient) => (
                                    <div key={patient.id} className="appointment-card">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                    <Users className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {patient.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {patient.condition} • Last: {patient.lastVisit}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="btn-secondary text-xs px-3 py-1">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No recent patient records</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
