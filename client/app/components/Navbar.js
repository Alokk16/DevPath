'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for token on component mount
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            Pathly {/* Or your chosen project name */}
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/roadmaps" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                                Roadmaps
                            </Link>
                            {/* Add other links like "Mentorship" or "Resources" here later */}
                        </div>
                    </div>
                    <div className="ml-4 md:ml-6">
                        {isLoggedIn ? (
                            // Show Profile and Logout if logged in
                            <div className="flex items-center">
                                <Link href="/profile" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="ml-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            // Show Login and Register if not logged in
                            <div className="flex items-center">
                                <Link href="/login" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/register" className="ml-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}