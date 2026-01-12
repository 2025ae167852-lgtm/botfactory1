import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import FlowEditor from './pages/FlowEditor.js';
import MyBots from './pages/MyBots.js';
import Analytics from './pages/Analytics.js';
import Settings from './pages/Settings.js';
import Platforms from './pages/Platforms.js';
import Team from './pages/Team.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import { AuthProvider } from './context/AuthContext.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<FlowEditor />} />
          <Route path="/bots" element={<MyBots />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/platforms" element={<Platforms />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;