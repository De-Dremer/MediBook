import { api } from '../context/AuthContext';

export interface Appointment {
    id: number;
    doctorId: number;
    doctorName: string;
    doctorImage?: string;
    specialization: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
    type: string;
    consultationFee: number;
    location: string;
    notes?: string;
    symptoms?: string;
}

export interface BookingData {
    doctorId: number;
    date: string;
    time: string;
    appointmentType: string;
    symptoms?: string;
}

export const appointmentService = {
    // Get user's appointments
    async getMyAppointments() {
        try {
            const response = await api.get('/appointments/my-appointments');
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Book new appointment
    async bookAppointment(bookingData: BookingData) {
        try {
            const response = await api.post('/appointments/book', bookingData);
            return response.data;
        } catch (error) {
            console.error('Error booking appointment:', error);
            throw error;
        }
    },

    // Get available time slots for a doctor on a specific date
    async getAvailableSlots(doctorId: string, date: string) {
        try {
            const response = await api.get(`/appointments/available-slots/${doctorId}?date=${date}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available slots:', error);
            throw error;
        }
    },

    // Cancel appointment
    async cancelAppointment(appointmentId: number) {
        try {
            const response = await api.put(`/appointments/${appointmentId}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            throw error;
        }
    },

    // Reschedule appointment
    async rescheduleAppointment(appointmentId: number, newDate: string, newTime: string) {
        try {
            const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
                date: newDate,
                time: newTime
            });
            return response.data;
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            throw error;
        }
    }
};
