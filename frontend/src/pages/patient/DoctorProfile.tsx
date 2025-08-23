import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Users, Calendar, Award, BookOpen } from 'lucide-react';

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
    image: string;
    about: string;
    languages: string[];
    awards: string[];
    education: string[];
    availability: {
        [key: string]: string[];
    };
}

interface Review {
    id: number;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

const DoctorProfile: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'availability'>('about');

    useEffect(() => {
        // Mock API call
        setTimeout(() => {
            const mockDoctor: Doctor = {
                id: parseInt(doctorId || '1'),
                name: "Dr. Sarah Wilson",
                specialization: "Cardiology",
                qualification: "MBBS, MD Cardiology, FACC",
                experience: 12,
                rating: 4.8,
                reviewCount: 245,
                consultationFee: 1500,
                location: "Mumbai",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
                about: "Dr. Sarah Wilson is a highly experienced cardiologist with over 12 years of practice. She specializes in preventive cardiology, heart disease management, and interventional procedures. She has completed her fellowship from the American College of Cardiology and is known for her patient-centered approach to cardiac care.",
                languages: ["English", "Hindi", "Marathi"],
                awards: [
                    "Best Cardiologist Award 2023",
                    "Excellence in Patient Care 2022",
                    "Research Excellence Award 2021"
                ],
                education: [
                    "MBBS - King Edward Memorial Hospital, Mumbai",
                    "MD Cardiology - All India Institute of Medical Sciences, Delhi",
                    "Fellowship in Interventional Cardiology - Mayo Clinic, USA"
                ],
                availability: {
                    Monday: ["9:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"],
                    Tuesday: ["9:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"],
                    Wednesday: ["9:00 AM - 1:00 PM"],
                    Thursday: ["9:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"],
                    Friday: ["9:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"],
                    Saturday: ["9:00 AM - 2:00 PM"],
                    Sunday: ["Closed"]
                }
            };

            const mockReviews: Review[] = [
                {
                    id: 1,
                    patientName: "Rajesh Kumar",
                    rating: 5,
                    comment: "Excellent doctor! Very thorough examination and clear explanation of my heart condition. Highly recommended.",
                    date: "2025-08-15"
                },
                {
                    id: 2,
                    patientName: "Priya Sharma",
                    rating: 4,
                    comment: "Good experience overall. Doctor was professional and answered all my questions patiently.",
                    date: "2025-08-10"
                },
                {
                    id: 3,
                    patientName: "Amit Singh",
                    rating: 5,
                    comment: "Dr. Wilson helped me manage my cardiac condition effectively. Follow-up care was excellent.",
                    date: "2025-08-05"
                }
            ];

            setDoctor(mockDoctor);
            setReviews(mockReviews);
            setLoading(false);
        }, 1000);
    }, [doctorId]);

    if (loading || !doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Doctor Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-32 h-32 rounded-full mx-auto lg:mx-0"
                        />

                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                            <p className="text-xl text-blue-600 font-semibold mb-2">{doctor.specialization}</p>
                            <p className="text-gray-600 mb-4">{doctor.qualification}</p>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{doctor.experience}+ years exp.</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start">
                                    <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                                    <span>{doctor.rating} ({doctor.reviewCount} reviews)</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{doctor.location}</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start">
                                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>₹{doctor.consultationFee}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 w-full lg:w-auto">
                            <Link
                                to={`/patient/book-appointment/${doctor.id}`}
                                className="btn-primary text-center px-8 py-3"
                            >
                                Book Appointment
                            </Link>
                            <button className="btn-secondary px-8 py-3">
                                Message Doctor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-8">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'about'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                About
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Reviews ({doctor.reviewCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('availability')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'availability'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Availability
                            </button>
                        </nav>
                    </div>

                    <div className="p-8">
                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About Dr. {doctor.name.split(' ')[1]}</h3>
                                    <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        Education
                                    </h3>
                                    <ul className="space-y-2">
                                        {doctor.education.map((edu, index) => (
                                            <li key={index} className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                {edu}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Award className="h-5 w-5 mr-2" />
                                        Awards & Recognition
                                    </h3>
                                    <ul className="space-y-2">
                                        {doctor.awards.map((award, index) => (
                                            <li key={index} className="text-gray-700 flex items-start">
                                                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                {award}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.languages.map((lang, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Patient Reviews ({reviews.length})
                                    </h3>
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                                        <span className="font-semibold text-lg">{doctor.rating}</span>
                                        <span className="text-gray-500 ml-2">out of 5</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{review.patientName}</h4>
                                                    <div className="flex items-center mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating
                                                                        ? 'text-yellow-400 fill-current'
                                                                        : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability Tab */}
                        {activeTab === 'availability' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(doctor.availability).map(([day, times]) => (
                                        <div key={day} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">{day}</h4>
                                            {times[0] === 'Closed' ? (
                                                <span className="text-red-600 text-sm">Closed</span>
                                            ) : (
                                                <div className="space-y-1">
                                                    {times.map((time, index) => (
                                                        <div key={index} className="text-sm text-gray-700 flex items-center">
                                                            <Clock className="h-3 w-3 mr-2" />
                                                            {time}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <Link
                                        to={`/patient/book-appointment/${doctor.id}`}
                                        className="btn-primary px-8 py-3"
                                    >
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Book Appointment Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
