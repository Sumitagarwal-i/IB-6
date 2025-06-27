import { motion } from 'framer-motion'
import { 
  Building2, 
  Globe, 
  TrendingUp, 
  Users, 
  Code, 
  Newspaper,
  ExternalLink,
  Clock,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react'
import { Brief } from '../lib/supabase'

interface BriefSidebarProps {
  brief: Brief
}

export function BriefSidebar({ brief }: BriefSidebarProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  const hasJobSignals = brief.jobSignals && brief.jobSignals.length > 0
  const hasTechStack = brief.techStack && brief.techStack.length > 0
  const hasNews = brief.news && brief.news.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sticky top-24 h-fit"
    >
      {/* Company Header */}
      <div className="text-center mb-8">
        <div className="relative mx-auto mb-4">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${brief.companyName} logo`}
              className="w-20 h-20 rounded-2xl object-cover bg-gray-800 border border-gray-700 mx-auto shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-20 h-20 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${logoUrl ? 'hidden' : ''}`}>
            <Building2 className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">{brief.companyName}</h1>
        
        {brief.website && (
          <a 
            href={brief.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 flex items-center justify-center gap-2 transition-colors mb-4"
          >
            <Globe className="w-4 h-4" />
            {new URL(brief.website).hostname.replace('www.', '')}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Signal Tag */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border w-full justify-center ${getSignalColor(brief.signalTag)}`}>
            <TrendingUp className="w-4 h-4 mr-2" />
            {brief.signalTag}
          </span>
        </div>
      </div>

      {/* Intelligence Metrics */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          Intelligence Overview
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* News Signals */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <Newspaper className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{hasNews ? brief.news.length : 0}</div>
            <div className="text-xs text-green-300">News Articles</div>
          </div>

          {/* Job Signals */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{hasJobSignals ? brief.jobSignals?.length || 0 : 0}</div>
            <div className="text-xs text-blue-300">Job Postings</div>
          </div>

          {/* Tech Stack */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
            <Code className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{hasTechStack ? brief.techStack.length : 0}</div>
            <div className="text-xs text-purple-300">Technologies</div>
          </div>

          {/* AI Analysis */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">AI</div>
            <div className="text-xs text-orange-300">Powered</div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-white">Key Insights</h3>
        
        {brief.hiringTrends && (
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Hiring Trends</span>
            </div>
            <p className="text-xs text-gray-400">{brief.hiringTrends}</p>
          </div>
        )}

        {brief.newsTrends && (
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">News Sentiment</span>
            </div>
            <p className="text-xs text-gray-400">{brief.newsTrends}</p>
          </div>
        )}

        {hasTechStack && (
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Top Technologies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {brief.techStack.slice(0, 3).map((tech, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
              {brief.techStack.length > 3 && (
                <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                  +{brief.techStack.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Meta Information */}
      <div className="space-y-3 text-sm border-t border-gray-800 pt-6">
        <div className="flex items-center gap-3 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Generated {formatDate(brief.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Real-time data sources</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Analysis by Groq AI</span>
        </div>
      </div>
    </motion.div>
  )
}
