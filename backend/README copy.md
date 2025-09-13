# Welcome to your organization's demo respository
This code repository (or "repo") is designed to demonstrate the best GitHub has to offer with the least amount of noise.

The repo includes an `index.html` file (so it can render a web page), two GitHub Actions workflows, and a CSS stylesheet dependency.

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    COMPANY = "company"
    END_USER = "end_user"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    SUSPENDED = "suspended"

class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool

# Company Models
class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int
    owner_id: int
    created_at: datetime

# Plan Models
class PlanBase(BaseModel):
    name: str
    description: str
    price: float
    billing_cycle: str  # monthly, yearly, etc.
    data_limit: Optional[int] = None  # in GB
    speed_limit: Optional[int] = None  # in Mbps
    features: List[str] = []

class PlanCreate(PlanBase):
    company_id: int

class PlanResponse(PlanBase):
    id: int
    company_id: int
    is_active: bool
    created_at: datetime

# Subscription Models
class SubscriptionBase(BaseModel):
    plan_id: int
    auto_renew: bool = True

class SubscriptionCreate(SubscriptionBase):
    discount_code: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    status: SubscriptionStatus
    start_date: datetime
    end_date: datetime
    next_billing_date: Optional[datetime]
    current_usage: int = 0

# Discount Models
class DiscountBase(BaseModel):
    code: str
    discount_type: DiscountType
    value: float
    description: Optional[str] = None
    valid_from: datetime
    valid_until: datetime
    max_uses: Optional[int] = None

class DiscountCreate(DiscountBase):
    applicable_plans: List[int] = []

class DiscountResponse(DiscountBase):
    id: int
    company_id: int
    current_uses: int = 0
    is_active: bool

# Analytics Models
class PlanAnalytics(BaseModel):
    plan_id: int
    total_subscribers: int
    active_subscribers: int
    monthly_revenue: float
    churn_rate: float

class CompanyAnalytics(BaseModel):
    company_id: int
    total_plans: int
    total_subscribers: int
    monthly_revenue: float
    top_performing_plans: List[PlanAnalytics]


Authentication (auth.py)
pythondef create_access_token(data: dict)
def verify_token(token: str)
def get_password_hash(password: str)
def verify_password(plain_password: str, hashed_password: str)
def get_current_user(token: str)
def require_roles(allowed_roles: List[UserRole])
User Management (users.py)
pythondef create_user(user_data: UserCreate)
def get_user_by_email(email: str)
def get_user_by_id(user_id: int)
def update_user_profile(user_id: int, user_data: dict)
def get_user_subscriptions(user_id: int)
Company Management (companies.py)
pythondef create_company(company_data: CompanyCreate, owner_id: int)
def get_company_by_id(company_id: int)
def update_company(company_id: int, company_data: dict)
def get_company_plans(company_id: int)
def get_company_analytics(company_id: int)
Plan Management (plans.py)
pythondef create_plan(plan_data: PlanCreate)
def get_all_active_plans()
def get_plan_by_id(plan_id: int)
def update_plan(plan_id: int, plan_data: dict)
def delete_plan(plan_id: int)
def get_company_plans(company_id: int)
Subscription Management (subscriptions.py) - CORE
pythondef create_subscription(user_id: int, subscription_data: SubscriptionCreate)
def get_user_subscriptions(user_id: int)
def get_subscription_by_id(subscription_id: int)
def upgrade_subscription(subscription_id: int, new_plan_id: int)
def downgrade_subscription(subscription_id: int, new_plan_id: int)
def cancel_subscription(subscription_id: int)
def renew_subscription(subscription_id: int)
def toggle_auto_renew(subscription_id: int, auto_renew: bool)
def process_auto_renewals()  # Background task
def calculate_prorated_amount(old_plan: Plan, new_plan: Plan, days_remaining: int)
Discount Management (discounts.py)
pythondef create_discount(discount_data: DiscountCreate, company_id: int)
def get_company_discounts(company_id: int)
def validate_discount_code(code: str, plan_id: int)
def apply_discount(subscription_id: int, discount_code: str)
def update_discount(discount_id: int, discount_data: dict)
def delete_discount(discount_id: int)
Analytics (analytics.py)
pythondef get_plan_analytics(plan_id: int)
def get_company_analytics(company_id: int)
def get_system_analytics()
def calculate_churn_rate(plan_id: int, period: str)
def get_revenue_trends(company_id: int, period: str)
Notifications (notifications.py)
pythondef send_subscription_confirmation(user_id: int, subscription_id: int)
def send_renewal_reminder(user_id: int, subscription_id: int)
def send_cancellation_confirmation(user_id: int, subscription_id: int)
def send_plan_change_notification(user_id: int, old_plan: str, new_plan: str)
def schedule_renewal_reminders()

