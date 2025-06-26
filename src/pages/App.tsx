import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Plus, History, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BriefForm } from '../components/BriefForm'
import { AnalyzingScreen } from '../components/AnalyzingScreen'
import { BriefCard } from '../components/BriefCard'
import { EmptyState } from '../components/EmptyState'
import { supabase, Brief, CreateBriefRequest } from '../lib/supabase'

export function App() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<{ companyName: string; website?: string } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBriefs()
  }, [])

  const loadBriefs = async () => {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      setBriefs(data || [])
    } catch (err) {
      console.error('Error loading briefs:', err)
      setError('Failed to load briefs')
    }
  }

  const handleCreateBrief = async (requestData: CreateBriefRequest) => {
    setIsLoading(true)
    setIsAnalyzing(true)
    setCurrentAnalysis({ companyName: requestData.companyName, website: requestData.website })
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Wait for analyzing animation to complete
      setTimeout(() => {
        setIsAnalyzing(false)
        setCurrentAnalysis(null)
        setShowForm(false)
        loadBriefs() // Refresh the briefs list
      }, 2000)

    } catch (err) {
      console.error('Error creating brief:', err)
      setError('Failed to create brief. Please try again.')
      setIsAnalyzing(false)
      setCurrentAnalysis(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowForm = () => {
    setShowForm(true)
    setError(null)
  }

  const handleBackToList = () => {
    setShowForm(false)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-gray-950/90 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">IntelliBrief</span>
            </Link>
            <div className="flex items-center gap-4">
              {showForm ? (
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Briefs
                </button>
              ) : (
                <button
                  onClick={handleShowForm}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  New Brief
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  {error}
                </div>
              )}
              <BriefForm onSubmit={handleCreateBrief} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Your Strategic Briefs</h1>
                  <p className="text-gray-400">
                    {briefs.length === 0 ? 'No briefs created yet' : `${briefs.length} brief${briefs.length !== 1 ? 's' : ''} generated`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <History className="w-5 h-5" />
                  <span>Recent Activity</span>
                </div>
              </div>

              {briefs.length === 0 ? (
                <EmptyState onCreateNew={handleShowForm} />
              ) : (
                <div className="grid gap-6">
                  {briefs.map((brief) => (
                    <BriefCard key={brief.id} brief={brief} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyzing Screen Overlay */}
      <AnimatePresence>
        {isAnalyzing && currentAnalysis && (
          <AnalyzingScreen
            companyName={currentAnalysis.companyName}
            website={currentAnalysis.website}
          />
        )}
      </AnimatePresence>
    </div>
  )
}