import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser, createCompany } from '../services/api';
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
      role: formData.get('role')
    };

    try {
      const userResponse = await createUser(userData);
      
      // If company role, create company
      if (userData.role === 'company') {
        const companyData = {
          name: formData.get('companyName'),
          owner_id: userResponse.data.id
        };
        await createCompany(companyData);
      }

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
    },
    {
      name: 'role',
      type: 'select',
      label: 'Account Type',
      required: true,
      defaultValue: 'user',
      options: [
        { value: 'user', label: 'End User' },
        { value: 'company', label: 'Company Admin' }
      ]
    },
    {
      name: 'companyName',
      type: 'text',
      placeholder: 'Company name (for company accounts)',
      required: false,
      label: 'Company Name'
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