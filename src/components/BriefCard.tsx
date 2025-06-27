import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  Globe,
  Newspaper,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react'
import { Brief } from '../lib/supabase'
import { Link } from 'react-router-dom'

interface BriefCardProps {
  brief: Brief
}

export function BriefCard({ brief }: BriefCardProps) {
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
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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

  const logoUrl = getCompanyLogo(brief.website)
  const hasRecentNews = brief.news && brief.news.length > 0
  const recentNewsCount = hasRecentNews ? brief.news.length : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/5"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${brief.companyName} logo`}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-800 border border-gray-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <div className={`w-14 h-14 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center ${logoUrl ? 'hidden' : ''}`}>
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{brief.companyName}</h3>
              {brief.website && (
                <a 
                  href={brief.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  {new URL(brief.website).hostname.replace('www.', '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
              <Clock className="w-4 h-4" />
              {formatDate(brief.createdAt)}
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border ${getSignalColor(brief.signalTag)}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {brief.signalTag}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Executive Summary */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Strategic Summary
          </h4>
          <p className="text-gray-300 leading-relaxed line-clamp-3">{brief.summary}</p>
        </div>

        {/* Intelligence Signals */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* News Signals */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-gray-400">News Signals</span>
            </div>
            <div className="text-sm text-white font-medium">
              {recentNewsCount > 0 ? `${recentNewsCount} recent headlines` : 'No recent news'}
            </div>
            {hasRecentNews && (
              <div className="text-xs text-gray-400 mt-1">
                Latest: {brief.news[0].source}
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-400">Tech Stack</span>
            </div>
            <div className="text-sm text-white font-medium">
              {brief.techStack && brief.techStack.length > 0 ? `${brief.techStack.length} technologies` : 'Stack detected'}
            </div>
            {brief.techStack && brief.techStack.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                {brief.techStack.slice(0, 2).join(', ')}
                {brief.techStack.length > 2 && ` +${brief.techStack.length - 2} more`}
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack Preview */}
        {brief.techStack && brief.techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Detected Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {brief.techStack.slice(0, 5).map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {brief.techStack.length > 5 && (
                <span className="px-3 py-1 bg-gray-700/50 border border-gray-600 text-gray-400 rounded-lg text-xs">
                  +{brief.techStack.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 font-medium text-sm flex-1 shadow-lg hover:shadow-violet-500/25"
          >
            {copiedField === 'pitch' ? (
              <><CheckCircle className="w-4 h-4" /> Copied Pitch!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Pitch</>
            )}
          </button>
          <Link
            to={`/brief/${brief.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-medium text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            Full Brief
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
