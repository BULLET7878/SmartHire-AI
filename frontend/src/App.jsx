import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CursorTrail from './components/CursorTrail';

function App() {
  return (
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>

      {/* Global cursor trail effect */}
      <CursorTrail />
    </Router>
  );
}

export default App;
