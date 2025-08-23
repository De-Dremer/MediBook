import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, Heart, User, Search, Plus, Activity } from 'lucide-react';

const SimpleDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's your patient dashboard - ready to manage your health journey.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                                <p className="text-2xl font-bold text-blue-600">3</p>
                                <p className="text-sm text-gray-500">Next: Aug 25</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <User className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Doctors</h3>
                                <p className="text-2xl font-bold text-green-600">5</p>
                                <p className="text-sm text-gray-500">Visited</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <Heart className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
                                <p className="text-2xl font-bold text-purple-600">85%</p>
                                <p className="text-sm text-gray-500">Excellent</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/patient/find-doctors"
                        className="medical-card hover:border-blue-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-blue-200">
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
                        to="/patient/book-appointment"
                        className="medical-card hover:border-green-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-green-200">
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
                        to="/patient/appointments"
                        className="medical-card hover:border-purple-300 transition-all duration-200 group text-decoration-none"
                    >
                        <div className="text-center">
                            <div className="medical-icon group-hover:bg-purple-200">
                                <Activity className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                My Appointments
                            </h3>
                            <p className="text-gray-600">
                                View your appointment history
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-full mr-4">
                                    <User className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Appointment with Dr. Sarah Wilson</h3>
                                    <p className="text-sm text-gray-600">Cardiology - Completed on Aug 20, 2025</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Completed
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-full mr-4">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Upcoming: Dr. Emily Brown</h3>
                                    <p className="text-sm text-gray-600">General Medicine - Aug 25, 2025 at 11:00 AM</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                Confirmed
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            to="/patient/appointments"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View all appointments →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleDashboard;
