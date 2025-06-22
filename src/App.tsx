import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getEntries, saveEntry } from './utils/journalStorage'
import { JournalEntry } from './types/journal'
import { v4 as uuidv4 } from 'uuid'

const years = Array.from({ length: 2200 - 2025 + 1 }, (_, i) => 2025 + i)

export default function App() {
  const [search, setSearch] = useState('')
  const [entryText, setEntryText] = useState('')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  const handleSave = () => {
    if (!entryText.trim()) return
    const newEntry: JournalEntry = {
      id: uuidv4(),
      content: entryText.trim(),
      timestamp: Date.now(),
    }
    saveEntry(newEntry)
    setEntries([newEntry, ...entries])
    setEntryText('')
  }

  return (
  <div
    className="min-h-screen text-white font-sans"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1350&q=80')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  >

    
      {/* Header */}
      <header className="text-center py-6 px-4 md:px-0 border-b border-white bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center animate-spin-slow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/61/61168.png"
              alt="Clock Logo"
              className="w-8 h-8"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Time Travel Diary</h1>
            <p className="text-sm text-white/80 mt-1">
              Connect with your past and future selves
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col md:flex-row px-4 md:px-10 gap-6 pt-4 bg-black/50 backdrop-blur-sm">
        {/* Timeline */}
        <aside className="w-full md:w-32 overflow-y-auto bg-black/40 rounded-lg p-4 max-h-96 md:max-h-[calc(100vh-10rem)] shadow-md">
          <h2 className="text-lg font-semibold mb-2">Timeline</h2>
          <ul className="space-y-1 text-sm max-h-full overflow-y-auto">
            {years.map((year) => (
              <div key={year}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer mb-1 ${
                    selectedYear === year ? 'text-yellow-400 font-bold' : 'hover:text-yellow-300'
                  }`}
                  onClick={() => {
                    setSelectedYear((prev) => (prev === year ? null : year))
                    setSelectedMonth(null)
                  }}
                >
                  {year}
                </motion.div>

                {selectedYear === year && (
                  <ul className="ml-2 mb-2">
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
                      (month, index) => (
                        <li
                          key={index}
                          className={`text-sm ml-1 cursor-pointer ${
                            selectedMonth === index ? 'text-green-400 font-semibold' : 'hover:text-green-300'
                          }`}
                          onClick={() => setSelectedMonth(index)}
                        >
                          ↳ {month}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <section className="flex-1 space-y-4">
          {/* Search and inline entry */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <input
                type="text"
                placeholder="Search your entries"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-2/3 px-4 py-2 rounded-lg bg-white text-black focus:outline-none shadow-sm"
              />
            </div>

            <div className="flex justify-center">
              <div className="bg-black/40 p-4 rounded-lg shadow w-full max-w-3xl">
                <h3 className="text-md font-semibold mb-2">📝 Start writing memories</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Write something to your past or future self..."
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSave()
                      }
                    }}
                    className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none shadow"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {selectedYear !== null && selectedMonth !== null && (
            <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-300 mt-6">
              🕰️ Past Memories of {
                ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][selectedMonth]
              } {selectedYear}
            </h3>
          )}

          {entries.length > 0 && (
            <div className="space-y-3">
              {entries
                .filter((entry) => {
                  const lowerSearch = search.toLowerCase()
                  const entryDate = new Date(entry.timestamp)
                  const dateStr = entryDate.toLocaleString().toLowerCase()

                  const matchesSearch =
                    entry.content.toLowerCase().includes(lowerSearch) ||
                    dateStr.includes(lowerSearch)

                  const matchesYear =
                    selectedYear === null || entryDate.getFullYear() === selectedYear

                  const matchesMonth =
                    selectedMonth === null || entryDate.getMonth() === selectedMonth

                  return matchesSearch && matchesYear && matchesMonth
                })
                .map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-black/40 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-sm text-white/70 mb-2">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p>{entry.content}</p>
                  </motion.div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
