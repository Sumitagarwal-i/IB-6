import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Target, TrendingUp, Users, Building, ArrowRight, Sparkles, Globe, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced LLM analysis using Groq to generate strategic insights from real company data'
    },
    {
      icon: Zap,
      title: 'Real-Time Intelligence',
      description: 'Live news feeds, tech stack detection, and hiring signals from multiple data sources'
    },
    {
      icon: Target,
      title: 'Personalized Strategy',
      description: 'Tailored pitch recommendations based on your specific intent and market positioning'
    }
  ]

  const useCases = [
    {
      icon: Users,
      title: 'Founders',
      description: 'Research potential customers and partners with deep market intelligence and competitive analysis',
      color: 'from-blue-500 to-cyan-500',
      stats: '10x faster research'
    },
    {
      icon: TrendingUp,
      title: 'Sales Teams',
      description: 'Generate targeted outreach strategies with data-driven insights and personalized messaging',
      color: 'from-green-500 to-emerald-500',
      stats: '3x higher response rates'
    },
    {
      icon: Building,
      title: 'Agencies',
      description: 'Create compelling proposals with comprehensive company analysis and strategic recommendations',
      color: 'from-purple-500 to-violet-500',
      stats: '50% more wins'
    }
  ]

  const stats = [
    { label: 'Companies Analyzed', value: '10,000+' },
    { label: 'Success Rate', value: '94%' },
    { label: 'Time Saved', value: '15hrs/week' },
    { label: 'Response Rate', value: '+300%' }
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-gray-950/90 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">IntelliBrief</span>
                <div className="text-xs text-primary-400 font-medium">Powered by Groq AI</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/app"
                className="bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-violet-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">Your AI Strategist for Smarter B2B Outreach</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Stop Guessing.
              <span className="block bg-gradient-to-r from-primary-400 via-violet-400 to-accent-400 bg-clip-text text-transparent">
                Start Winning.
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
              Generate strategic pitch briefs with real-time news, tech stack analysis, 
              and AI-powered insights. <strong className="text-white">Backed by real data, powered by Groq.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/app"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
              >
                Generate Your First Brief
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center gap-3 border-2 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg hover:bg-gray-800/50">
                <Globe className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powered by Real Intelligence
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                We don't just summarize - we analyze real data from multiple sources to give you strategic advantages
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Built for Success
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Whether you're closing deals, building partnerships, or winning clients - IntelliBrief gives you the edge
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${useCase.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <useCase.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{useCase.description}</p>
                <div className="inline-flex items-center gap-2 bg-gray-700/50 rounded-full px-4 py-2">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">{useCase.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900/30 via-violet-900/30 to-accent-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-violet-500/10" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Outreach?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join the future of strategic B2B intelligence. Start generating winning briefs in minutes.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
            >
              Start Generating Briefs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">IntelliBrief</span>
                <div className="text-xs text-primary-400">Powered by Groq AI</div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 IntelliBrief. Powered by real intelligence, not just summaries.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}