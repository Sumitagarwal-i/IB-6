import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Globe, Target, Loader2 } from 'lucide-react'

interface BriefFormProps {
  onSubmit: (data: { companyName: string; website?: string; userIntent: string }) => void
  isLoading: boolean
}

export function BriefForm({ onSubmit, isLoading }: BriefFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    userIntent: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (!formData.userIntent.trim()) {
      newErrors.userIntent = 'Please describe your intent'
    } else if (formData.userIntent.trim().length < 10) {
      newErrors.userIntent = 'Please provide more details about your intent'
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        companyName: formData.companyName.trim(),
        website: formData.website.trim() || undefined,
        userIntent: formData.userIntent.trim()
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Generate Your Strategic Brief
          </h2>
          <p className="text-gray-400">
            Get AI-powered insights to craft the perfect pitch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="e.g., Shopify, Stripe, OpenAI"
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Website (Optional)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="https://company.com"
              disabled={isLoading}
            />
            {errors.website && (
              <p className="text-red-400 text-sm mt-1">{errors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              Your Intent *
            </label>
            <textarea
              value={formData.userIntent}
              onChange={(e) => setFormData({ ...formData, userIntent: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              placeholder="e.g., I want to pitch my AI DevOps API to help them reduce deployment times and improve reliability..."
              disabled={isLoading}
            />
            {errors.userIntent && (
              <p className="text-red-400 text-sm mt-1">{errors.userIntent}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Be specific about what you're offering and how it can help them
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Strategic Brief'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}