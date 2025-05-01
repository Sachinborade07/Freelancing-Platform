import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './app/login/login';
import Register from './app/register/register';
import DashboardPage from './app/dashboard/home';
import FreelancerProfilePage from './app/dashboard/profile/Profile';
import ProjectDetailsPage from './app/dashboard/Project/Project';
import NewProjectPage from './app/dashboard/Project/NewProject';
import FreelancerBidsPage from './app/dashboard/bids/bids';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<FreelancerProfilePage />} />
          <Route path="projects" element={<ProjectDetailsPage />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="bids" element={<FreelancerBidsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
