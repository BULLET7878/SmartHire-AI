import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CursorTrail from './components/CursorTrail';
import Footer from './components/Footer';

import SelectRole from './pages/SelectRole';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.error("❌ CRITICAL: VITE_GOOGLE_CLIENT_ID is missing! Add it to your Vercel Environment Variables.");
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || 'loading-missing-id'}>
      <Router>
        <div className="min-h-screen font-sans relative flex flex-col">
          {/* Fixed Background Layer */}
          <div
            className="fixed inset-0 z-[-1]"
            style={{
              backgroundImage: "url('/bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              pointerEvents: 'none'
            }}
          />

          <Navbar />
          {/* Content wrapper with top padding to prevent hiding under sticky navbar */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/select-role" element={<SelectRole />} />
            </Routes>
          </div>
          <Footer />
        </div>

        {/* Global cursor trail effect */}
        <CursorTrail />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
