import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Newspaper, Code, TrendingUp, Brain, CheckCircle } from 'lucide-react'

interface AnalyzingScreenProps {
  companyName: string
  website?: string
}

const analysisSteps = [
  {
    id: 'scanning',
    icon: Search,
    message: 'Scanning company profile...',
    duration: 2000
  },
  {
    id: 'news',
    icon: Newspaper,
    message: 'Fetching latest headlines from NewsData...',
    duration: 3000
  },
  {
    id: 'tech',
    icon: Code,
    message: 'Analyzing tech stack and infrastructure...',
    duration: 2500
  },
  {
    id: 'jobs',
    icon: TrendingUp,
    message: 'Checking hiring signals from JSearch...',
    duration: 2000
  },
  {
    id: 'ai',
    icon: Brain,
    message: 'Groq AI generating strategic insights...',
    duration: 4000
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950/95 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="max-w-lg w-full mx-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900/90 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center"
        >
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Analyzing {companyName}
            </h3>
            <p className="text-gray-400 text-sm">
              {website ? `Investigating ${website}` : 'Gathering intelligence from multiple sources'}
            </p>
          </div>

          <div className="space-y-4">
            {analysisSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = completedSteps.has(index)
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary-500/20 border border-primary-500/30' : 
                    isCompleted ? 'bg-green-500/20 border border-green-500/30' : 
                    'bg-gray-800/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : 
                    isActive ? 'bg-primary-500' : 
                    'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white animate-pulse' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isActive ? 'text-white font-medium' : 
                    isCompleted ? 'text-green-400' : 
                    'text-gray-400'
                  }`}>
                    {step.message.replace('{{website}}', website || companyName)}
                  </span>
                  {isActive && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full ml-auto"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-violet-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((completedSteps.size + (currentStep < analysisSteps.length - 1 ? 0.5 : 1)) / analysisSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {Math.round(((completedSteps.size + (currentStep < analysisSteps.length - 1 ? 0.5 : 1)) / analysisSteps.length) * 100)}% complete
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}