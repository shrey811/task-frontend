import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskList from './features/tasks/components/pages/TaskList';
import TaskDetail from './features/tasks/components/pages/TaskDetail';
import ErrorBoundary from './features/tasks/components/ui/ErrorBoundary';

const App: React.FC = () => (
  <ErrorBoundary>
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/task/:id" element={<TaskDetail />} />
    </Routes>
  </ErrorBoundary>
);

export default App;