
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, TrendingUp, Target, Zap, ArrowRight, Sparkles, Building2 } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold">StrategicAI</span>
          </div>
          <Link 
            to="/app"
            className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-violet-400 bg-clip-text text-transparent">
              AI-Powered B2B Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Generate personalized strategic briefs with real-time company intelligence. 
              Transform your outreach with AI-driven insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Link
              to="/app"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-primary-500/25 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Create Your First Brief
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-200">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">Real-Time Intelligence</h3>
              <p className="text-gray-400">
                Live news feeds, hiring signals, and market intelligence to stay ahead of the competition.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-200">
              <Target className="w-12 h-12 text-violet-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">Personalized Strategies</h3>
              <p className="text-gray-400">
                AI-crafted pitch angles and subject lines tailored to each company's unique context.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-200">
              <Building2 className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">Tech Stack Analysis</h3>
              <p className="text-gray-400">
                Deep technology profiling to understand exactly what tools and platforms they use.
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your B2B Outreach?</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Join forward-thinking sales teams using AI intelligence to close more deals.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 rounded-lg font-medium transition-all duration-200"
            >
              <Zap className="w-5 h-5" />
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
