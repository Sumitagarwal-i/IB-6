import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Building2, 
  Copy, 
  ExternalLink, 
  Newspaper, 
  Code, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Mail,
  Globe,
  Clock,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'
import { Brief } from '../lib/supabase'

interface BriefModalProps {
  brief: Brief | null
  isOpen: boolean
  onClose: () => void
}

export function BriefModal({ brief, isOpen, onClose }: BriefModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

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
      month: 'short',
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

  const getSignalColor = (tag: string) => {
    const lowerTag = tag.toLowerCase()
    if (lowerTag.includes('hiring') || lowerTag.includes('talent')) return 'bg-green-500/20 text-green-300 border-green-500/30'
    if (lowerTag.includes('funding') || lowerTag.includes('series') || lowerTag.includes('raised')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    if (lowerTag.includes('growth') || lowerTag.includes('scaling')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    if (lowerTag.includes('launch') || lowerTag.includes('product')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    return 'bg-primary-500/20 text-primary-300 border-primary-500/30'
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

  if (!brief) return null

  const logoUrl = getCompanyLogo(brief.website)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={`${brief.companyName} logo`}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-800 border border-gray-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-16 h-16 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center ${logoUrl ? 'hidden' : ''}`}>
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{brief.companyName}</h2>
                  {brief.website && (
                    <a 
                      href={brief.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 mt-1 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      {new URL(brief.website).hostname.replace('www.', '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(brief.createdAt)}
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border ${getSignalColor(brief.signalTag)}`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {brief.signalTag}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-8">
                {/* Executive Summary */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-400" />
                    Strategic Intelligence Summary
                  </h3>
                  <div className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-xl p-6">
                    <p className="text-gray-300 leading-relaxed text-lg">{brief.summary}</p>
                  </div>
                </div>

                {/* Strategic Pitch Angle */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-violet-400" />
                      Personalized Pitch Strategy
                    </h3>
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
                </div>

                {/* Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-accent-400" />
                      Ready-to-Use Subject Line
                    </h3>
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
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Real News Intelligence */}
                  {brief.news && brief.news.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-green-400" />
                        Live News Intelligence
                        <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          {brief.news.length} sources
                        </span>
                      </h3>
                      <div className="space-y-4">
                        {brief.news.slice(0, 4).map((item, index) => (
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

                  {/* Tech Stack Analysis */}
                  {brief.techStack && brief.techStack.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        Technology Stack Analysis
                        <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                          {brief.techStack.length} detected
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {brief.techStack.map((tech, index) => (
                          <div 
                            key={index}
                            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center"
                          >
                            <span className="text-blue-300 font-medium text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          Analysis based on job postings, news mentions, and industry patterns
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* What Not to Pitch */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Strategic Warnings - What NOT to Pitch
                  </h3>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                    <p className="text-gray-300 leading-relaxed text-lg">{brief.whatNotToPitch}</p>
                  </div>
                </div>

                {/* User Intent Context */}
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-400" />
                    Your Original Intent
                  </h4>
                  <p className="text-gray-400 italic">"{brief.userIntent}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
