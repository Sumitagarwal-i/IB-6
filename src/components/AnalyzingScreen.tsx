import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Newspaper, Code, TrendingUp, Brain, Satellite, Database } from 'lucide-react'
import { LoadingStepIndicator } from './LoadingStepIndicator'

interface AnalyzingScreenProps {
  companyName: string
  website?: string
}

const analysisSteps = [
  {
    id: 'scanning',
    icon: Search,
    message: `Scanning company profile and extracting metadata...`,
    duration: 2500
  },
  {
    id: 'news',
    icon: Newspaper,
    message: 'Fetching real-time headlines from NewsData.io...',
    duration: 3500
  },
  {
    id: 'jobs',
    icon: TrendingUp,
    message: 'Analyzing hiring signals from JSearch API...',
    duration: 3000
  },
  {
    id: 'tech',
    icon: Code,
    message: 'Detecting technology stack from job postings...',
    duration: 2500
  },
  {
    id: 'intelligence',
    icon: Database,
    message: 'Cross-referencing market intelligence signals...',
    duration: 2000
  },
  {
    id: 'ai',
    icon: Brain,
    message: 'Groq LLaMA-3 generating strategic insights...',
    duration: 4500
  }
]

export function AnalyzingScreen({ companyName, website }: AnalyzingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < analysisSteps.length - 1) {
        setCompletedSteps(prev => new Set([...prev, currentStep]))
        setCurrentStep(prev => prev + 1)
      } else {
        setCompletedSteps(prev => new Set([...prev, currentStep]))
      }
    }, analysisSteps[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep])

  const steps = analysisSteps.map((step, index) => ({
    ...step,
    isActive: index === currentStep,
    isCompleted: completedSteps.has(index),
    message: step.id === 'scanning' && website 
      ? `Scanning ${new URL(website).hostname} and extracting metadata...`
      : step.message
  }))

  const currentProgress = ((completedSteps.size + (currentStep < analysisSteps.length - 1 ? 0.5 : 1)) / analysisSteps.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950/95 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="max-w-2xl w-full mx-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900/90 backdrop-blur border border-gray-800 rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/25"
            >
              <Satellite className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h3 
              className="text-2xl font-bold text-white mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Analyzing {companyName}
            </motion.h3>
            
            <p className="text-gray-400 mb-4">
              {website ? `Investigating ${new URL(website).hostname}` : 'Gathering intelligence from multiple data sources'}
            </p>
            
            <motion.div
              className="flex items-center justify-center gap-2 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-3 py-1">
                <Brain className="w-4 h-4 text-primary-400" />
                <span className="text-primary-300 font-medium">Powered by Groq LLaMA-3</span>
              </div>
            </motion.div>
          </div>

          {/* Real-time Intelligence Sources */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <Newspaper className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-green-300 font-medium">NewsData.io</div>
                <div className="text-xs text-gray-400">Live Headlines</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-blue-300 font-medium">JSearch API</div>
                <div className="text-xs text-gray-400">Hiring Signals</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <Search className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-purple-300 font-medium">Clearbit</div>
                <div className="text-xs text-gray-400">Company Data</div>
              </div>
            </div>
          </div>

          {/* Loading Steps */}
          <LoadingStepIndicator steps={steps} currentProgress={currentProgress} />

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Analyzing real-time data from multiple intelligence sources
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data processing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
