'use client'; // This is a new, important line!

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  // 1. Create a state variable to hold our roadmap data
  const [roadmap, setRoadmap] = useState(null);

  // 2. useEffect hook to fetch data when the component loads
  useEffect(() => {
    const fetchRoadmap = async () => {
      // 1. Get the token from Local Storage
      const token = localStorage.getItem('token');

      // If there's no token, don't even try to fetch
      if (!token) {
        // Optional: Redirect to login page or show a message
        console.log("No token found, user needs to login.");
        return;
      }

      try {
        // 2. Make the fetch request, but now include the Authorization header
        const response = await fetch('http://localhost:5000/api/roadmaps', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <-- THE MAGIC LINE!
          },
        });

        if (!response.ok) {
            // If the server responds with an error (like token expired)
            throw new Error('Failed to fetch roadmap data');
        }

        const data = await response.json();
        if (data.length > 0) {
          setRoadmap(data[0]);
        }
      } catch (error) {
        console.error(error.message);
        // Optional: Handle error, e.g., redirect to login
      }
    };

    fetchRoadmap();
  }, []);
  // 3. Conditional rendering while data is loading
  if (!roadmap) {
    return <div>Loading your roadmap...</div>;
  }

  // 4. Render the data once it's loaded
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">{roadmap.title}</h1>

      <div className="flex flex-col gap-4">
        {roadmap.steps.map((step) => (
          <div key={step.id} className="p-4 border rounded-lg flex items-center gap-4">
            <span className="text-2xl">{step.completed ? '✅' : '⬜️'}</span>
            <h2 className="text-xl">{step.title}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}