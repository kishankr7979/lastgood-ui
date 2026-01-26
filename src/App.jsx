import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Events from './pages/Events';
import Rewind from './pages/Rewind';
import EventDetail from './pages/EventDetail';
import Settings from './pages/Settings';
import Docs from './pages/Docs';
import Login from './pages/Login';


// Simple Auth Guard
const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/rewind" replace />} />
          <Route path="rewind" element={<Rewind />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="docs" element={<Docs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
