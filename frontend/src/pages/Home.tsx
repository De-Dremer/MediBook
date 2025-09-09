 
import { Link } from 'react-router-dom';
import {
    Heart,
    Calendar,
    Users,
    Clock,
    Shield
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
            <section className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] text-white">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Your Health, <span className="text-[#FFD700]">Our Priority</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-[#E6E6FA]">
                            Connect with qualified doctors and book appointments instantly
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-[#FFD700] text-[#1A1A2E] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FFD700]/90 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/patient/find-doctors"
                                className="border-2 border-[#FFD700] text-[#FFD700] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FFD700] hover:text-[#1A1A2E] transition-colors"
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
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
                            Why Choose MediBook?
                        </h2>
                        <p className="text-xl text-[#1A1A2E]/80">
                            Experience healthcare like never before
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-[#F5F5F5] hover:border-[#FFD700]">
                                <div className="p-3 rounded-full bg-[#E6E6FA] mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                    <feature.icon className="h-8 w-8 text-[#1A1A2E]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1A1A2E] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[#1A1A2E]/80">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#F5F5F5]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
                            Trusted by Thousands
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-[#FFD700] mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-[#1A1A2E]/80">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#1A1A2E] text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Transform Your Healthcare Experience?
                    </h2>
                    <p className="text-xl text-[#E6E6FA] mb-8">
                        Join thousands of patients who trust MediBook for their healthcare needs
                    </p>
                    <Link
                        to="/register"
                        className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1A1A2E] px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
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
