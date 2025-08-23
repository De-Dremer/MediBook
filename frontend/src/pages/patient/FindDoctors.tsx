import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext'; // ✅ Import the API instance
import toast from 'react-hot-toast';

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    qualification: string;
    experience: number;
    rating: number;
    reviewCount: number;
    consultationFee: number;
    location: string;
    availability: string;
    image: string;
    about: string;
}

const FindDoctors: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const specializations: string[] = [
        'All Specializations',
        'Cardiology',
        'Dermatology',
        'General Medicine',
        'Gynecology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
    ];

    // ✅ Fetch doctors using the configured API instance
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching doctors from backend...');

            // ✅ Use the api instance that automatically includes auth headers
            const response = await api.get('/doctors');

            console.log('📥 API Response:', response.data);

            if (response.data.success) {
                setDoctors(response.data.doctors || []);
                console.log('✅ Doctors loaded:', response.data.doctors?.length);
                toast.success(`Found ${response.data.doctors?.length || 0} doctors`);
            } else {
                console.error('❌ Failed to load doctors:', response.data.message);
                toast.error(response.data.message || 'Failed to load doctors');
                setDoctors([]);
            }
        } catch (error: any) {
            console.error('❌ Error loading doctors:', error);

            if (error.response?.status === 401) {
                toast.error('Please login to view doctors');
            } else if (error.response?.status === 404) {
                toast.error('Doctors endpoint not found');
            } else {
                toast.error('Failed to load doctors. Please try again.');
            }
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchDoctors();
    }, []);

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
                    <p className="text-gray-600">
                        Search and book appointments with qualified healthcare professionals
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                        >
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>

                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            <option value="">All Locations</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Pune">Pune</option>
                        </select>

                        <button
                            onClick={fetchDoctors}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Found {doctors.length} doctors
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {doctor.name}
                                            </h3>
                                            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                            <p className="text-sm text-gray-600">{doctor.qualification}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                                                <span className="ml-1 text-sm text-gray-500">({doctor.reviewCount})</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">₹{doctor.consultationFee}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-2">{doctor.about}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                {doctor.experience}+ years
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {doctor.location}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Available
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 mt-4">
                                        <Link
                                            to={`/patient/doctor/${doctor.id}`}
                                            className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            to={`/patient/book-appointment/${doctor.id}`}
                                            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Book Appointment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {doctors.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or browse all doctors
                        </p>
                        <button
                            onClick={fetchDoctors}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindDoctors;
