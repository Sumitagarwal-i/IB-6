
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Zap, CheckCircle } from 'lucide-react'

interface RetryBriefButtonProps {
  briefId: string
  onRetry: (briefId: string) => Promise<void>
}

export function RetryBriefButton({ briefId, onRetry }: RetryBriefButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry(briefId)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to retry brief:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <motion.button
      onClick={handleRetry}
      disabled={isRetrying}
      whileHover={{ scale: isRetrying ? 1 : 1.05 }}
      whileTap={{ scale: isRetrying ? 1 : 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isSuccess 
          ? 'bg-green-600 text-white' 
          : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
    >
      {isSuccess ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Brief Updated!
        </>
      ) : (
        <>
          {isRetrying ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isRetrying ? 'Improving Brief...' : 'Improve This Brief'}
        </>
      )}
    </motion.button>
  )
}
