import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

console.log('App.tsx: Module loading started');

import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './views/Dashboard/Dashboard';
import { AssetInventory } from './views/AssetInventory/AssetInventory';
import { AssetWizard } from './views/AssetInventory/AssetWizard';

import { MapView } from './views/MapView/MapView';
import { DependencyMap } from './views/DependencyMap/DependencyMap';
import { RiskAssessment } from './views/RiskAssessment/RiskAssessment';
import { RiskHub } from './views/RiskAssessment/RiskHub';
import { About } from './views/About/About';
import { Settings } from './views/Settings/Settings';

console.log('App.tsx: Imports completed (RiskAssessment ENABLED)');

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
          element: <RiskHub />,
      },
      {
        path: 'risk/:assetId',
        element: <RiskAssessment />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

// Basic Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500">
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  console.log('App.tsx: App component rendering');
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
