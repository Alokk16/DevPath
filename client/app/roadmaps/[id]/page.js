'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The 'params' prop is given by Next.js and contains the dynamic route parameters (e.g., { id: '...' })
export default function SingleRoadmapPage({ params }) {
    const [roadmap, setRoadmap] = useState(null);
    // ... (userProgress and error states are the same)
    const [userProgress, setUserProgress] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const roadmapId = params.id; // Get the roadmap ID from the URL!

        const fetchData = async () => {
            try {
                // Fetch the single roadmap using the new endpoint
                const roadmapResponse = await fetch(`http://localhost:5000/api/roadmaps/${roadmapId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // ... (the rest of the logic is very similar)
                const progressResponse = await fetch('http://localhost:5000/api/users/progress', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!roadmapResponse.ok) throw new Error('Failed to fetch roadmap');
                if (!progressResponse.ok) throw new Error('Failed to fetch progress');

                const roadmapData = await roadmapResponse.json();
                const progressData = await progressResponse.json();

                setRoadmap(roadmapData); // Set the single roadmap object
                setUserProgress(progressData.progress || []);

            } catch (err) {
                setError(err.message);
            }
        };

        if (roadmapId) {
            fetchData();
        }
    }, [params.id, router]); // Re-run the effect if the ID in the URL changes

    // ... (The handleStepClick and rendering logic is exactly the same as before!)
    const handleStepClick = async (stepId) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        if(userProgress.includes(stepId)) return;

        try {
            await fetch('http://localhost:5000/api/users/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({ stepId }),
            });
            // Optimistically update the UI
            setUserProgress(prevProgress => [...prevProgress, stepId]);
        } catch (err) {
            setError(err.message);
        }
    };

    const isStepCompleted = (stepId) => userProgress.includes(stepId);

    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!roadmap) return <div className="p-8 text-center">Loading Roadmap...</div>;

    return (
        <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            {/* ... The entire JSX for rendering the detailed roadmap is exactly the same ... */}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">{roadmap.title}</h1>
                <p className="text-gray-600 mb-8">{roadmap.description}</p>
                <div className="space-y-8">
                    {roadmap.topics.map((topic) => (
                        <div key={topic._id} className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">{topic.title}</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>...</thead>
                                    <tbody>
                                        {topic.tasks.map((task) => (
                                            <tr key={task.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">{task.title}</td>
                                                <td className="p-3 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="h-5 w-5 cursor-pointer"
                                                        checked={isStepCompleted(task.id)}
                                                        onChange={() => handleStepClick(task.id)}
                                                    />
                                                </td>
                                                {/* ... other cells ... */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}