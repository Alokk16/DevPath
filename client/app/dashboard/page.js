'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [roadmap, setRoadmap] = useState(null);
    const [userProgress, setUserProgress] = useState([]); // New state to hold user's progress
    const [error, setError] = useState('');
    const router = useRouter();

    // This useEffect will run once to fetch all the necessary data
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          router.push('/login');
          return;
      }
  
      const fetchData = async () => {
          try {
              // Use Promise.all to run requests in parallel for speed!
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
              setUserProgress(progressData.progress);
  
          } catch (err) {
              setError(err.message);
              console.error("Error fetching data:", err);
          }
      };
  
      fetchData();
  }, [router]);

    // This is the new function to handle clicking a step
    const handleStepClick = async (stepId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

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
            
            // This is "Optimistic UI Update". We update the state right away
            // to make the UI feel instant.
            setUserProgress(data.progress);

        } catch (err) {
            setError(err.message);
            console.error("Error updating progress:", err);
        }
    };

    // A helper function to check if a step is completed
    const isStepCompleted = (stepId) => {
        return userProgress.includes(stepId);
    };


    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    if (!roadmap) {
        return <div className="p-8">Loading your roadmap...</div>;
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">{roadmap.title}</h1>
            
            <div className="flex flex-col gap-4">
                {roadmap.steps.map((step) => (
                    // We make the whole div clickable now
                    <div 
                        key={step.id} 
                        className="p-4 border rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleStepClick(step.id)}
                    >
                        <span className="text-2xl">
                            {/* The checkmark now depends on our new userProgress state */}
                            {isStepCompleted(step.id) ? '✅' : '⬜️'}
                        </span>
                        <h2 className="text-xl">{step.title}</h2>
                    </div>
                ))}
            </div>
        </main>
    );
}