# Telecom Subscription Management System - Documentation

## Overview
A comprehensive React-based frontend application for managing telecom subscriptions with role-based authentication, plan management, and user subscription tracking.

## System Architecture

### Technology Stack
- **Frontend**: React 18 with Hooks
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Role-based with mock credentials

### Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   └── services/           # API service layer
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Core Functionality

### 1. Authentication System

#### Login Component (`src/pages/Login.js`)
**Purpose**: Handles user authentication with email/phone and OTP support

**Features**:
- Dual authentication methods (Email/Password or Phone/OTP)
- Role-based login (Admin/User)
- Mock credential system
- Automatic redirection based on user role

**Mock Credentials**:
```javascript
// Admin Access
Email: admin@telecom.com
Password: admin123

// User Access  
Email: user@telecom.com
Password: user123

// Phone OTP (any phone number)
OTP: 123456
```

**How it works**:
1. User selects login type (Email or Phone)
2. For email: validates against mock credentials
3. For phone: sends mock OTP (123456)
4. Sets authentication context with user role
5. Redirects: Admin → `/admin-plans`, User → `/subscription`

#### Authentication Context (`src/context/AuthContext.js`)
**Purpose**: Global state management for authentication

**Features**:
- User session persistence
- Role-based routing logic
- Login/logout functionality
- Protected route handling

### 2. Navigation System

#### Navbar Component (`src/components/Navbar.js`)
**Purpose**: Main navigation with conditional rendering

**Features**:
- Login dropdown with role selection
- Conditional menu items based on authentication
- Responsive design
- User session display

**Navigation Flow**:
- **Unauthenticated**: Home, Plans, Login options
- **Authenticated User**: Home, Plans, My Subscription, Logout
- **Authenticated Admin**: Home, Plans, Admin Dashboard, Logout

### 3. Plan Management

#### Plans Display (`src/pages/Plans.js`)
**Purpose**: Public plan showcase with subscription functionality

**Features**:
- Grid layout of available plans
- Plan details (price, data quota, features)
- Subscribe button with authentication check
- Responsive card design

**Plan Structure**:
```javascript
{
  id: 1,
  name: "Basic Plan",
  price: 29.99,
  data_quota: 100,
  features: ["24/7 Support", "Free Installation"],
  product_type: "Fibernet"
}
```

#### Admin Plan Management (`src/pages/AdminPlansPricingPage.js`)
**Purpose**: Complete CRUD operations for telecom plans

**Features**:
- **Analytics Dashboard**: Total plans, active plans, subscribers, revenue
- **Plan Table**: Sortable list with status indicators
- **Add/Edit Plans**: Modal form with feature selection
- **Delete Protection**: Prevents deletion of plans with active subscribers
- **Status Toggle**: Activate/deactivate plans
- **Subscriber Tracking**: Monitor plan adoption

**Admin Operations**:
1. **Create Plan**: Form with name, description, price, data quota, features
2. **Edit Plan**: Pre-populated form for modifications
3. **Delete Plan**: Confirmation dialog with subscriber protection
4. **Toggle Status**: Quick activate/deactivate functionality

### 4. Subscription Management

#### User Subscription (`src/pages/Subscription.js`)
**Purpose**: User dashboard for subscription management

**Features**:
- Current subscription overview
- Usage tracking and billing history
- Plan upgrade/downgrade options
- Payment method management
- Support ticket system

#### Alternative Subscription View (`src/pages/MySubscription.js`)
**Purpose**: Simplified subscription interface

**Features**:
- Current plan details
- Quick actions (upgrade, cancel, support)
- Usage statistics
- Billing information

### 5. Form Components

#### AuthForm Component (`src/components/AuthForm.js`)
**Purpose**: Reusable form component for authentication

**Features**:
- Dynamic field rendering
- Form validation
- onChange event handling
- Responsive design

## User Workflows

