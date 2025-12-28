
import React from 'react';

const PortfolioCopy: React.FC = () => {
  return (
    <section className="p-8 border-t border-zinc-800 bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-zinc-400 text-sm font-mono uppercase tracking-widest mb-2">Project Showcase</h2>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-4">
            TaskFlow Pro: High-Performance Kanban Orchestration
          </h3>
          <p className="text-lg text-zinc-400 leading-relaxed">
            A full-stack productivity engine designed for seamless task orchestration and real-time state synchronization. 
            This platform replicates core Trello/Asana workflows with an emphasis on low-latency interactions, 
            intuitive drag-and-drop management, and AI-assisted task breakdown.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Technical Contributions
            </h4>
            <ul className="text-zinc-400 space-y-2 list-disc pl-5 text-sm">
              <li>Architected a robust dynamic state management system for fluid UI transitions.</li>
              <li>Implemented complex drag-and-drop logic using native browser APIs for high performance.</li>
              <li>Integrated Gemini AI to provide context-aware sub-task generation.</li>
              <li>Optimized React rendering cycles to ensure 60fps interaction during heavy dragging.</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Security & Reliability
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <strong>Security Consideration:</strong> Engineered with secure session handling and data validation. 
              All task updates are sanitized to prevent XSS, while the backend implementation (simulated here) 
              follows industry-standard JWT authentication and role-based access controls to safeguard proprietary project data.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PortfolioCopy;
