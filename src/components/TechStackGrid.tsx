import { motion } from 'framer-motion'
import { Code, Shield } from 'lucide-react'
import { TechStackItem } from '../lib/supabase'

interface TechStackGridProps {
  techStack: TechStackItem[]
}

export function TechStackGrid({ techStack }: TechStackGridProps) {
  if (!techStack || techStack.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700">
        <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Tech Stack Data Available</h3>
        <p className="text-gray-500 text-sm">No technologies detected for this company</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {techStack.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <span className="text-gray-300 font-medium text-sm">{tech.name}</span>
            {/* <div className="text-xs text-gray-500 mt-1">{tech.category}</div> */}
          </motion.div>
        ))}
      </div>
      <div className="p-3 bg-gray-800/30 rounded-lg">
        <p className="text-xs text-gray-400 flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Analysis based on job postings, news mentions, and industry patterns
        </p>
      </div>
    </div>
  )
}
