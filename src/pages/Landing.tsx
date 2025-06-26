import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Target, TrendingUp, Users, Building, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced LLM analysis using Groq to generate strategic insights'
    },
    {
      icon: Zap,
      title: 'Real-Time Data',
      description: 'Live news, tech stack detection, and hiring signals'
    },
    {
      icon: Target,
      title: 'Personalized Pitches',
      description: 'Tailored recommendations based on your specific intent'
    }
  ]

  const useCases = [
    {
      icon: Users,
      title: 'Founders',
      description: 'Research potential customers and partners with deep market intelligence',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Sales Teams',
      description: 'Generate targeted outreach strategies with data-driven insights',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Building,
      title: 'Agencies',
      description: 'Create compelling proposals with comprehensive company analysis',
      color: 'from-purple-500 to-violet-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">IntelliBrief</span>
            </div>
            <Link
              to="/app"
              className="bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered
              <span className="block bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                B2B Strategy Assistant
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Generate strategic pitch briefs with real-time news, tech stack analysis, 
              and AI-powered insights. Perfect for founders, sales teams, and agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg"
              >
                Generate Your First Brief
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Real Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We don't just summarize - we analyze real data to give you strategic advantages
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Success
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Whether you're closing deals, building partnerships, or winning clients
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-gray-600 transition-colors"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <useCase.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900/50 to-violet-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Outreach?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of strategic B2B intelligence
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg"
          >
            Start Generating Briefs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">IntelliBrief</span>
          </div>
          <p className="text-gray-400">
            © 2024 IntelliBrief. Powered by real intelligence, not just summaries.
          </p>
        </div>
      </footer>
    </div>
  )
}