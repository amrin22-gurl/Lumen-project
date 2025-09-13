import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../services/api';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: 'user'
    };

    try {
      await createUser(userData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
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
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:text-blue-500">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;