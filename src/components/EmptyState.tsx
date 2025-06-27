
import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        No briefs generated yet
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Create your first strategic brief to get AI-powered insights for your B2B outreach
      </p>
      
      <motion.button
        onClick={onCreateNew}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
      >
        Create Your First Brief
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}
