import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, X, Edit } from 'lucide-react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientPhone?: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
    appointmentType: string;
    symptoms?: string;
    notes?: string;
    consultationFee: number;
}

const DoctorAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>('');
    const [completingAppointment, setCompletingAppointment] = useState<string | null>(null);
    const [savingNotes, setSavingNotes] = useState<string | null>(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching doctor appointments...');

            const response = await api.get('/doctors/appointments');

            if (response.data.success) {
                setAppointments(response.data.appointments || []);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error('❌ Error fetching appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteAppointment = async (appointmentId: string) => {
        try {
            setCompletingAppointment(appointmentId);
            console.log('🔄 Completing appointment:', appointmentId);
            const response = await api.put(`/doctors/appointments/${appointmentId}/complete`);

            if (response.data.success) {
                toast.success('Appointment marked as completed');
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === appointmentId
                            ? { ...apt, status: 'completed' as const }
                            : apt
                    )
                );
            } else {
                toast.error(response.data.message || 'Failed to complete appointment');
            }
        } catch (error: any) {
            console.error('❌ Error completing appointment:', error);
            const message = error.response?.data?.message || 'Failed to complete appointment';
            toast.error(message);
        } finally {
            setCompletingAppointment(null);
        }
    };

    const handleAddNotes = async () => {
        if (!selectedAppointment || !notes.trim()) return;

        try {
            setSavingNotes(selectedAppointment.id);
            console.log('🔄 Adding notes to appointment:', selectedAppointment.id);
            const response = await api.put(`/doctors/appointments/${selectedAppointment.id}/notes`, {
                notes: notes.trim()
            });

            if (response.data.success) {
                toast.success('Notes added successfully');
                setAppointments(prev =>
                    prev.map(apt =>
                        apt.id === selectedAppointment.id
                            ? { ...apt, notes: notes.trim() }
                            : apt
                    )
                );
                setShowNotesModal(false);
                setNotes('');
                setSelectedAppointment(null);
            } else {
                toast.error(response.data.message || 'Failed to add notes');
            }
        } catch (error: any) {
            console.error('❌ Error adding notes:', error);
            const message = error.response?.data?.message || 'Failed to add notes';
            toast.error(message);
        } finally {
            setSavingNotes(null);
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const today = new Date().toISOString().split('T')[0];

        switch (activeTab) {
            case 'today':
                return appointment.date === today;
            case 'upcoming':
                return appointment.status === 'upcoming';
            case 'completed':
                return appointment.status === 'completed';
            case 'all':
                return true;
            default:
                return true;
        }
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'badge-confirmed';
            case 'completed':
                return 'badge-completed';
            case 'cancelled':
                return 'badge-cancelled';
            default:
                return 'badge-pending';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">
                        Manage your patient appointments and consultations
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'today'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Today ({appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length})
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'upcoming'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Upcoming ({appointments.filter(a => a.status === 'upcoming').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Completed ({appointments.filter(a => a.status === 'completed').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'all'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All ({appointments.length})
                        </button>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-6">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* Patient Avatar */}
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <User className="h-8 w-8 text-blue-600" />
                                    </div>

                                    {/* Appointment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {appointment.patientName}
                                                </h3>
                                                <p className="text-blue-600 font-medium capitalize">{appointment.appointmentType}</p>
                                                {appointment.patientPhone && (
                                                    <p className="text-sm text-gray-600">{appointment.patientPhone}</p>
                                                )}
                                            </div>
                                            <span className={`${getStatusBadge(appointment.status)} capitalize`}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(appointment.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {appointment.time}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">₹{appointment.consultationFee}</span>
                                            </div>
                                        </div>

                                        {/* Symptoms */}
                                        {appointment.symptoms && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Patient Concerns:</p>
                                                <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {appointment.notes && (
                                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                                <p className="text-sm font-medium text-green-700 mb-1">Doctor's Notes:</p>
                                                <p className="text-sm text-green-700">{appointment.notes}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-3">
                                                {appointment.status === 'upcoming' && (
                                                    <>
                                                        <button
                                                            className="btn-success flex items-center"
                                                            onClick={() => handleCompleteAppointment(appointment.id)}
                                                            disabled={completingAppointment === appointment.id}
                                                        >
                                                            {completingAppointment === appointment.id ? (
                                                                <>
                                                                    <div className="loading-spinner h-4 w-4 mr-2"></div>
                                                                    Completing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Mark Complete
                                                                </>
                                                            )}
                                                        </button>
                                                        <button className="btn-secondary flex items-center">
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Call Patient
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="btn-primary flex items-center"
                                                    onClick={() => {
                                                        setSelectedAppointment(appointment);
                                                        setNotes(appointment.notes || '');
                                                        setShowNotesModal(true);
                                                    }}
                                                    disabled={savingNotes === appointment.id}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-600">
                            {activeTab === 'today'
                                ? "You don't have any appointments scheduled for today"
                                : `No ${activeTab} appointments found`
                            }
                        </p>
                    </div>
                )}

                {/* Notes Modal */}
                {showNotesModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {selectedAppointment?.notes ? 'Edit Notes' : 'Add Notes'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Patient: <strong>{selectedAppointment?.patientName}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowNotesModal(false);
                                        setSelectedAppointment(null);
                                        setNotes('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="form-label">
                                    Consultation Notes
                                </label>
                                <textarea
                                    className="form-input resize-none"
                                    rows={6}
                                    placeholder="Add your consultation notes, diagnosis, treatment plan, prescriptions, or any other relevant information..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    These notes will be saved with the appointment and can be viewed later.
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowNotesModal(false);
                                        setSelectedAppointment(null);
                                        setNotes('');
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNotes}
                                    className="btn-primary flex-1"
                                    disabled={!notes.trim()}
                                >
                                    {selectedAppointment?.notes ? 'Update Notes' : 'Save Notes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;
