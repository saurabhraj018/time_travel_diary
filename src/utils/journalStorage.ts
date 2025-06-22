import { JournalEntry } from '../types/journal'

const STORAGE_KEY = 'time_travel_entries'

export function getEntries(): JournalEntry[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveEntry(entry: JournalEntry) {
  const entries = getEntries()
  entries.unshift(entry) // add newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}
