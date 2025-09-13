import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');

      console.log('Registration attempt:', { name, email });

      // Basic validation
      if (!name || !email || !password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (name.length < 2) {
        setError('Name must be at least 2 characters');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Simulate API delay
      setTimeout(() => {
        setSuccess('Registration successful! Redirecting to login...');
        setLoading(false);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Full name',
      required: true,
      label: 'Name'
    },
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
    }
  ];

  return (
    <div>
      <AuthForm
        title="Create your account"
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Sign up"
        loading={loading}
      />
      {error && (
        <div className="text-center mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="text-center mt-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:text-blue-500">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;