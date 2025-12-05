import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Users, Calendar, Receipt, Activity,
    UserPlus, CalendarPlus, FileText,
    TrendingUp, Clock, CheckCircle,
    ArrowRight
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        pendingInvoices: 0,
        completedAppointments: 0
    });
    const [recentPatients, setRecentPatients] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [patientsRes, appointmentsRes, billingRes] = await Promise.all([
                axios.get(`${API_URL}/patients`, { headers }),
                axios.get(`${API_URL}/appointments`, { headers }),
                axios.get(`${API_URL}/billing`, { headers })
            ]);

            const patients = patientsRes.data;
            const appointments = appointmentsRes.data;
            const invoices = billingRes.data;

            // Calculate stats
            const today = new Date().toDateString();
            const todayAppointments = appointments.filter(a =>
                new Date(a.date).toDateString() === today
            );
            const pendingInvoices = invoices.filter(i => i.status === 'Pending');
            const completedAppointments = appointments.filter(a => a.status === 'Completed');

            setStats({
                totalPatients: patients.length,
                todayAppointments: todayAppointments.length,
                pendingInvoices: pendingInvoices.length,
                completedAppointments: completedAppointments.length
            });

            // Get recent patients (last 5)
            setRecentPatients(patients.slice(-5).reverse());

            // Get upcoming appointments
            const upcoming = appointments
                .filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled')
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5);
            setUpcomingAppointments(upcoming);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'blue', link: '/patients' },
        { label: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'purple', link: '/appointments' },
        { label: 'Pending Invoices', value: stats.pendingInvoices, icon: Receipt, color: 'yellow', link: '/billing' },
        { label: 'Completed Visits', value: stats.completedAppointments, icon: CheckCircle, color: 'green', link: '/appointments' }
    ];

    const quickActions = [
        { label: 'Add Patient', icon: UserPlus, link: '/patients', color: 'blue' },
        { label: 'Schedule Appointment', icon: CalendarPlus, link: '/appointments', color: 'purple' },
        { label: 'Create Invoice', icon: FileText, link: '/billing', color: 'green' }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            green: 'bg-green-100 text-green-600'
        };
        return colors[color] || colors.blue;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            Welcome back, {user?.name || 'User'}! 👋
                        </h1>
                        <p className="text-blue-100">
                            Here's what's happening with your healthcare system today.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                        <Activity className="w-5 h-5" />
                        <span className="font-medium capitalize">{user?.role || 'Admin'}</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={stat.link}
                                className="block bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {loading ? '...' : stat.value}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow p-6"
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.label}
                                to={action.link}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-colors group`}
                            >
                                <div className={`p-2 rounded-lg ${getColorClasses(action.color)}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    {action.label}
                                </span>
                                <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" />
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
                        <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-700">
                            View all →
                        </Link>
                    </div>
                    {loading ? (
                        <p className="text-gray-500 text-center py-4">Loading...</p>
                    ) : upcomingAppointments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingAppointments.map((apt) => (
                                <div
                                    key={apt._id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Clock className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {apt.patient?.name || 'Unknown Patient'}
                                        </p>
                                        <p className="text-sm text-gray-500">{formatDate(apt.date)}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Patients */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Patients</h2>
                        <Link to="/patients" className="text-sm text-blue-600 hover:text-blue-700">
                            View all →
                        </Link>
                    </div>
                    {loading ? (
                        <p className="text-gray-500 text-center py-4">Loading...</p>
                    ) : recentPatients.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No patients yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentPatients.map((patient) => (
                                <div
                                    key={patient._id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">
                                            {patient.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{patient.name}</p>
                                        <p className="text-sm text-gray-500">{patient.contact}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{patient.age} yrs</span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
