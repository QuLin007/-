// Local storage utilities for data persistence

import type { Account, ContentIdea } from "./types"

const STORAGE_KEYS = {
  ACCOUNTS: "craftkit_accounts",
  IDEAS: "craftkit_ideas",
} as const

// Account operations
export function getAccounts(): Account[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
  return data ? JSON.parse(data) : []
}

export function saveAccount(account: Account): void {
  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.id === account.id)

  if (index >= 0) {
    accounts[index] = { ...account, updatedAt: new Date().toISOString() }
  } else {
    accounts.push(account)
  }

  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
}

export function deleteAccount(id: string): void {
  const accounts = getAccounts().filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
}

export function getAccountById(id: string): Account | undefined {
  return getAccounts().find((a) => a.id === id)
}

// Content idea operations
export function getIdeas(): ContentIdea[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.IDEAS)
  return data ? JSON.parse(data) : []
}

export function getIdeasByAccount(accountId: string): ContentIdea[] {
  return getIdeas().filter((idea) => idea.accountId === accountId)
}

export function saveIdea(idea: ContentIdea): void {
  const ideas = getIdeas()
  const index = ideas.findIndex((i) => i.id === idea.id)

  if (index >= 0) {
    ideas[index] = { ...idea, updatedAt: new Date().toISOString() }
  } else {
    ideas.push(idea)
  }

  localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
}

export function deleteIdea(id: string): void {
  const ideas = getIdeas().filter((i) => i.id !== id)
  localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
}

export function updateIdeaStatus(id: string, status: ContentIdea["status"]): void {
  const ideas = getIdeas()
  const idea = ideas.find((i) => i.id === id)

  if (idea) {
    idea.status = status
    idea.updatedAt = new Date().toISOString()

    if (status === "published") {
      idea.publishedAt = new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
  }
}
