import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Edit2, Trash2, Clock, User, Plus } from 'lucide-react';
import { API_URL } from '../config/api';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [formData, setFormData] = useState({
        patient: '',
        doctor: '',
        date: '',
        time: '',
        reason: '',
        status: 'Scheduled'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [appointmentsRes, patientsRes] = await Promise.all([
                axios.get(`${API_URL}/appointments`, { headers }),
                axios.get(`${API_URL}/patients`, { headers })
            ]);

            setAppointments(appointmentsRes.data);
            setPatients(patientsRes.data);

            // Get doctors from stored user info or use placeholder
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'doctor') {
                setDoctors([{ _id: user.id, name: user.name }]);
            } else {
                // For admin/staff, we'd need an API to get all doctors
                setDoctors([{ _id: user.id, name: user.name || 'Dr. Smith' }]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`);

        const payload = {
            patient: formData.patient,
            doctor: formData.doctor,
            date: dateTime.toISOString(),
            reason: formData.reason,
            status: formData.status
        };

        try {
            if (editingAppointment) {
                await axios.put(`${API_URL}/appointments/${editingAppointment._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/appointments`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchData();
            closeModal();
        } catch (err) {
            console.error('Error saving appointment:', err);
            alert('Error saving appointment: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this appointment?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error('Error deleting appointment:', err);
        }
    };

    const openEditModal = (appointment) => {
        const date = new Date(appointment.date);
        setEditingAppointment(appointment);
        setFormData({
            patient: appointment.patient?._id || appointment.patient,
            doctor: appointment.doctor?._id || appointment.doctor,
            date: date.toISOString().split('T')[0],
            time: date.toTimeString().slice(0, 5),
            reason: appointment.reason || '',
            status: appointment.status
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAppointment(null);
        setFormData({ patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Schedule Appointment
                </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        Loading appointments...
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No appointments yet. Click "Schedule Appointment" to create one.
                    </div>
                ) : (
                    appointments.map((appointment) => (
                        <motion.div
                            key={appointment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Calendar className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">
                                                {appointment.patient?.name || 'Unknown Patient'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDate(appointment.date)} at {formatTime(appointment.date)}</span>
                                        </div>
                                        {appointment.reason && (
                                            <p className="mt-1 text-sm text-gray-600">Reason: {appointment.reason}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                    <button
                                        onClick={() => openEditModal(appointment)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(appointment._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingAppointment ? 'Edit Appointment' : 'Schedule Appointment'}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                                    <select
                                        required
                                        value={formData.patient}
                                        onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                                    <select
                                        required
                                        value={formData.doctor}
                                        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map(d => (
                                            <option key={d._id} value={d._id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                    <input
                                        type="text"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="Reason for visit"
                                    />
                                </div>

                                {editingAppointment && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        {editingAppointment ? 'Update' : 'Schedule'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Appointments;
