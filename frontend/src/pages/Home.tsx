import React from 'react';
import { Link } from 'react-router-dom';
import {
    Heart,
    Calendar,
    Users,
    Clock,
    Shield,
    Award
} from 'lucide-react';

const Home: React.FC = () => {
    const features = [
        {
            icon: Calendar,
            title: 'Easy Appointment Booking',
            description: 'Book appointments with your preferred doctors in just a few clicks.'
        },
        {
            icon: Users,
            title: 'Verified Doctors',
            description: 'All doctors are verified and approved by our medical board.'
        },
        {
            icon: Clock,
            title: '24/7 Support',
            description: 'Get medical support and emergency assistance anytime.'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your medical data is encrypted and completely secure.'
        }
    ];

    const stats = [
        { label: 'Registered Patients', value: '10,000+' },
        { label: 'Verified Doctors', value: '500+' },
        { label: 'Appointments Booked', value: '25,000+' },
        { label: 'Success Rate', value: '98%' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Your Health, <span className="text-blue-200">Our Priority</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Connect with qualified doctors and book appointments instantly
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/doctors"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Find Doctors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose MediBook?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Experience healthcare like never before
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="medical-icon">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Thousands
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Transform Your Healthcare Experience?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of patients who trust MediBook for their healthcare needs
                    </p>
                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
                    >
                        <Heart className="h-5 w-5" />
                        <span>Start Your Journey</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
