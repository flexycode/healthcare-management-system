import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Receipt, LogOut } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }) =>
        `flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 ${isActive
            ? 'bg-slate-800 text-teal-400 border-l-4 border-teal-400'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`;

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 shadow-xl flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-teal-500 rounded-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-wide">HMS Portal</h1>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Welcome, {user?.name}</p>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <NavLink to="/dashboard" className={navLinkClasses}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/patients" className={navLinkClasses}>
                        <Users className="w-5 h-5 mr-3" />
                        Patients
                    </NavLink>
                    <NavLink to="/appointments" className={navLinkClasses}>
                        <Calendar className="w-5 h-5 mr-3" />
                        Appointments
                    </NavLink>
                    <NavLink to="/billing" className={navLinkClasses}>
                        <Receipt className="w-5 h-5 mr-3" />
                        Billing
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 text-rose-400 rounded-lg hover:bg-slate-800 transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;

