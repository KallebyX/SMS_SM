import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, Check } from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface FilterOption {
  id: string
  label: string
  value: any
}

interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'select' | 'date'
  options?: FilterOption[]
}

interface FilterPanelProps {
  filters: FilterGroup[]
  onApply: (selectedFilters: Record<string, any>) => void
  onReset: () => void
  className?: string
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onApply,
  onReset,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})

  const handleCheckboxChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[groupId] || []
      if (checked) {
        return { ...prev, [groupId]: [...current, optionId] }
      } else {
        return { ...prev, [groupId]: current.filter((id: string) => id !== optionId) }
      }
    })
  }

  const handleRadioChange = (groupId: string, value: any) => {
    setSelectedFilters(prev => ({ ...prev, [groupId]: value }))
  }

  const handleApply = () => {
    onApply(selectedFilters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setSelectedFilters({})
    onReset()
  }

  const activeFiltersCount = Object.values(selectedFilters).filter(v => {
    if (Array.isArray(v)) return v.length > 0
    return v !== undefined && v !== null && v !== ''
  }).length

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 bg-maternar-blue-600 text-white">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Groups */}
              <div className="p-4 max-h-96 overflow-y-auto space-y-6">
                {filters.map(group => (
                  <div key={group.id}>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">{group.label}</h4>
                    
                    {group.type === 'checkbox' && group.options && (
                      <div className="space-y-2">
                        {group.options.map(option => (
                          <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(selectedFilters[group.id] || []).includes(option.id)}
                              onChange={(e) => handleCheckboxChange(group.id, option.id, e.target.checked)}
                              className="w-4 h-4 text-maternar-blue-600 border-gray-300 rounded focus:ring-maternar-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {group.type === 'radio' && group.options && (
                      <div className="space-y-2">
                        {group.options.map(option => (
                          <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={group.id}
                              checked={selectedFilters[group.id] === option.value}
                              onChange={() => handleRadioChange(group.id, option.value)}
                              className="w-4 h-4 text-maternar-blue-600 border-gray-300 focus:ring-maternar-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {group.type === 'date' && (
                      <input
                        type="date"
                        value={selectedFilters[group.id] || ''}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, [group.id]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between space-x-3">
                <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
                  Limpar
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Aplicar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

