import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Receipt, LogOut } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-blue-600">HMS Portal</h1>
                    <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600">
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link to="/patients" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600">
                        <Users className="w-5 h-5 mr-3" />
                        Patients
                    </Link>
                    <Link to="/appointments" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600">
                        <Calendar className="w-5 h-5 mr-3" />
                        Appointments
                    </Link>
                    <Link to="/billing" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600">
                        <Receipt className="w-5 h-5 mr-3" />
                        Billing
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full p-2 text-red-600 rounded hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
