import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Filter, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Types
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
    const [refreshing, setRefreshing] = useState<boolean>(false);

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

    // ✅ Fetch doctors from backend
    const fetchDoctors = async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) setRefreshing(true);
            else setLoading(true);

            console.log('🔄 Fetching doctors from backend...');

            // Build query parameters
            const params = new URLSearchParams();
            if (selectedSpecialization && selectedSpecialization !== 'All Specializations') {
                params.append('specialization', selectedSpecialization);
            }
            if (selectedLocation) {
                params.append('location', selectedLocation);
            }
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const url = `/doctors${params.toString() ? `?${params}` : ''}`;
            const response = await api.get(url);

            if (response.data.success) {
                setDoctors(response.data.doctors || []);
                console.log('✅ Doctors loaded:', response.data.doctors?.length);

                if (showRefreshLoader) {
                    toast.success('Doctors list refreshed');
                }
            } else {
                console.error('❌ Failed to load doctors:', response.data.message);
                toast.error(response.data.message || 'Failed to load doctors');
                setDoctors([]);
            }
        } catch (error: any) {
            console.error('❌ Error loading doctors:', error);

            if (error.response?.status === 401) {
                toast.error('Please login again');
            } else {
                toast.error('Failed to load doctors');
            }
            setDoctors([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchDoctors();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        if (!loading) { // Don't refetch during initial load
            const debounceTimer = setTimeout(() => {
                fetchDoctors();
            }, 500); // Debounce search

            return () => clearTimeout(debounceTimer);
        }
    }, [searchTerm, selectedSpecialization, selectedLocation]);

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch = searchTerm === '' ||
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = selectedSpecialization === '' ||
            selectedSpecialization === 'All Specializations' ||
            doctor.specialization === selectedSpecialization;
        const matchesLocation = selectedLocation === '' || doctor.location === selectedLocation;

        return matchesSearch && matchesSpecialization && matchesLocation;
    });

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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
                            <p className="text-gray-600">
                                Search and book appointments with qualified healthcare professionals
                            </p>
                        </div>
                        <button
                            onClick={() => fetchDoctors(true)}
                            disabled={refreshing}
                            className="btn-secondary flex items-center"
                        >
                            <Search className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search doctors, specializations..."
                                className="form-input pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Specialization Filter */}
                        <select
                            className="form-input"
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                        >
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>

                        {/* Location Filter */}
                        <select
                            className="form-input"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            <option value="">All Locations</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Pune">Pune</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                        </select>

                        {/* Clear Filters Button */}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedSpecialization('');
                                setSelectedLocation('');
                            }}
                            className="btn-secondary flex items-center justify-center"
                        >
                            <Filter className="h-5 w-5 mr-2" />
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        Found {filteredDoctors.length} doctors
                    </p>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => {
                            const sortBy = e.target.value;
                            const sortedDoctors = [...doctors].sort((a, b) => {
                                switch (sortBy) {
                                    case 'rating':
                                        return b.rating - a.rating;
                                    case 'experience':
                                        return b.experience - a.experience;
                                    case 'fee':
                                        return a.consultationFee - b.consultationFee;
                                    default:
                                        return 0;
                                }
                            });
                            setDoctors(sortedDoctors);
                        }}
                    >
                        <option value="">Sort by</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="experience">Sort by Experience</option>
                        <option value="fee">Sort by Fee</option>
                    </select>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                            <div className="flex items-start space-x-4">
                                {/* Doctor Image */}
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img
                                        src={doctor.image || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face`}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face`;
                                        }}
                                    />
                                </div>

                                {/* Doctor Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                {doctor.name}
                                            </h3>
                                            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                            <p className="text-sm text-gray-600">{doctor.qualification}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm font-medium">{doctor.rating || 4.5}</span>
                                                <span className="ml-1 text-sm text-gray-500">({doctor.reviewCount || 0})</span>
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
                                                {doctor.availability || 'Available'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 mt-4">
                                        <Link
                                            to={`/patient/doctor/${doctor.id}`}
                                            className="btn-secondary flex-1 text-center"
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            to={`/patient/book-appointment/${doctor.id}`}
                                            className="btn-primary flex-1 text-center"
                                        >
                                            Book Appointment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or browse all doctors
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedSpecialization('');
                                setSelectedLocation('');
                            }}
                            className="btn-primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindDoctors;
