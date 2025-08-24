import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    Award,
    DollarSign,
    FileText,
    ArrowLeft,
    Save,
    Camera,
    AlertCircle,
    Edit,
    X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Doctor {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    specialization: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    location: string;
    about: string | null;
    profileImage: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
}

const DoctorProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        location: '',
        about: '',
        profileImage: '',
        dateOfBirth: '',
        gender: ''
    });

    const specializations = [
        'Cardiology',
        'Dermatology',
        'General Medicine',
        'Gynecology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Emergency Medicine',
        'Internal Medicine',
        'Surgery',
        'Radiology'
    ];

    useEffect(() => {
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching current doctor profile...');
            console.log('👤 Current user:', user);

            const response = await api.get('/doctors/profile');
            console.log('📥 Profile API Response:', response.data);

            if (response.data.success) {
                const doctorData = response.data.doctor;
                console.log('✅ Doctor data loaded:', doctorData);
                setDoctor(doctorData);

                // Populate form data with fetched doctor data
                setFormData({
                    name: doctorData.name || '',
                    phone: doctorData.phone || '',
                    specialization: doctorData.specialization || '',
                    qualification: doctorData.qualification || '',
                    experience: doctorData.experience?.toString() || '',
                    consultationFee: doctorData.consultationFee?.toString() || '',
                    location: doctorData.location || '',
                    about: doctorData.about || '',
                    profileImage: doctorData.profileImage || '',
                    dateOfBirth: doctorData.dateOfBirth ? doctorData.dateOfBirth.split('T')[0] : '',
                    gender: doctorData.gender || ''
                });

                console.log('✅ Form data populated');
            } else {
                console.error('❌ Failed to load profile:', response.data.message);
                toast.error('Failed to load profile');
            }
        } catch (error: any) {
            console.error('❌ Error fetching doctor profile:', error);

            if (error.response?.status === 401) {
                toast.error('Please login as a doctor');
                navigate('/login');
            } else if (error.response?.status === 404) {
                toast.error('Profile not found. Please complete your registration.');
            } else {
                toast.error('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
        toast.success('Edit mode enabled');
    };

    const handleCancel = () => {
        // Reset form data to original doctor data
        if (doctor) {
            setFormData({
                name: doctor.name || '',
                phone: doctor.phone || '',
                specialization: doctor.specialization || '',
                qualification: doctor.qualification || '',
                experience: doctor.experience?.toString() || '',
                consultationFee: doctor.consultationFee?.toString() || '',
                location: doctor.location || '',
                about: doctor.about || '',
                profileImage: doctor.profileImage || '',
                dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.split('T')[0] : '',
                gender: doctor.gender || ''
            });
        }
        setIsEditing(false);
        toast.success('Edit cancelled');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.specialization || !formData.qualification ||
            !formData.experience || !formData.consultationFee || !formData.location) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (parseInt(formData.experience) < 0 || parseInt(formData.consultationFee) < 0) {
            toast.error('Experience and consultation fee must be positive numbers');
            return;
        }

        try {
            setSaving(true);
            console.log('🔄 Updating doctor profile...');
            console.log('📤 Update data:', formData);

            const response = await api.put('/doctors/profile', formData);
            console.log('📥 Update response:', response.data);

            if (response.data.success) {
                setDoctor(response.data.doctor);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
                console.log('✅ Profile updated successfully');
            } else {
                toast.error(response.data.message || 'Failed to update profile');
            }
        } catch (error: any) {
            console.error('❌ Error updating profile:', error);

            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Invalid data provided');
            } else if (error.response?.status === 401) {
                toast.error('Please login to update profile');
                navigate('/login');
            } else {
                toast.error('Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't find your doctor profile. Please try refreshing or contact support.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={fetchDoctorProfile}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                        <Link
                            to="/doctor/dashboard"
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/doctor/dashboard"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isEditing ? 'Edit Profile' : 'My Profile'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditing
                                    ? 'Update your professional information'
                                    : 'Your professional information and practice details'
                                }
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="bg-white shadow-lg rounded-lg">
                    {!isEditing ? (
                        // View Mode
                        <div className="p-8">
                            {/* Profile Picture */}
                            <div className="text-center mb-8">
                                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mx-auto">
                                    <img
                                        src={
                                            doctor.profileImage ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=128`
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="mt-4 text-2xl font-bold text-gray-900">{doctor.name}</h2>
                                <p className="text-blue-600 font-medium text-lg">{doctor.specialization}</p>
                                <div className="mt-2 flex items-center justify-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {doctor.isVerified ? 'Verified Doctor' : 'Verification Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-gray-600">{doctor.email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-gray-600">{doctor.phone || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-gray-600">{doctor.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Date of Birth:</span>
                                                <span className="font-medium">
                                                    {doctor.dateOfBirth
                                                        ? new Date(doctor.dateOfBirth).toLocaleDateString()
                                                        : 'Not provided'
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Gender:</span>
                                                <span className="font-medium">{doctor.gender || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <Award className="h-5 w-5 text-gray-400 mr-3" />
                                                <span className="text-gray-600">{doctor.qualification}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Experience:</span>
                                                <span className="font-medium">{doctor.experience}+ years</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Consultation Fee:</span>
                                                <span className="font-medium">₹{doctor.consultationFee}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Rating:</span>
                                                <span className="font-medium">{doctor.rating} ({doctor.reviewCount} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Section - Only show if exists */}
                            {doctor.about && (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                                    <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Edit Mode - FORM
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Profile Picture Section */}
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mx-auto">
                                        <img
                                            src={formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Doctor')}&background=3b82f6&color=fff&size=128`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                                        onClick={() => {
                                            const url = prompt('Enter profile image URL:');
                                            if (url) {
                                                setFormData(prev => ({ ...prev, profileImage: url }));
                                            }
                                        }}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Click the camera icon to update your profile picture
                                </p>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline h-4 w-4 mr-2" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="inline h-4 w-4 mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                                            <Briefcase className="inline h-4 w-4 mr-2" />
                                            Specialization *
                                        </label>
                                        <select
                                            id="specialization"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select Specialization</option>
                                            {specializations.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                                            <Award className="inline h-4 w-4 mr-2" />
                                            Qualification *
                                        </label>
                                        <input
                                            type="text"
                                            id="qualification"
                                            name="qualification"
                                            value={formData.qualification}
                                            onChange={handleInputChange}
                                            placeholder="e.g., MBBS, MD, MS"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience (Years) *
                                        </label>
                                        <input
                                            type="number"
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="50"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="inline h-4 w-4 mr-2" />
                                            Consultation Fee (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            id="consultationFee"
                                            name="consultationFee"
                                            value={formData.consultationFee}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="inline h-4 w-4 mr-2" />
                                            Practice Location *
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="City or area where you practice"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <div>
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="inline h-4 w-4 mr-2" />
                                        About / Professional Bio
                                    </label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Describe your expertise, experience, and approach to patient care..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        This will be displayed on your doctor profile for patients to see.
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className={`px-6 py-2 rounded-lg transition-colors flex items-center ${saving
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
