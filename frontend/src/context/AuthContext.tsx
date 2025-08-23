import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'patient' | 'doctor' | 'admin';
    isVerified: boolean;
    profileImage?: string;
    dateOfBirth?: string;
    gender?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; redirectPath: string }>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'patient' | 'doctor';
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Real API configuration - Connected to your backend
const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));

                    // ✅ Verify token with your backend
                    await api.get('/auth/profile');
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // ✅ Real login function - calls your backend
    const login = async (email: string, password: string): Promise<{ success: boolean; redirectPath: string }> => {
        try {
            console.log('🔄 Calling backend login API...');
            const response = await api.post('/auth/login', { email, password });

            console.log('✅ Backend response:', response.data);

            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                setToken(newToken);
                setUser(userData);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(userData));

                // Role-based redirect logic
                let redirectPath = '/dashboard';
                if (userData.role === 'admin') {
                    redirectPath = '/admin/dashboard';
                } else if (userData.role === 'doctor') {
                    redirectPath = '/doctor/dashboard';
                } else if (userData.role === 'patient') {
                    redirectPath = '/dashboard';
                }

                return { success: true, redirectPath };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('❌ Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    // ✅ Real register function - calls your backend
    const register = async (userData: RegisterData) => {
        try {
            console.log('🔄 Calling backend register API...');
            const response = await api.post('/auth/register', userData);

            console.log('✅ Registration response:', response.data);

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;
                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error('❌ Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ✅ Export the API instance for use in other components
export { api };
