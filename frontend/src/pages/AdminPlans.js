import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminPlans, createAdminPlan, updateAdminPlan, deleteAdminPlan } from '../services/api';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_description: '',
    price: '',
    duration_months: '',
    features: '',
    is_active: 1
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getAdminPlans();
      setPlans(response.data.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Fallback mock data
      setPlans([
        {
          plan_id: 1,
          plan_name: 'Basic Plan',
          plan_description: 'Entry-level internet plan',
          price: 29.99,
          duration_months: 1,
          features: '24/7 Support, Free Installation',
          is_active: 1
        },
        {
          plan_id: 2,
          plan_name: 'Premium Plan',
          plan_description: 'High-speed internet with unlimited data',
          price: 59.99,
          duration_months: 1,
          features: '24/7 Support, Free Installation, Router Included',
          is_active: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await updateAdminPlan(editingPlan.plan_id, formData);
      } else {
        await createAdminPlan(formData);
      }
      fetchPlans();
      resetForm();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan. Please try again.');
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await deleteAdminPlan(planId);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Error deleting plan. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      plan_description: '',
      price: '',
      duration_months: '',
      features: '',
      is_active: 1
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  const openEditForm = (plan) => {
    setFormData({
      plan_name: plan.plan_name,
      plan_description: plan.plan_description,
      price: plan.price,
      duration_months: plan.duration_months,
      features: plan.features,
      is_active: plan.is_active
    });
    setEditingPlan(plan);
    setShowForm(true);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading plans...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Plan Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Plan
        </button>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan.plan_id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{plan.plan_name}</td>
                <td className="px-6 py-4">{plan.plan_description}</td>
                <td className="px-6 py-4 whitespace-nowrap">${plan.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plan.duration_months} months</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs ${
                    plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openEditForm(plan)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.plan_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingPlan ? 'Edit Plan' : 'Add New Plan'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  value={formData.plan_name}
                  onChange={(e) => setFormData({...formData, plan_name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.plan_description}
                  onChange={(e) => setFormData({...formData, plan_description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Duration (months)</label>
                <input
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({...formData, duration_months: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Features</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                  placeholder="Comma-separated features"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;