import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './views/Dashboard/Dashboard';
import { AssetInventory } from './views/AssetInventory/AssetInventory';
import { AssetWizard } from './views/AssetInventory/AssetWizard';

import { MapView } from './views/MapView/MapView';
import { DependencyMap } from './views/DependencyMap/DependencyMap';
import { RiskAssessment } from './views/RiskAssessment/RiskAssessment';
import { About } from './views/About/About';
import './App.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'inventory',
        element: <AssetInventory />,
      },
      {
        path: 'inventory/new',
        element: <AssetWizard />,
      },

      {
        path: 'map',
        element: <MapView />,
      },
      {
        path: 'dependency',
        element: <DependencyMap />,
      },
      {
        path: 'risk',
        element: <RiskAssessment />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
