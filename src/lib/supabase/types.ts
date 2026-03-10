export type UserRole = 'creator' | 'sponsor'
export type CreatorType = 'podcaster' | 'athlete' | 'event'
export type Country = 'AZ' | 'RU' | 'OTHER'
export type Language = 'az' | 'en' | 'ru'
export type Currency = 'AZN' | 'RUB'
export type PackageStatus = 'active' | 'paused' | 'draft'
export type DealStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
export type PaymentProvider = 'payriff' | 'yookassa'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  full_name: string
  avatar_url: string | null
  phone: string | null
  country: Country
  language: Language
  onboarding_completed: boolean
  created_at: string
}

export interface Creator {
  id: string
  profile_id: string
  type: CreatorType
  bio: string | null
  category: string | null
  reach_count: number
  audience_country: string | null
  social_links: Record<string, string>
  verified: boolean
  media_kit_url: string | null
  is_visible: boolean
  created_at: string
}

export interface Sponsor {
  id: string
  profile_id: string
  company_name: string
  industry: string | null
  website: string | null
  description: string | null
  created_at: string
}

export interface Deliverable {
  type: string
  label: string
  qty?: number
}

export interface Package {
  id: string
  creator_id: string
  title: string
  description: string | null
  price: number
  currency: Currency
  duration_days: number
  deliverables: Deliverable[]
  cover_image_url: string | null
  status: PackageStatus
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  package_id: string
  sponsor_id: string
  creator_id: string
  status: DealStatus
  message: string | null
  total_price: number
  currency: Currency
  platform_fee: number
  creator_payout: number
  proof_url: string | null
  proof_note: string | null
  created_at: string
  accepted_at: string | null
  completed_at: string | null
}

export interface DealEvent {
  id: string
  deal_id: string
  status: string
  note: string | null
  created_by: string | null
  created_at: string
}

export interface Payment {
  id: string
  deal_id: string
  provider: PaymentProvider
  provider_payment_id: string | null
  provider_order_id: string | null
  amount: number
  currency: Currency
  status: PaymentStatus
  paid_at: string | null
  created_at: string
}

export interface Review {
  id: string
  deal_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface CreatorCard {
  id: string
  type: CreatorType
  bio: string | null
  category: string | null
  reach_count: number
  audience_country: string | null
  social_links: Record<string, string>
  verified: boolean
  full_name: string
  avatar_url: string | null
  country: Country
  language: Language
  min_price: number | null
  currency: Currency | null
  completed_deals_count: number
  avg_rating: number | null
}

export const PLATFORM_FEE_PERCENT = 30

export function calculateFees(price: number) {
  const platformFee = Math.round(price * PLATFORM_FEE_PERCENT / 100)
  const creatorPayout = price - platformFee
  return { platformFee, creatorPayout }
}

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'AZN') {
    return `${(amount / 100).toFixed(2)} ₼`
  }
  return `${(amount / 100).toFixed(0)} ₽`
}
