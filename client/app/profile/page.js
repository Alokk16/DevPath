'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            // In a real app, you would fetch user data from a '/api/users/me' endpoint
            // For now, we'll just show a generic message
            setUser({ username: 'Logged-in User' });
        }
    }, [router]);

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold">Welcome, {user.username}!</h1>
            <p className="mt-4">This is your profile page. More features to come!</p>
        </main>
    );
}