import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Find Doctors', href: '/patient/find-doctors' },
        { name: 'About', href: '/about' },
    ];

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <Heart className="h-8 w-8 text-blue-600" />
                                <span className="text-2xl font-bold text-gray-900">MediBook</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:block">
                            <div className="flex items-center space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.href
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium">{user.name?.split(' ')[0]}</span>
                                        </button>

                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                                <div className="py-1">
                                                    <Link
                                                        to="/dashboard"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 mr-2" />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/patient/profile"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 mr-2" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/patient/appointments"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 mr-2" />
                                                        My Appointments
                                                    </Link>
                                                    <hr className="my-1" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                                    >
                                                        <LogOut className="h-4 w-4 mr-2" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {user ? (
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex items-center px-3 py-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/patient/profile"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:text-red-600 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-3 py-2 rounded-md text-base font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 text-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Heart className="h-6 w-6 text-blue-400" />
                            <span className="text-xl font-bold">MediBook</span>
                        </div>
                        <p className="text-gray-400">
                            © 2025 MediBook. All rights reserved. Your health, our priority.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
