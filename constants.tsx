
import React from 'react';

export const INITIAL_COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Design System Update',
    description: 'Refresh the primary button states and shadow tokens.',
    priority: 'High' as const,
    columnId: 'todo',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Connect the frontend task service to the Node.js backend.',
    priority: 'Medium' as const,
    columnId: 'in-progress',
    createdAt: Date.now() - 100000,
  },
];

export const PRIORITY_COLORS = {
  Low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  High: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};
