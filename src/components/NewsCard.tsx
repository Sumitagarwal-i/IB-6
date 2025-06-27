
import { motion } from 'framer-motion'
import { ExternalLink, TrendingUp, Clock } from 'lucide-react'
import { NewsItem } from '../lib/supabase'

interface NewsCardProps {
  news: NewsItem
  index: number
}

export function NewsCard({ news, index }: NewsCardProps) {
  const formatNewsDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getSentimentColor = (title: string, description: string) => {
    const text = (title + ' ' + description).toLowerCase()
    const positiveKeywords = ['funding', 'raised', 'growth', 'expansion', 'launch', 'partnership', 'acquisition', 'success', 'revenue', 'profit']
    const negativeKeywords = ['layoffs', 'cuts', 'decline', 'loss', 'controversy', 'investigation', 'lawsuit', 'breach']
    
    const positiveCount = positiveKeywords.filter(keyword => text.includes(keyword)).length
    const negativeCount = negativeKeywords.filter(keyword => text.includes(keyword)).length
    
    if (positiveCount > negativeCount) return 'border-green-500/30 bg-green-500/5'
    if (negativeCount > positiveCount) return 'border-red-500/30 bg-red-500/5'
    return 'border-gray-700 bg-gray-800/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl p-5 border transition-all duration-200 hover:border-gray-600 ${getSentimentColor(news.title, news.description)}`}
    >
      <div className="flex items-start gap-4">
        {/* Source Favicon */}
        <div className="flex-shrink-0 mt-1">
          {news.sourceFavicon ? (
            <img 
              src={news.sourceFavicon} 
              alt={`${news.source} favicon`}
              className="w-6 h-6 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center ${news.sourceFavicon ? 'hidden' : ''}`}>
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-semibold text-white mb-2 line-clamp-2 leading-snug hover:text-primary-300 transition-colors">
            {news.title}
          </h4>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {news.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="font-medium text-gray-400">{news.source}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatNewsDate(news.publishedAt)}</span>
              </div>
            </div>
            
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs font-medium transition-colors hover:underline"
            >
              Read article
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
