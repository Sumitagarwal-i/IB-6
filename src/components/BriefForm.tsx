import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Globe, Target, Loader2, Sparkles } from 'lucide-react'
import { CompanyAutocomplete } from './CompanyAutocomplete'

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
    } else if (formData.userIntent.trim().length < 15) {
      newErrors.userIntent = 'Please provide more details about your intent (minimum 15 characters)'
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

  const handleCompanyChange = (name: string, website?: string) => {
    setFormData(prev => ({
      ...prev,
      companyName: name,
      website: website || prev.website
    }))
    if (errors.companyName) {
      setErrors(prev => ({ ...prev, companyName: '' }))
    }
  }

  const intentExamples = [
    "Pitch our AI-powered analytics platform to help them optimize their data pipeline and reduce infrastructure costs",
    "Introduce our cybersecurity solution to protect their growing remote workforce and cloud infrastructure",
    "Present our customer success platform to help them scale their support operations and improve retention",
    "Offer our DevOps automation tools to streamline their deployment process and reduce time-to-market"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Generate Strategic Intelligence Brief
          </h2>
          <p className="text-gray-400 text-lg">
            Get real-time insights powered by live data sources and AI analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name *
            </label>
            <CompanyAutocomplete
              value={formData.companyName}
              onChange={handleCompanyChange}
              placeholder="Start typing company name (e.g., Shopify, Stripe, OpenAI)"
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="text-red-400 text-sm mt-2">{errors.companyName}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              We'll auto-suggest companies and fetch their website
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Globe className="w-4 h-4 inline mr-2" />
              Website (Optional)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="https://company.com (auto-filled from company selection)"
              disabled={isLoading}
            />
            {errors.website && (
              <p className="text-red-400 text-sm mt-2">{errors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Target className="w-4 h-4 inline mr-2" />
              Your Strategic Intent *
            </label>
            <textarea
              value={formData.userIntent}
              onChange={(e) => setFormData({ ...formData, userIntent: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              placeholder="Describe what you want to pitch and how it can help them..."
              disabled={isLoading}
            />
            {errors.userIntent && (
              <p className="text-red-400 text-sm mt-2">{errors.userIntent}</p>
            )}
            
            {/* Intent Examples */}
            <div className="mt-4">
              <p className="text-gray-500 text-xs mb-3">Example intents:</p>
              <div className="grid gap-2">
                {intentExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, userIntent: example })}
                    className="text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-200"
                    disabled={isLoading}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl shadow-primary-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Real-Time Data...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Intelligence Brief
              </>
            )}
          </motion.button>

          {/* Data Sources Preview */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Real-Time Data Sources</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                NewsData.io
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                BuiltWith API
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                JSearch Jobs
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Groq AI
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  )
}