import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  Calendar, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Newspaper,
  Code,
  TrendingUp,
  Target,
  AlertTriangle,
  Mail,
  Brain,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Users,
  MapPin,
  DollarSign,
  Sparkles
} from 'lucide-react'
import { Brief, briefsService } from '../lib/supabase'
import { BriefSidebar } from '../components/BriefSidebar'
import { NewsCard } from '../components/NewsCard'
import { TechStackGrid } from '../components/TechStackGrid'
import { HiringChart } from '../components/HiringChart'
import { RetryBriefButton } from '../components/RetryBriefButton'

export function BriefDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadBrief(id)
    }
  }, [id])

  const loadBrief = async (briefId: string) => {
    try {
      setLoading(true)
      const briefs = await briefsService.getAll()
      const foundBrief = briefs.find(b => b.id === briefId)
      
      if (foundBrief) {
        setBrief(foundBrief)
      } else {
        setError('Brief not found')
      }
    } catch (err) {
      console.error('Error loading brief:', err)
      setError('Failed to load brief')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleRetryBrief = async (briefId: string) => {
    if (!brief) return
    
    // Call the create-brief function again with the same parameters
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-brief`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        companyName: brief.companyName,
        website: brief.website,
        userIntent: brief.userIntent
      }),
    })

    if (response.ok) {
      // Reload the brief to get updated data
      await loadBrief(briefId)
    } else {
      throw new Error('Failed to retry brief generation')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-400">Loading strategic brief...</p>
        </div>
      </div>
    )
  }

  if (error || !brief) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Brief Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Briefs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-gray-950/90 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/app" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Briefs</span>
            </Link>
            <div className="flex items-center gap-4">
              <RetryBriefButton briefId={brief.id} onRetry={handleRetryBrief} />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">IntelliBrief</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <BriefSidebar brief={brief} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Executive Summary */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary-400" />
                  Executive Intelligence Summary
                </h2>
                <div className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-xl p-6">
                  <p className="text-gray-300 leading-relaxed text-lg">{brief.summary}</p>
                </div>
              </div>

              {/* Strategic Pitch Angle */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Target className="w-6 h-6 text-violet-400" />
                    Strategic Pitch Strategy
                  </h2>
                  <button
                    onClick={() => copyToClipboard(brief.pitchAngle, 'pitch-full')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-violet-500/25"
                  >
                    {copiedField === 'pitch-full' ? (
                      <><CheckCircle className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Strategy</>
                    )}
                  </button>
                </div>
                <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-6">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">{brief.pitchAngle}</p>
                </div>
              </div>

              {/* Subject Line */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Mail className="w-6 h-6 text-accent-400" />
                    Optimized Subject Line
                  </h2>
                  <button
                    onClick={() => copyToClipboard(brief.subjectLine, 'subject-full')}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-lg transition-colors font-medium"
                  >
                    {copiedField === 'subject-full' ? (
                      <><CheckCircle className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Subject</>
                    )}
                  </button>
                </div>
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-6">
                  <p className="text-gray-300 font-semibold text-xl">"{brief.subjectLine}"</p>
                </div>
              </div>

              {/* Intelligence Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Live News Intelligence */}
                {brief.news && brief.news.length > 0 && (
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Newspaper className="w-5 h-5 text-green-400" />
                      Live News Intelligence
                      <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        {brief.news.length} sources
                      </span>
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {brief.news.map((newsItem, index) => (
                        <NewsCard key={index} news={newsItem} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Hiring Intelligence */}
                {brief.jobSignals && brief.jobSignals.length > 0 && (
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      Hiring Intelligence
                      <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {brief.jobSignals.length} positions
                      </span>
                    </h3>
                    <HiringChart jobSignals={brief.jobSignals} />
                  </div>
                )}
              </div>

              {/* Technology Stack Analysis */}
              {brief.techStack && brief.techStack.length > 0 && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Code className="w-5 h-5 text-purple-400" />
                    Technology Stack Analysis
                    <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                      {brief.techStack.length} detected
                    </span>
                  </h3>
                  <TechStackGrid 
                    techStack={brief.techStack} 
                    techStackData={brief.techStackData}
                  />
                </div>
              )}

              {/* Strategic Warnings */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Strategic Warnings - What NOT to Pitch
                </h2>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                  <p className="text-gray-300 leading-relaxed text-lg">{brief.whatNotToPitch}</p>
                </div>
              </div>

              {/* User Intent Context */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary-400" />
                  Your Original Intent
                </h3>
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-400 italic text-lg">"{brief.userIntent}"</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}