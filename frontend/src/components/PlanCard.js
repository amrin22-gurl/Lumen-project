import React from 'react';

const PlanCard = ({ plan, onSelect, isSelected }) => {
  return (
    <div className={`border rounded-lg p-6 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
      <p className="text-gray-600 mt-2">{plan.description}</p>
      <div className="mt-4">
        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-gray-600">/{plan.billing_cycle}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan)}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Select Plan
      </button>
    </div>
  );
};

export default PlanCard;