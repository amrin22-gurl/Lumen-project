import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Manage Subscriptions
              <span className="block text-blue-200">Effortlessly</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your subscription business with our comprehensive management platform.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage subscriptions
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Plan Management',
                  description: 'Create and manage subscription plans with flexible pricing options.'
                },
                {
                  title: 'User Analytics',
                  description: 'Track user engagement and subscription metrics in real-time.'
                },
                {
                  title: 'Automated Billing',
                  description: 'Handle renewals, upgrades, and cancellations automatically.'
                }
              ].map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="text-lg leading-6 font-medium text-gray-900">{feature.title}</div>
                  <div className="mt-2 text-base text-gray-500">{feature.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;