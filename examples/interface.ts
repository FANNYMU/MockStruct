// Basic User Interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

// User Profile with Optional Fields
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  age: number;
  isEmailVerified: boolean;
  profilePicture?: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    language: string;
  };
  address: UserAddress;
  roles: string[];
  tags?: string[];
  metadata?: Record<string, any>;
  lastLoginAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

// Address Interface (renamed to avoid conflicts)
interface UserAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// E-commerce Product Interface
interface Product {
  id: string;
  sku: string;
  productName: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string;
  inStock: boolean;
  stockQuantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "inch";
  };
  images: string[];
  thumbnailUrl: string;
  colors?: string[];
  sizes?: string[];
  rating: {
    average: number;
    count: number;
    reviews: ProductReview[];
  };
  tags: string[];
  specifications: Record<string, string>;
  isDigital: boolean;
  downloadUrl?: string;
  vendor: ProductVendor;
  seoData: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    slug: string;
  };
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Product Review Interface
interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  reviewTitle: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  images?: string[];
  createdAt: Date;
}

// Vendor Interface (renamed to avoid conflicts)
interface ProductVendor {
  id: string;
  vendorName: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
  logo?: string;
  address: UserAddress;
  businessType: "individual" | "company" | "enterprise";
  isVerified: boolean;
  rating: number;
  totalSales: number;
  joinedAt: Date;
}

// Blog Post Interface
interface BlogPost {
  id: string;
  postTitle: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  images?: string[];
  author: BlogAuthor;
  categories: BlogCategory[];
  tags: string[];
  status: "draft" | "published" | "archived";
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  estimatedReadTime: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Author Interface (renamed to avoid conflicts)
interface BlogAuthor {
  id: string;
  authorName: string;
  email: string;
  bio?: string;
  avatar?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  isVerified: boolean;
  postCount: number;
  followerCount: number;
  joinedAt: Date;
}

// Category Interface (renamed to avoid conflicts)
interface BlogCategory {
  id: string;
  categoryName: string;
  slug: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  postCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

// Order Management Interface
interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: {
    customerName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: {
    paymentType:
      | "credit_card"
      | "paypal"
      | "bank_transfer"
      | "cash_on_delivery";
    details?: Record<string, any>;
  };
  shippingAddress: UserAddress;
  billingAddress?: UserAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  refundAmount?: number;
  refundReason?: string;
  timeline: OrderTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// Order Item Interface
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount?: number;
  variant?: {
    color?: string;
    size?: string;
    style?: string;
  };
  customization?: Record<string, any>;
}

// Order Timeline Event Interface
interface OrderTimelineEvent {
  id: string;
  eventName: string;
  description: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

// Analytics Dashboard Interface
interface DashboardMetrics {
  id: string;
  dashboardName: string;
  timeRange: {
    startDate: Date;
    endDate: Date;
    preset:
      | "today"
      | "yesterday"
      | "last_7_days"
      | "last_30_days"
      | "last_90_days"
      | "custom";
  };
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  };
  chartData: {
    userGrowth: DataPoint[];
    revenueChart: DataPoint[];
    topProducts: ProductMetric[];
    trafficSources: TrafficSource[];
    geographicData: GeographicMetric[];
  };
  filters: {
    country?: string[];
    deviceType?: ("desktop" | "mobile" | "tablet")[];
    userSegment?: string[];
    productCategory?: string[];
  };
  lastUpdated: Date;
  autoRefresh: boolean;
  refreshInterval: number;
}

// Data Point Interface
interface DataPoint {
  date: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

// Product Metric Interface
interface ProductMetric {
  productId: string;
  productName: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
  rating: number;
}

// Traffic Source Interface
interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  conversionRate: number;
  bounceRate: number;
}

// Geographic Metric Interface
interface GeographicMetric {
  country: string;
  countryCode: string;
  visitors: number;
  sales: number;
  revenue: number;
}

// Event Management Interface
interface EventDetails {
  id: string;
  eventTitle: string;
  description: string;
  shortDescription?: string;
  eventType:
    | "conference"
    | "workshop"
    | "webinar"
    | "meetup"
    | "concert"
    | "sports"
    | "other";
  category: string;
  coverImage?: string;
  images?: string[];
  venue: {
    venueName: string;
    address: UserAddress;
    capacity: number;
    amenities?: string[];
    contactInfo?: {
      phone?: string;
      email?: string;
      website?: string;
    };
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    timezone: string;
    sessions?: EventSession[];
  };
  organizer: {
    id: string;
    organizerName: string;
    email: string;
    phone?: string;
    organization?: string;
    bio?: string;
  };
  speakers?: EventSpeaker[];
  pricing: {
    isFree: boolean;
    earlyBird?: {
      price: number;
      endDate: Date;
    };
    regular: {
      price: number;
    };
    group?: {
      price: number;
      minQuantity: number;
    };
    currency: string;
  };
  registration: {
    isRequired: boolean;
    maxAttendees?: number;
    currentAttendees: number;
    registrationDeadline?: Date;
    approvalRequired: boolean;
    customFields?: RegistrationField[];
  };
  tags: string[];
  isPublic: boolean;
  isFeatured: boolean;
  eventStatus: "draft" | "published" | "cancelled" | "postponed" | "completed";
  requirements?: string[];
  whatToExpect?: string[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Event Session Interface
interface EventSession {
  id: string;
  sessionTitle: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  speakerId?: string;
  sessionLocation?: string;
  sessionType: "presentation" | "workshop" | "panel" | "networking" | "break";
  capacity?: number;
  materials?: string[];
}

// Speaker Interface (renamed to avoid conflicts)
interface EventSpeaker {
  id: string;
  speakerName: string;
  jobTitle: string;
  company?: string;
  bio: string;
  photo?: string;
  expertise: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  previousSpeaking?: string[];
  rating?: number;
}

// Registration Field Interface
interface RegistrationField {
  id: string;
  fieldName: string;
  label: string;
  fieldType:
    | "text"
    | "email"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// API Response Wrapper Interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Notification Interface
interface UserNotification {
  id: string;
  userId: string;
  notificationType: "info" | "success" | "warning" | "error" | "marketing";
  channel: "email" | "sms" | "push" | "in_app";
  notificationTitle: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  isArchived: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Company/Organization Interface
interface Company {
  id: string;
  companyName: string;
  industry: string;
  size: "startup" | "small" | "medium" | "large" | "enterprise";
  foundedYear: number;
  headquarters: UserAddress;
  website?: string;
  description?: string;
  logo?: string;
  employees: CompanyEmployee[];
  revenue?: number;
  isPublic: boolean;
  stockSymbol?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    supportEmail?: string;
    salesEmail?: string;
  };
  technologies?: string[];
  benefits?: string[];
  culture?: string[];
  certifications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Company Employee Interface
interface CompanyEmployee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  level:
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "manager"
    | "director"
    | "vp"
    | "c_level";
  salary?: number;
  hireDate: Date;
  isActive: boolean;
  skills: string[];
  manager?: {
    id: string;
    name: string;
  };
  directReports?: number;
  workLocation: "office" | "remote" | "hybrid";
  phoneExtension?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
