import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Newspaper, 
  Code, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Mail
} from 'lucide-react'
import { Brief } from '../lib/supabase'

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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{brief.companyName}</h3>
              {brief.website && (
                <a 
                  href={brief.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 mt-1"
                >
                  Visit website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(brief.createdAt)}
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-300 rounded-full">
                {brief.signalTag}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-400" />
            Executive Summary
          </h4>
          <p className="text-gray-300 leading-relaxed">{brief.summary}</p>
        </div>

        {/* Strategic Pitch Angle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              Strategic Pitch Angle
            </h4>
            <button
              onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
            >
              {copiedField === 'pitch' ? (
                <><CheckCircle className="w-3 h-3" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Copy Pitch</>
              )}
            </button>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">{brief.pitchAngle}</p>
          </div>
        </div>

        {/* Subject Line */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent-400" />
              Suggested Subject Line
            </h4>
            <button
              onClick={() => copyToClipboard(brief.subjectLine, 'subject')}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
            >
              {copiedField === 'subject' ? (
                <><CheckCircle className="w-3 h-3" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Copy Subject</>
              )}
            </button>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300 font-medium">{brief.subjectLine}</p>
          </div>
        </div>

        {/* News Headlines */}
        {brief.news && brief.news.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-green-400" />
              Recent News
            </h4>
            <div className="space-y-3">
              {brief.news.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <h5 className="font-medium text-white mb-2">{item.title}</h5>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1"
                    >
                      Read more <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {brief.techStack && brief.techStack.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {brief.techStack.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* What Not to Pitch */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            What NOT to Pitch
          </h4>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">{brief.whatNotToPitch}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}