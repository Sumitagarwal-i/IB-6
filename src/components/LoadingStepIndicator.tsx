
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface LoadingStep {
  id: string
  icon: LucideIcon
  message: string
  isActive: boolean
  isCompleted: boolean
}

interface LoadingStepIndicatorProps {
  steps: LoadingStep[]
  currentProgress: number
}

export function LoadingStepIndicator({ steps, currentProgress }: LoadingStepIndicatorProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon
        
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              step.isActive ? 'bg-primary-500/20 border border-primary-500/30 shadow-lg shadow-primary-500/10' : 
              step.isCompleted ? 'bg-green-500/20 border border-green-500/30' : 
              'bg-gray-800/50 border border-gray-700'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              step.isCompleted ? 'bg-green-500 scale-110' : 
              step.isActive ? 'bg-primary-500 scale-110' : 
              'bg-gray-700'
            }`}>
              <Icon className={`w-4 h-4 transition-all duration-300 ${
                step.isActive ? 'text-white animate-pulse' : 
                step.isCompleted ? 'text-white' :
                'text-gray-400'
              }`} />
            </div>
            
            <div className="flex-1">
              <span className={`text-sm font-medium transition-colors duration-300 ${
                step.isActive ? 'text-white' : 
                step.isCompleted ? 'text-green-400' : 
                'text-gray-400'
              }`}>
                {step.message}
              </span>
            </div>
            
            {step.isActive && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"
              />
            )}
            
            {step.isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-3 h-3"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-violet-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2 text-center">
          {Math.round(currentProgress)}% complete
        </p>
      </div>
    </div>
  )
}
