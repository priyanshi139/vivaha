export type UserType = 'bride' | 'groom' | 'vendor' | 'planner' | 'admin';

export interface UserDetails {
  fullName: string;
  state: string;
  city: string;
  address: string;
}

export interface WeddingDetails {
  date: string;
  state: string;
  city: string;
  venueFinalized: 'yes' | 'no' | 'discussion';
  venueName?: string;
  venueLocation?: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

export interface AppState {
  screen: 'splash' | 'onboarding_info' | 'user_type' | 'auth' | 'onboarding_form' | 'dashboard' | 'checklist' | 'inspiration' | 'packages' | 'profile' | 'real_weddings' | 'blogs' | 'category_page' | 'bookings' | 'saved_vendors' | 'settings' | 'help_support' | 'about_vivah' | 'guest_list' | 'admin_login' | 'admin_dashboard' | 'vendor_dashboard' | 'planner_dashboard' | 'role_selection';
  userType: UserType | null;
  userDetails: UserDetails | null;
  fianceDetails: UserDetails | null;
  weddingDetails: WeddingDetails | null;
  isPremium: boolean;
  selectedCategory?: string;
  guests: Guest[];
  adminUser?: string;
}

export interface AdminVendor {
  id: string;
  name: string;
  services: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
}

export interface AdminBooking {
  id: string;
  service: string;
  customer_name: string;
  customer_id: string;
  date: string;
  payment_status: string;
  vendor_id: string;
}

export interface AdminFeedback {
  id: string;
  customer_name: string;
  message: string;
  response: string;
  created_at: string;
}

export interface AdminReports {
  totalBookings: number;
  pendingApprovals: number;
  approvedVendors: number;
}

export type RSVPStatus = 'Accepted' | 'Maybe' | 'Not Attending' | 'Pending';
export type RelationType = 'Family' | 'Friend' | 'Relative';

export interface Guest {
  id: string;
  name: string;
  relation: RelationType;
  phone: string;
  email?: string;
  rsvp: RSVPStatus;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface PortfolioItem {
  id: string;
  image: string;
  title: string;
}

export interface CatalogueItem {
  id: string;
  image: string;
  title: string;
}

export interface InspirationBoard {
  id: string;
  name: string;
  count: number;
  img: string;
  description: string;
  catalogue: CatalogueItem[];
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  location: string;
  price: string;
  priceValue: number; // For sorting
  image: string;
  isPremium?: boolean;
  description?: string;
  portfolio?: PortfolioItem[];
  availability?: string[]; // Array of dates or months, e.g., ['2026-12-10', '2026-12-11']
  specificServices?: string[]; // e.g., ['Candid', 'Cinematic', 'Traditional']
}

export interface Package {
  id: string;
  name: string;
  members: string[];
  price: string;
  image: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Tips' | 'Budget' | 'Fashion';
  date: string;
}

export interface RealWedding {
  id: string;
  couple: string;
  location: string;
  story: string;
  mainImage: string;
  gallery: string[];
  vendors: { name: string; category: string }[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
}

export interface BudgetPurchase {
  id: string;
  name: string;
  categoryId: string;
  cost: number;
  status: 'paid' | 'pending';
  vendorId?: string;
  collaborators: ('bride' | 'groom')[];
}
