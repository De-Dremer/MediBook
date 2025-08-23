import { api } from '../context/AuthContext';

export interface Doctor {
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
    languages?: string[];
    awards?: string[];
    education?: string[];
    availability?: {
        [key: string]: string[];
    };
}

export const doctorService = {
    // Get all doctors with filters
    async getDoctors(filters?: {
        specialization?: string;
        location?: string;
        search?: string;
    }) {
        try {
            const params = new URLSearchParams();
            if (filters?.specialization) params.append('specialization', filters.specialization);
            if (filters?.location) params.append('location', filters.location);
            if (filters?.search) params.append('search', filters.search);

            const response = await api.get(`/doctors?${params}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    },

    // Get single doctor by ID
    async getDoctorById(id: string) {
        try {
            const response = await api.get(`/doctors/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            throw error;
        }
    },

    // Get doctor specializations
    async getSpecializations() {
        try {
            const response = await api.get('/doctors/specializations');
            return response.data;
        } catch (error) {
            console.error('Error fetching specializations:', error);
            throw error;
        }
    }
};
