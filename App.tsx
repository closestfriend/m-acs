
import React from 'react';
import SimulationDashboard from './components/SimulationDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 font-sans">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">
            Multi-Agent Access Control Simulation
          </h1>
          <p className="text-sm text-gray-400">Powered by Gemini</p>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <SimulationDashboard />
      </main>
      <footer className="text-center py-4 text-gray-600 text-xs">
        <p>&copy; 2024. A simulation demonstrating secure system architecture principles.</p>
      </footer>
    </div>
  );
}

export default App;
