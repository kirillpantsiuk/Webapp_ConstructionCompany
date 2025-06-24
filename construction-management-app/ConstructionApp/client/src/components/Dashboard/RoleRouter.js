// client/src/components/Dashboard/RoleRouter.js
import React from 'react';
import BuilderDashboard from './roles/BuilderDashboard';
import ForemanDashboard from './roles/ForemanDashboard';
import ProjectManagerDashboard from './roles/ProjectManagerDashboard';
import ClientDashboard from './roles/ClientDashboard';
import DirectorDashboard from './roles/DirectorDashboard';
import AccountantDashboard from './roles/AccountantDashboard';

export default function RoleRouter({ role }) {
  switch (role) {
    case 'builder': return <BuilderDashboard />;
    case 'foreman': return <ForemanDashboard />;
    case 'project_manager': return <ProjectManagerDashboard />;
    case 'client': return <ClientDashboard />;
    case 'director': return <DirectorDashboard />;
    case 'accountant': return <AccountantDashboard />;
    default: return <p>Невідома роль</p>;
  }
}
