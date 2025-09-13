import React from 'react';

const PlansPage = () => {
  const plans = [
    { id: 1, name: "Fibernet 100Mbps", price: 799, quota: "500GB", speed: "100Mbps" },
    { id: 2, name: "Broadband 50Mbps", price: 499, quota: "300GB", speed: "50Mbps" },
    { id: 3, name: "Fibernet 200Mbps", price: 1299, quota: "1000GB", speed: "200Mbps" },
    { id: 4, name: "Broadband Basic 20Mbps", price: 299, quota: "150GB", speed: "20Mbps" }
  ];

  const handleSubscribe = (planId) => {
    console.log(`Subscribing to plan ${planId}`);
    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex-shrink-0">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-blue-600">Telecom</h1>
                
              </div>
            </div>
            
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#"
                  className="text-blue-600 font-medium px-3 py-2 rounded-md text-sm bg-blue-50"
                  aria-current="page"
                >
                  Plans
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  My Subscription
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Admin
                </a>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-blue-600 inline-flex items-center justify-center p-2 rounded-md"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Choose Your Plan
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {plan.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium text-gray-900">{plan.speed}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Data Quota:</span>
                      <span className="font-medium text-gray-900">{plan.quota}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-2xl font-bold text-blue-600">₹{plan.price}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © 2025 Subscription Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlansPage;