### 1. New User Registration/Login
```
1. Visit landing page
2. Click "Login" in navbar
3. Select user type (User/Admin)
4. Choose login method (Email/Phone)
5. Enter credentials or phone number
6. For phone: enter OTP (123456)
7. Automatic redirection based on role
```

### 2. User Subscription Journey
```
1. Browse plans on /plans page
2. Click "Subscribe" on desired plan
3. Redirect to login if not authenticated
4. After login, redirect to subscription page
5. Manage subscription from dashboard
```

### 3. Admin Plan Management
```
1. Login as admin (admin@telecom.com/admin123)
2. Access admin dashboard at /admin-plans
3. View analytics and plan overview
4. Add new plans using "Add New Plan" button
5. Edit existing plans with edit button
6. Toggle plan status or delete (with protection)
```

## Data Models

### User Model
```javascript
{
  id: string,
  email: string,
  phone: string,
  role: "admin" | "user",
  isAuthenticated: boolean
}
```

### Plan Model
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,
  data_quota: number,
  product_type: string,
  features: string[],
  is_active: boolean,
  subscriber_count: number
}
```

### Subscription Model
```javascript
{
  id: number,
  user_id: string,
  plan_id: number,
  status: "active" | "inactive" | "suspended",
  start_date: string,
  billing_cycle: "monthly" | "yearly",
  usage: {
    data_used: number,
    data_limit: number
  }
}
```

## Security Features

### 1. Role-Based Access Control
- Admin routes protected from regular users
- User-specific content isolation
- Automatic redirection for unauthorized access

### 2. Authentication Protection
- Protected routes require authentication
- Session persistence across page refreshes
- Automatic logout functionality

### 3. Input Validation
- Form field validation
- Phone number format checking
- Email format validation

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Optimizations
- Collapsible navigation menu
- Stacked card layouts
- Touch-friendly buttons
- Optimized form inputs

## Development Setup

### Prerequisites
```bash
Node.js >= 14.0.0
npm >= 6.0.0
```

### Installation
```bash
cd frontend/
npm install
npm start
```

### Available Scripts
- `npm start`: Development server (port 3000)
- `npm build`: Production build
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

## Mock Data System

### Authentication
- Hardcoded credentials for demo purposes
- Mock OTP system (always accepts 123456)
- Role assignment based on email domain

### Plans
- Pre-populated plan data
- In-memory storage (resets on refresh)
- Simulated subscriber counts

### Subscriptions
- Mock user subscription data
- Simulated usage statistics
- Fake billing history

## Future Enhancements

### Backend Integration
- Replace mock data with real API calls
- Implement proper authentication with JWT
- Add database persistence

### Additional Features
- Payment gateway integration
- Real-time usage tracking
- Advanced analytics dashboard
- Multi-language support
- Push notifications

### Performance Optimizations
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Use `PORT=3001 npm start`
2. **Authentication not persisting**: Check localStorage in browser
3. **Plans not loading**: Verify mock data in component state
4. **Routing issues**: Ensure React Router is properly configured

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## API Documentation (Mock)

### Authentication Endpoints
```javascript
// Login
POST /api/auth/login
Body: { email, password } or { phone, otp }
Response: { user, token, role }

// Logout  
POST /api/auth/logout
Response: { success: true }
```

### Plans Endpoints
```javascript
// Get all plans
GET /api/plans
Response: Plan[]

// Create plan (Admin only)
POST /api/plans
Body: Plan
Response: Plan

// Update plan (Admin only)
PUT /api/plans/:id
Body: Partial<Plan>
Response: Plan

// Delete plan (Admin only)
DELETE /api/plans/:id
Response: { success: true }
```

### Subscription Endpoints
```javascript
// Get user subscriptions
GET /api/subscriptions
Response: Subscription[]

// Subscribe to plan
POST /api/subscriptions
Body: { plan_id }
Response: Subscription

// Update subscription
PUT /api/subscriptions/:id
Body: Partial<Subscription>
Response: Subscription
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team