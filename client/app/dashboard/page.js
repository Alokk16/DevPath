// This is our "fake" database for now.
// It's just a JavaScript object.
const fakeRoadmap = {
    title: "Full Stack Developer Roadmap",
    steps: [
      { id: 1, title: "Learn HTML & CSS", completed: true },
      { id: 2, title: "JavaScript Basics", completed: true },
      { id: 3, title: "Learn a Frontend Framework (React)", completed: false },
      { id: 4, title: "Learn a Backend (Node.js & Express)", completed: false },
      { id: 5, title: "Learn a Database (MongoDB)", completed: false },
    ],
  };
  
  export default function DashboardPage() {
    return (
      <main className="p-8">
        {/* We use curly braces {} to display our JavaScript data */}
        <h1 className="text-3xl font-bold mb-6">{fakeRoadmap.title}</h1>
  
        <div className="flex flex-col gap-4">
          {/* This is the most important part!
            We use the .map() function to loop over our array of steps.
            For each 'step' in the array, we return a block of HTML (JSX).
            React requires a unique 'key' for each item in a list, so we use step.id.
          */}
          {fakeRoadmap.steps.map((step) => (
            <div key={step.id} className="p-4 border rounded-lg flex items-center gap-4">
              {/* This is a ternary operator, a simple if/else.
                If step.completed is true, show ✅, otherwise show ⬜️.
              */}
              <span className="text-2xl">{step.completed ? '✅' : '⬜️'}</span>
              <h2 className="text-xl">{step.title}</h2>
            </div>
          ))}
        </div>
      </main>
    );
  }