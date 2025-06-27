
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Plus, History, ArrowLeft, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BriefForm } from '../components/BriefForm'
import { AnalyzingScreen } from '../components/AnalyzingScreen'
import { BriefCard } from '../components/BriefCard'
import { BriefModal } from '../components/BriefModal'
import { EmptyState } from '../components/EmptyState'
import { Brief, CreateBriefRequest, briefsService } from '../lib/supabase'

export function App() {
  const navigate = useNavigate()
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      const data = await briefsService.getAll()
      setBriefs(data)
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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Wait for analyzing animation to complete, then navigate to the new brief
      setTimeout(async () => {
        setIsAnalyzing(false)
        setCurrentAnalysis(null)
        
        // Refresh briefs and navigate to the new brief
        await loadBriefs()
        
        // Navigate to the newly created brief detail page
        if (result.brief && result.brief.id) {
          navigate(`/brief/${result.brief.id}`)
        }
      }, 2000)

    } catch (err) {
      console.error('Error creating brief:', err)
      setError(err instanceof Error ? err.message : 'Failed to create brief. Please try again.')
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

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBrief(null)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-gray-950/90 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">IntelliBrief</span>
                <div className="text-xs text-primary-400 font-medium">Powered by Groq AI</div>
              </div>
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
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-primary-500/25"
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <div className="font-medium">Error creating brief</div>
                    <div className="text-sm text-red-400">{error}</div>
                  </div>
                </motion.div>
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
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    Your Strategic Briefs
                    {briefs.length > 0 && (
                      <span className="inline-flex items-center gap-1 bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        {briefs.length} generated
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {briefs.length === 0 
                      ? 'Create your first AI-powered strategic brief' 
                      : 'AI-powered insights for smarter B2B outreach'
                    }
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
                    <BriefCard 
                      key={brief.id} 
                      brief={brief}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brief Modal */}
      <BriefModal
        brief={selectedBrief}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

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
