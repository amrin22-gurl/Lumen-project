import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import Subscription from './pages/Subscription';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlans from './pages/AdminPlans';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-plans" element={<AdminPlans />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;