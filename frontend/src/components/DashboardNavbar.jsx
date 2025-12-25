import React from 'react';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardNavbar = ({ role, username, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="bg-[#661043] dark:bg-gray-900 text-white shadow-md px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand & Role */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-2">
                    {/* You could add a logo here if available, e.g. <img src="/Logo.png" className="w-8 h-8" /> */}
                    <h1 className="text-xl font-bold tracking-wide">DENTAL CLINIC</h1>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-1 rounded-full hover:bg-white/10 transition"
                    >
                        {theme === 'dark' ? <Sun size={18} className="text-yellow-300" /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            {/* Desktop Right Section */}
            <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto justify-end">

                <span className="hidden md:inline-block text-sm font-medium uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-pink-100">
                    {role} Dashboard
                </span>

                {/* User Info */}
                <div className="flex items-center gap-2 bg-[#550d38] dark:bg-gray-800 py-1 px-3 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <User size={14} className="text-pink-200" />
                    </div>
                    <span className="font-medium text-sm text-pink-50 max-w-[100px] truncate">{username || 'User'}</span>
                </div>

                {/* Desktop Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="hidden md:block p-2 rounded-full hover:bg-white/10 transition"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
                </button>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition shadow-sm"
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
