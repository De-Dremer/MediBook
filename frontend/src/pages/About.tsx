import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Heart, 
    Shield, 
    Clock, 
    Users, 
    Award, 
    Phone, 
    Mail, 
    MapPin,
    CheckCircle,
    Calendar,
    UserCheck
} from 'lucide-react';

const About: React.FC = () => {
    const features = [
        {
            icon: <Calendar className="h-8 w-8 text-blue-600" />,
            title: "Easy Appointment Booking",
            description: "Book appointments with verified doctors in just a few clicks. Choose your preferred time and date."
        },
        {
            icon: <UserCheck className="h-8 w-8 text-green-600" />,
            title: "Verified Doctors",
            description: "All doctors are thoroughly verified with proper medical credentials and experience."
        },
        {
            icon: <Clock className="h-8 w-8 text-purple-600" />,
            title: "24/7 Availability",
            description: "Access the platform anytime, anywhere. Manage your appointments at your convenience."
        },
        {
            icon: <Shield className="h-8 w-8 text-red-600" />,
            title: "Secure & Private",
            description: "Your health information is protected with industry-standard security measures."
        },
        {
            icon: <Users className="h-8 w-8 text-indigo-600" />,
            title: "Patient-Doctor Connection",
            description: "Direct communication between patients and healthcare providers for better care."
        },
        {
            icon: <Award className="h-8 w-8 text-yellow-600" />,
            title: "Quality Healthcare",
            description: "Connect with experienced specialists across various medical fields."
        }
    ];

    const stats = [
        { number: "1000+", label: "Happy Patients" },
        { number: "50+", label: "Expert Doctors" },
        { number: "24/7", label: "Support Available" },
        { number: "99%", label: "Satisfaction Rate" }
    ];

    const team = [
        {
            name: "Dr. Sarah Wilson",
            role: "Chief Medical Officer",
            specialization: "Cardiology",
            experience: "15+ years"
        },
        {
            name: "Dr. Michael Chen",
            role: "Head of Technology",
            specialization: "Healthcare IT",
            experience: "12+ years"
        },
        {
            name: "Dr. Emily Rodriguez",
            role: "Patient Care Director",
            specialization: "General Medicine",
            experience: "18+ years"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About MediBook
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Revolutionizing healthcare by connecting patients with qualified doctors through 
                            a seamless, secure, and user-friendly appointment booking platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/patient/find-doctors"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Find Doctors
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Mission
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            To bridge the gap between patients and healthcare providers by creating an accessible, 
                            efficient, and trustworthy platform that makes quality healthcare available to everyone.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Why Choose MediBook?
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Verified Healthcare Professionals</h4>
                                        <p className="text-gray-600">All doctors undergo thorough verification of credentials and experience.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Secure & Confidential</h4>
                                        <p className="text-gray-600">Your health information is protected with state-of-the-art security.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">24/7 Accessibility</h4>
                                        <p className="text-gray-600">Book appointments anytime, anywhere with our mobile-friendly platform.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Patient-Centric Approach</h4>
                                        <p className="text-gray-600">Designed with patients in mind for the best user experience.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-blue-50 rounded-2xl p-8">
                                <Heart className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                                <h4 className="text-xl font-semibold text-gray-900 text-center mb-4">
                                    Healthcare Made Simple
                                </h4>
                                <p className="text-gray-600 text-center">
                                    We believe that quality healthcare should be accessible, convenient, and 
                                    stress-free. Our platform eliminates the traditional barriers to healthcare 
                                    access and puts you in control of your health journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Platform Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover what makes MediBook the preferred choice for patients and doctors alike.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            MediBook by the Numbers
                        </h2>
                        <p className="text-xl text-blue-100">
                            Trusted by thousands of patients and healthcare professionals
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Leadership Team
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Meet the experts behind MediBook's mission to revolutionize healthcare access.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <UserCheck className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                                <p className="text-gray-600 mb-2">{member.specialization}</p>
                                <p className="text-sm text-gray-500">{member.experience} experience</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Get in Touch
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Have questions or need support? We're here to help you.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
                            <p className="text-gray-600">+1 (555) 123-4567</p>
                            <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM</p>
                        </div>
                        
                        <div className="text-center">
                            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
                            <p className="text-gray-600">support@medibook.com</p>
                            <p className="text-sm text-gray-500">24/7 response</p>
                        </div>
                        
                        <div className="text-center">
                            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Location</h3>
                            <p className="text-gray-600">123 Healthcare Ave</p>
                            <p className="text-sm text-gray-500">Medical District, City</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of patients and doctors who trust MediBook for their healthcare needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
