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
  DollarSign
} from 'lucide-react'
import { Brief, briefsService } from '../lib/supabase'

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatNewsDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getCompanyLogo = (website?: string) => {
    if (!website) return null
    try {
      const domain = new URL(website).hostname.replace('www.', '')
      return `https://logo.clearbit.com/${domain}`
    } catch {
      return null
    }
  }

  const getSignalColor = (tag: string) => {
    const lowerTag = tag.toLowerCase()
    if (lowerTag.includes('hiring') || lowerTag.includes('talent')) return 'bg-green-500/20 text-green-300 border-green-500/30'
    if (lowerTag.includes('funding') || lowerTag.includes('series') || lowerTag.includes('raised')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    if (lowerTag.includes('growth') || lowerTag.includes('scaling')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    if (lowerTag.includes('launch') || lowerTag.includes('product')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    return 'bg-primary-500/20 text-primary-300 border-primary-500/30'
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

  const logoUrl = getCompanyLogo(brief.website)

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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">IntelliBrief</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sticky top-24"
            >
              {/* Company Header */}
              <div className="text-center mb-6">
                <div className="relative mx-auto mb-4">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={`${brief.companyName} logo`}
                      className="w-20 h-20 rounded-2xl object-cover bg-gray-800 border border-gray-700 mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-20 h-20 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto ${logoUrl ? 'hidden' : ''}`}>
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-2">{brief.companyName}</h1>
                
                {brief.website && (
                  <a 
                    href={brief.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {new URL(brief.website).hostname.replace('www.', '')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Signal Tag */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border w-full justify-center ${getSignalColor(brief.signalTag)}`}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {brief.signalTag}
                </span>
              </div>

              {/* Meta Information */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Generated {formatDate(brief.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <BarChart3 className="w-4 h-4" />
                  <span>{brief.news?.length || 0} news sources analyzed</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <Code className="w-4 h-4" />
                  <span>{brief.techStack?.length || 0} technologies detected</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-violet-500/25"
                >
                  {copiedField === 'pitch' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied Pitch!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Full Pitch</>
                  )}
                </button>
                
                <button
                  onClick={() => copyToClipboard(brief.subjectLine, 'subject')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-lg transition-colors font-medium"
                >
                  {copiedField === 'subject' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Mail className="w-4 h-4" /> Copy Subject Line</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Strategic Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Executive Summary */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary-400" />
                  Strategic Intelligence Summary
                </h2>
                <div className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-xl p-6">
                  <p className="text-gray-300 leading-relaxed text-lg">{brief.summary}</p>
                </div>
              </div>

              {/* Personalized Pitch Strategy */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Target className="w-6 h-6 text-violet-400" />
                    Personalized Pitch Strategy
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
                    Ready-to-Use Subject Line
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
              <div className="grid md:grid-cols-2 gap-8">
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
                    <div className="space-y-4">
                      {brief.news.slice(0, 5).map((item, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                          <div className="flex items-start gap-3">
                            {item.sourceFavicon && (
                              <img 
                                src={item.sourceFavicon} 
                                alt={`${item.source} favicon`}
                                className="w-5 h-5 rounded mt-0.5 flex-shrink-0"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white mb-2 line-clamp-2 leading-snug">{item.title}</h4>
                              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="font-medium">{item.source}</span>
                                  <span>•</span>
                                  <span>{formatNewsDate(item.publishedAt)}</span>
                                </div>
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1 font-medium transition-colors"
                                >
                                  Read source <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technology Stack Analysis */}
                {brief.techStack && brief.techStack.length > 0 && (
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Code className="w-5 h-5 text-blue-400" />
                      Technology Stack Analysis
                      <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {brief.techStack.length} detected
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {brief.techStack.map((tech, index) => (
                        <div 
                          key={index}
                          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center"
                        >
                          <span className="text-blue-300 font-medium text-sm">{tech}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-lg">
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Analysis based on BuiltWith API, job postings, and industry patterns
                      </p>
                    </div>
                  </div>
                )}
              </div>

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