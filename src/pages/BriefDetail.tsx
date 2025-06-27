
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Copy, 
  CheckCircle, 
  Newspaper,
  Code,
  Target,
  AlertTriangle,
  Mail,
  Brain,
  Users,
  Sparkles
} from 'lucide-react'
import { Brief, briefsService } from '../lib/supabase'
import { BriefSidebar } from '../components/BriefSidebar'
import { NewsCard } from '../components/NewsCard'
import { HiringChart } from '../components/HiringChart'
import { RetryBriefButton } from '../components/RetryBriefButton'

export function BriefDetail() {
  const { id } = useParams<{ id: string }>()
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadBrief(id)
    }
  }, [id])

  const loadBrief = async (briefId: string) => {
    try {
      setLoading(true)
      const briefData = await briefsService.getById(briefId)
      setBrief(briefData)
    } catch (error) {
      console.error('Error loading brief:', error)
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
    // Implement retry logic here
    console.log('Retrying brief:', briefId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Brief Not Found</h1>
            <Link to="/app" className="text-primary-400 hover:text-primary-300">
              ← Back to Briefs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/app"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Briefs
          </Link>
          
          <div className="flex items-center gap-4">
            <RetryBriefButton briefId={brief.id} onRetry={handleRetryBrief} />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <BriefSidebar brief={brief} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
            {/* Strategic Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Brain className="w-6 h-6 text-primary-400" />
                  Strategic Intelligence Summary
                </h2>
              </div>
              <div className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed text-lg">{brief.summary}</p>
              </div>
            </motion.div>

            {/* Pitch Strategy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Target className="w-6 h-6 text-violet-400" />
                  Personalized Pitch Strategy
                </h2>
                <button
                  onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-violet-500/25"
                >
                  {copiedField === 'pitch' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Pitch</>
                  )}
                </button>
              </div>
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">{brief.pitchAngle}</p>
              </div>
            </motion.div>

            {/* Subject Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Mail className="w-6 h-6 text-accent-400" />
                  Ready-to-Use Subject Line
                </h2>
                <button
                  onClick={() => copyToClipboard(brief.subjectLine, 'subject')}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-lg transition-colors font-medium"
                >
                  {copiedField === 'subject' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Subject</>
                  )}
                </button>
              </div>
              <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-6">
                <p className="text-gray-300 font-semibold text-lg">"{brief.subjectLine}"</p>
              </div>
            </motion.div>

            {/* What NOT to Pitch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Strategic Warnings - What NOT to Pitch
              </h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed text-lg">{brief.whatNotToPitch}</p>
              </div>
            </motion.div>

            {/* News Intelligence */}
            {brief.news && brief.news.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Newspaper className="w-6 h-6 text-green-400" />
                  Live News Intelligence
                  <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                    {brief.news.length} sources
                  </span>
                </h2>
                <div className="space-y-4">
                  {brief.news.map((newsItem, index) => (
                    <NewsCard key={index} news={newsItem} index={index} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hiring Intelligence */}
            {brief.jobSignals && brief.jobSignals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  Hiring Intelligence
                  <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                    {brief.jobSignals.length} positions
                  </span>
                </h2>
                <HiringChart jobSignals={brief.jobSignals} />
              </motion.div>
            )}

            {/* Tech Stack */}
            {brief.techStack && brief.techStack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="w-6 h-6 text-purple-400" />
                  Technology Stack Analysis
                  <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                    {brief.techStack.length} detected
                  </span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brief.techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center hover:bg-purple-500/20 transition-colors"
                    >
                      <span className="text-purple-300 font-medium">{tech}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* User Intent Context */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-400" />
                Your Original Intent
              </h3>
              <p className="text-gray-400 italic">"{brief.userIntent}"</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
