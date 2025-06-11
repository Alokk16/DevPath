'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [roadmap, setRoadmap] = useState(null);
    const [userProgress, setUserProgress] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [roadmapResponse, progressResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/roadmaps', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/users/progress', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!roadmapResponse.ok) throw new Error('Failed to fetch roadmap');
                if (!progressResponse.ok) throw new Error('Failed to fetch progress');

                const roadmapData = await roadmapResponse.json();
                const progressData = await progressResponse.json();

                if (roadmapData.length > 0) {
                    setRoadmap(roadmapData[0]);
                }
                setUserProgress(progressData.progress || []);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [router]);

    const handleStepClick = async (stepId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Check if the step is already completed to potentially un-complete it
        const isCompleted = userProgress.includes(stepId);
        // For now, we only handle completing a step, not un-completing.
        if(isCompleted) {
            console.log("Step already completed.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ stepId }),
            });

            if (!response.ok) throw new Error('Failed to update progress');
            const data = await response.json();
            setUserProgress(data.progress);

        } catch (err) {
            setError(err.message);
            console.error("Error updating progress:", err);
        }
    };

    const isStepCompleted = (stepId) => userProgress.includes(stepId);

    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!roadmap) return <div className="p-8 text-center">Loading Roadmap...</div>;

    return (
        <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">{roadmap.title}</h1>
                <p className="text-gray-600 mb-8">{roadmap.description}</p>

                <div className="space-y-8">
                    {/* OUTER LOOP: For each Topic (e.g., HTML, CSS) */}
                    {roadmap.topics.map((topic) => (
                        <div key={topic._id} className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">{topic.title}</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="p-3">Problem Link</th>
                                            <th className="p-3 text-center">Done</th>
                                            <th className="p-3 text-center">Discussion</th>
                                            <th className="p-3 text-center">Bookmark</th>
                                            <th className="p-3 text-center">Notes</th>
                                            <th className="p-3 text-center">Code</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* INNER LOOP: For each Task in the Topic */}
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
                                                <td className="p-3 text-center">
                                                    <a href={task.discussionLink} className="text-blue-500">🔗</a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button>⭐</button> {/* Bookmark functionality to be added later */}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={task.notesLink} className="text-blue-500">📝</a>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <a href={task.codeLink} className="text-blue-500">💻</a>
                                                </td>
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