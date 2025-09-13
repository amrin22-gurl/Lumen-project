import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createAccessToken } from '../services/api';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, getRoleBasedRoute } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    try {
      const response = await createAccessToken(email, password);
      const { access_token, user } = response.data;
      
      login(access_token, { ...user, role });
      navigate(getRoleBasedRoute(role));
    } catch (err) {
      setError('Invalid credentials');
    } finally {
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
      label: 'Role',
      required: true,
      defaultValue: 'user',
      options: [
        { value: 'user', label: 'End User' },
        { value: 'company', label: 'Company Admin' },
        { value: 'admin', label: 'System Admin' }
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