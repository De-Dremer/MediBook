import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Users, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
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
    const [allDoctors, setAllDoctors] = useState<Doctor[]>([]); // ✅ Store all doctors for client-side filtering
    const [loading, setLoading] = useState<boolean>(true);
    const [_showFilters, _setShowFilters] = useState<boolean>(false);

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

    // ✅ Enhanced fetch doctors function
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching doctors from backend...');

            const response = await api.get('/doctors');
            console.log('📥 API Response:', response.data);

            if (response.data.success) {
                const doctorsList = response.data.doctors || [];
                setAllDoctors(doctorsList); // Store all doctors
                setDoctors(doctorsList); // Initially show all doctors
                console.log('✅ Doctors loaded:', doctorsList.length);

                if (doctorsList.length === 0) {
                    toast.success('No doctors registered yet. First doctor to register will appear here!');
                } else {
                    toast.success(`Found ${doctorsList.length} doctor${doctorsList.length > 1 ? 's' : ''}`);
                }
            } else {
                console.error('❌ Failed to load doctors:', response.data.message);
                toast.error(response.data.message || 'Failed to load doctors');
                setDoctors([]);
                setAllDoctors([]);
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
            setAllDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Real-time filtering function
    const filterDoctors = () => {
        let filtered = [...allDoctors];

        // Search by name, specialization, or location
        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by specialization
        if (selectedSpecialization && selectedSpecialization !== 'All Specializations') {
            filtered = filtered.filter(doctor =>
                doctor.specialization === selectedSpecialization
            );
        }

        // Filter by location
        if (selectedLocation) {
            filtered = filtered.filter(doctor =>
                doctor.location === selectedLocation
            );
        }

        setDoctors(filtered);

        // Show appropriate message for filtered results
        if (searchTerm || selectedSpecialization !== 'All Specializations' || selectedLocation) {
            if (filtered.length === 0) {
                toast.error('No doctors match your search criteria');
            } else {
                console.log(`📊 Filtered to ${filtered.length} doctor${filtered.length > 1 ? 's' : ''}`);
            }
        }
    };

    // ✅ Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSpecialization('');
        setSelectedLocation('');
        setDoctors(allDoctors);
        toast.success('Filters cleared');
    };

    // ✅ Get unique locations from doctors data
    const availableLocations = [...new Set(allDoctors.map(doctor => doctor.location))].filter(Boolean);

    // Initial fetch
    useEffect(() => {
        fetchDoctors();
    }, []);

    // ✅ Filter doctors when search criteria changes
    useEffect(() => {
        if (allDoctors.length > 0) {
            filterDoctors();
        }
    }, [searchTerm, selectedSpecialization, selectedLocation, allDoctors]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">Find Doctors</h1>
                                    <p className="text-[#1A1A2E]/80">
                    {allDoctors.length === 0
                        ? "No doctors registered yet. Be the first to register as a doctor!"
                        : "Search and book appointments with qualified healthcare professionals"
                    }
                </p>

                </div>

                {/* Search and Filters */}
                {allDoctors.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-[#FFD700]">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-[#1A1A2E]/60" />
                                <input
                                    type="text"
                                    placeholder="Search doctors, specializations..."
                                    className="w-full pl-10 pr-4 py-2 border border-[#E6E6FA] rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-3 text-[#1A1A2E]/60 hover:text-[#1A1A2E]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
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
                                {availableLocations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>

                            <div className="flex space-x-2">
                                <button
                                    onClick={clearFilters}
                                    disabled={!searchTerm && !selectedSpecialization && !selectedLocation}
                                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${searchTerm || selectedSpecialization || selectedLocation
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={fetchDoctors}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchTerm || selectedSpecialization || selectedLocation) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                {searchTerm && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Search: "{searchTerm}"
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="ml-2 hover:text-blue-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedSpecialization && selectedSpecialization !== 'All Specializations' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {selectedSpecialization}
                                        <button
                                            onClick={() => setSelectedSpecialization('')}
                                            className="ml-2 hover:text-green-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedLocation && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {selectedLocation}
                                        <button
                                            onClick={() => setSelectedLocation('')}
                                            className="ml-2 hover:text-purple-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Results Header */}
                {allDoctors.length > 0 && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-600">
                            {doctors.length === allDoctors.length
                                ? `Showing all ${doctors.length} doctor${doctors.length > 1 ? 's' : ''}`
                                : `Showing ${doctors.length} of ${allDoctors.length} doctor${allDoctors.length > 1 ? 's' : ''}`
                            }
                        </p>
                        {doctors.length !== allDoctors.length && (
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Show all doctors
                            </button>
                        )}
                    </div>
                )}

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img
                                        src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=80`}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=80`;
                                        }}
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
                                                <span className="ml-1 text-sm font-medium">{doctor.rating || 4.5}</span>
                                                <span className="ml-1 text-sm text-gray-500">({doctor.reviewCount || 0})</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">₹{doctor.consultationFee}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {doctor.about || `Experienced ${doctor.specialization} specialist with ${doctor.experience}+ years of practice.`}
                                    </p>

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

                {/* Empty States */}
                {allDoctors.length === 0 && !loading && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors registered yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Your medical platform is ready! Doctors can register to start offering consultations.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Register as Doctor
                            </Link>
                            <button
                                onClick={fetchDoctors}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                )}

                {allDoctors.length > 0 && doctors.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors match your search</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or browse all doctors
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
