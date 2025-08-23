import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PatientProfile {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    emergencyContact: string;
    bloodGroup: string;
    allergies: string;
    medicalHistory: string;
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [profile, setProfile] = useState<PatientProfile>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        address: '123 Medical Street, Mumbai, Maharashtra 400001',
        emergencyContact: '+91 98765 43210',
        bloodGroup: 'A+',
        allergies: 'No known allergies',
        medicalHistory: 'No significant medical history'
    });

    const handleSave = async () => {
        setLoading(true);

        // Mock API call
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setEditing(false);
            setLoading(false);
        }, 1500);
    };

    const handleCancel = () => {
        setEditing(false);
        // Reset form to original values
        setProfile({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            dateOfBirth: '1990-01-15',
            gender: 'male',
            address: '123 Medical Street, Mumbai, Maharashtra 400001',
            emergencyContact: '+91 98765 43210',
            bloodGroup: 'A+',
            allergies: 'No known allergies',
            medicalHistory: 'No significant medical history'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-10 w-10 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                <p className="text-gray-600">Patient ID: #PAT001</p>
                                <p className="text-sm text-gray-500">Member since: January 2025</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="btn-primary flex items-center"
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCancel}
                                        className="btn-secondary flex items-center"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className={`btn-primary flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Full Name</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <User className="h-5 w-5 text-gray-400 mr-3" />
                                        <span>{profile.name}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Email Address</label>
                                {editing ? (
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                        <span>{profile.email}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Phone Number</label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                        <span>{profile.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Date of Birth</label>
                                {editing ? (
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={profile.dateOfBirth}
                                        onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                        <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Gender</label>
                                {editing ? (
                                    <select
                                        className="form-input"
                                        value={profile.gender}
                                        onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' | 'other' })}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <User className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="capitalize">{profile.gender}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Address</label>
                                {editing ? (
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                        <span>{profile.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Blood Group</label>
                                {editing ? (
                                    <select
                                        className="form-input"
                                        value={profile.bloodGroup}
                                        onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center p-3 bg-red-50 rounded-lg">
                                        <span className="text-red-600 font-semibold">{profile.bloodGroup}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Emergency Contact</label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={profile.emergencyContact}
                                        onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                        <span>{profile.emergencyContact}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Known Allergies</label>
                                {editing ? (
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        placeholder="List any allergies to medications, food, or other substances..."
                                        value={profile.allergies}
                                        onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                                    />
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span>{profile.allergies}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Medical History</label>
                                {editing ? (
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        placeholder="Describe any significant medical conditions, surgeries, or treatments..."
                                        value={profile.medicalHistory}
                                        onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                                    />
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span>{profile.medicalHistory}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Doctors Consulted</p>
                                <p className="text-2xl font-bold text-gray-900">5</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <User className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Health Score</p>
                                <p className="text-2xl font-bold text-gray-900">85%</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <User className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
