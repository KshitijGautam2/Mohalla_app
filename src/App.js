import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import CommunityFeed from './pages/CommunityFeed';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import MyCommunities from './pages/MyCommunities';

function App() {
  const isOnboarded = localStorage.getItem('mohalla_user');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={isOnboarded ? <Navigate to="/home" /> : <Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/community/:communityId" element={<CommunityFeed />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/communities" element={<MyCommunities />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;