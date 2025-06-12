'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoadmapsPage() {
    const [roadmaps, setRoadmaps] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // <-- NEW: State for the search input
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchAllRoadmaps = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/roadmaps', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch roadmaps');

                const data = await response.json();
                setRoadmaps(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAllRoadmaps();
    }, [router]);

    const handleRoadmapClick = (roadmapId) => {
        router.push(`/roadmaps/${roadmapId}`);
    };

    // --- NEW: Filtering Logic ---
    // We create a new list of roadmaps based on the search query before rendering
    const filteredRoadmaps = roadmaps.filter(roadmap =>
        roadmap.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Discover Roadmaps</h1>

                {/* --- NEW: Search Bar UI --- */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search your relevant roadmap by entering your query..."
                        className="w-full p-4 border rounded-lg shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* --- Conditional Rendering --- */}
                {roadmaps.length > 0 && filteredRoadmaps.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <p>No roadmaps found for your query.</p>
                    </div>
                ) : roadmaps.length === 0 && !error ? (
                    <div className="text-center text-gray-500">Loading roadmaps...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* We now map over the NEW filteredRoadmaps list */}
                        {filteredRoadmaps.map((roadmap) => (
                            <div 
                                key={roadmap._id}
                                className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleRoadmapClick(roadmap._id)}
                            >
                                <h2 className="text-2xl font-semibold mb-2">{roadmap.title}</h2>
                                <p className="text-gray-600 mb-4">{roadmap.description}</p>
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    {roadmap.complexity}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}