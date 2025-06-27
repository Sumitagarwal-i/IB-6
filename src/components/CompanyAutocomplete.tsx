import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Search, Check } from 'lucide-react'

interface CompanySuggestion {
  name: string
  domain: string
  logo?: string
}

interface CompanyAutocompleteProps {
  value: string
  onChange: (value: string, website?: string) => void
  placeholder?: string
  disabled?: boolean
}

export function CompanyAutocomplete({ value, onChange, placeholder, disabled }: CompanyAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(value)}`)
        if (response.ok) {
          const data = await response.json()
          const formattedSuggestions = data.map((item: any) => ({
            name: item.name,
            domain: item.domain,
            logo: `https://logo.clearbit.com/${item.domain}`
          }))
          setSuggestions(formattedSuggestions)
          setIsOpen(formattedSuggestions.length > 0)
        }
      } catch (error) {
        console.error('Failed to fetch company suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value])

  const handleSelect = (suggestion: CompanySuggestion) => {
    onChange(suggestion.name, `https://${suggestion.domain}`)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % suggestions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={`${suggestion.domain}-${index}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                  index === selectedIndex ? 'bg-gray-700' : ''
                }`}
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.8)' }}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {suggestion.logo ? (
                    <img 
                      src={suggestion.logo} 
                      alt={`${suggestion.name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <Building2 className={`w-4 h-4 text-gray-400 ${suggestion.logo ? 'hidden' : ''}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{suggestion.name}</div>
                  <div className="text-gray-400 text-sm truncate">{suggestion.domain}</div>
                </div>
                {index === selectedIndex && (
                  <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}