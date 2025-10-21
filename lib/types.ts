// Core data models for CraftKit

export type AccountStatus = "active" | "inactive" | "archived"

export interface Account {
  id: string
  name: string
  platformUrl?: string
  followerCount: number
  totalPosts: number
  weeklyFollowerGrowth: number // percentage
  weeklyLikeGrowth: number // percentage
  dailyFollowerGrowth: number // percentage
  dailyLikeGrowth: number // percentage
  persona: Persona
  createdAt: string
  updatedAt: string
  status: AccountStatus
}

export interface Persona {
  personality: string
  industry: string
  appearance: string
  catchphrase: string
  updateFrequency: string // e.g., "3x/week", "Daily"
}

export type IdeaStatus = "pending" | "scheduled" | "in-production" | "published" | "abandoned"

export interface ContentIdea {
  id: string
  accountId: string
  title: string
  description?: string
  scriptDraft?: string
  scriptLink?: string
  status: IdeaStatus
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface DashboardStats {
  totalAccounts: number
  activeAccounts: number
  totalPosts: number
  totalFollowers: number
  pendingIdeas: number
  scheduledIdeas: number
}
