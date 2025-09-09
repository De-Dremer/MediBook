import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    TrendingUp,
    User,
    Edit,
    Activity,
    FileText,
    DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface DashboardStats {
    totalAppointments: number;
    todaysAppointments: number;
    percentageChange: string;
    nextAppointmentTime: string;
    nextAppointmentPatient: string | null;
    nextAppointmentDate: string | null;
}

interface Doctor {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    location: string;
    about: string;
    profileImage: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
}

const DoctorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setStatsLoading(true);

            // Fetch doctor profile and stats in parallel
            const [profileResponse, statsResponse] = await Promise.all([
                api.get('/doctors/profile'),
                api.get('/doctors/dashboard/stats')
            ]);

            if (profileResponse.data.success) {
                setDoctor(profileResponse.data.doctor);
            }

            if (statsResponse.data.success) {
                setStats(statsResponse.data.stats);
            }

        } catch (error: any) {
            console.error('❌ Error fetching dashboard data:', error);

            if (error.response?.status === 401) {
                toast.error('Please login as a doctor to access dashboard');
            } else {
                toast.error('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
            setStatsLoading(false);
        }
    };

    

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {doctor?.name || user?.name}!
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Here's what's happening with your practice today
                            </p>
                        </div>
                        <Link
                            to="/doctor/profile"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Appointments */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Appointments
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {statsLoading ? '...' : (stats?.totalAppointments || 0)}
                                            </div>
                                            {stats?.percentageChange && (
                                                <div className={`ml-2 flex items-baseline text-sm font-semibold ${stats.percentageChange.startsWith('+')
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                    }`}>
                                                    <TrendingUp className="h-4 w-4 mr-1" />
                                                    {stats.percentageChange} from last month
                                                </div>
                                            )}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Appointments */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Today's Appointments
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {statsLoading ? '...' : (stats?.todaysAppointments || 0)}
                                            </div>
                                            <div className="ml-2 text-sm text-gray-600">
                                                {stats?.nextAppointmentTime && stats.nextAppointmentTime !== 'No upcoming appointments'
                                                    ? `Next: ${stats.nextAppointmentTime}`
                                                    : 'No appointments today'
                                                }
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Activity className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Rating
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {doctor?.rating || 4.5}
                                            </div>
                                            <div className="ml-2 text-sm text-gray-600">
                                                ({doctor?.reviewCount || 0} reviews)
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Fee */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Consultation Fee
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                ₹{doctor?.consultationFee || 1000}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Overview & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Overview */}
                    <div className="bg-white shadow-lg rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Profile Overview
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            {doctor ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                            <img
                                                src={doctor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=64`}
                                                alt={doctor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{doctor.name}</h4>
                                            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                            <p className="text-sm text-gray-600">{doctor.qualification}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Experience:</span>
                                            <p className="font-medium">{doctor.experience}+ years</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Location:</span>
                                            <p className="font-medium">{doctor.location}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phone:</span>
                                            <p className="font-medium">{doctor.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Verified:</span>
                                            <p className={`font-medium ${doctor.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                                {doctor.isVerified ? 'Verified' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    {doctor.about && (
                                        <div>
                                            <span className="text-gray-500 text-sm">About:</span>
                                            <p className="text-gray-700 mt-1">{doctor.about}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">Loading profile...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white shadow-lg rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Quick Actions
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                <Link
                                    to="/doctor/appointments"
                                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">View Appointments</h4>
                                        <p className="text-sm text-gray-600">Manage your appointment schedule</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/doctor/profile"
                                    className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <User className="h-6 w-6 text-green-600 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Update Profile</h4>
                                        <p className="text-sm text-gray-600">Edit your professional information</p>
                                    </div>
                                </Link>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <FileText className="h-6 w-6 text-gray-600 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Patient Records</h4>
                                        <p className="text-sm text-gray-600">Coming soon</p>
                                    </div>
                                </div>

                                <button
                                    onClick={fetchDashboardData}
                                    className="w-full flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Activity className="h-6 w-6 text-purple-600 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Refresh Dashboard</h4>
                                        <p className="text-sm text-gray-600">Update statistics</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
