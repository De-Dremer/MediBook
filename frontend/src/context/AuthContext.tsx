import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; redirectPath: string }>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// ✅ Create axios instance with correct base URL
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Add request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('🔑 Token added to request:', config.url);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('🚨 401 Unauthorized - clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    console.log('✅ Auth state restored from localStorage');
                } catch (error) {
                    console.log('❌ Failed to parse stored user data');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('🔄 Attempting login...');
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;

                setToken(newToken);
                setUser(userData);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(userData));

                console.log('✅ Login successful');
                toast.success('Login successful!');

                // Determine redirect path
                let redirectPath = '/dashboard';
                if (userData.role === 'ADMIN') {
                    redirectPath = '/admin/dashboard';
                } else if (userData.role === 'DOCTOR') {
                    redirectPath = '/doctor/dashboard';
                } else if (userData.role === 'PATIENT') {
                    redirectPath = '/dashboard';
                }

                return { success: true, redirectPath };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('❌ Login error:', error);
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw new Error(message);
        }
    };

    const register = async (userData: any) => {
        try {
            console.log('🔄 Attempting registration...');
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                const { token: newToken, user: newUser } = response.data;

                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));

                console.log('✅ Registration successful');
                toast.success('Registration successful!');
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error('❌ Registration error:', error);
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('🚪 User logged out');
        toast.success('Logged out successfully');
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ✅ Export the configured API instance
export { api };
