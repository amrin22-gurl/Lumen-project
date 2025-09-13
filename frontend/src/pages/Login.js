import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

// Mock credentials
const MOCK_USERS = {
  'admin@telecom.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
  'user@telecom.com': { password: 'user123', role: 'customer', name: 'Customer User' }
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, getRoleBasedRoute } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      const selectedRole = formData.get('role');

      console.log('Login attempt:', { email, selectedRole });

      // Validate inputs
      if (!email || !password || !selectedRole) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Mock authentication
      const mockUser = MOCK_USERS[email];
      if (!mockUser) {
        setError('User not found');
        setLoading(false);
        return;
      }

      if (mockUser.password !== password) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      if (mockUser.role !== selectedRole) {
        setError(`This account is registered as ${mockUser.role}, not ${selectedRole}`);
        setLoading(false);
        return;
      }

      // Simulate API delay
      setTimeout(() => {
        const mockToken = 'mock_token_' + Date.now();
        const userData = {
          id: email,
          email: email,
          name: mockUser.name,
          role: mockUser.role
        };
        
        console.log('Login successful:', userData);
        login(mockToken, userData);
        
        const route = getRoleBasedRoute(mockUser.role);
        console.log('Navigating to:', route);
        navigate(route);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email address',
      required: true,
      label: 'Email'
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      required: true,
      label: 'Password'
    },
    {
      name: 'role',
      type: 'select',
      label: 'Login As',
      required: true,
      defaultValue: 'customer',
      options: [
        { value: 'customer', label: 'Customer' },
        { value: 'admin', label: 'Admin' }
      ]
    }
  ];

  return (
    <div>
      <AuthForm
        title="Sign in to your account"
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Sign in"
        loading={loading}
      />
      {error && (
        <div className="text-center mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      <div className="text-center mt-4">
        <Link to="/register" className="text-blue-600 hover:text-blue-500">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;