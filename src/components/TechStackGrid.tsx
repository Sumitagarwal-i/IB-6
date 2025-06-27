import React from 'react'
import { motion } from 'framer-motion'
import { Code, Database, Cloud, Smartphone, Globe, Cpu, Shield, Zap } from 'lucide-react'

interface TechStackGridProps {
  techStack: string[]
  techStackData?: any[]
}

export function TechStackGrid({ techStack, techStackData }: TechStackGridProps) {
  const getTechIcon = (tech: string) => {
    const lowerTech = tech.toLowerCase()
    
    if (lowerTech.includes('react') || lowerTech.includes('vue') || lowerTech.includes('angular')) return Globe
    if (lowerTech.includes('node') || lowerTech.includes('python') || lowerTech.includes('java')) return Code
    if (lowerTech.includes('aws') || lowerTech.includes('azure') || lowerTech.includes('gcp')) return Cloud
    if (lowerTech.includes('postgres') || lowerTech.includes('mongo') || lowerTech.includes('redis')) return Database
    if (lowerTech.includes('docker') || lowerTech.includes('kubernetes')) return Cpu
    if (lowerTech.includes('mobile') || lowerTech.includes('ios') || lowerTech.includes('android')) return Smartphone
    if (lowerTech.includes('security') || lowerTech.includes('auth')) return Shield
    
    return Zap
  }

  const getTechCategory = (tech: string) => {
    const lowerTech = tech.toLowerCase()
    
    if (lowerTech.includes('react') || lowerTech.includes('vue') || lowerTech.includes('angular') || lowerTech.includes('frontend')) return 'Frontend'
    if (lowerTech.includes('node') || lowerTech.includes('python') || lowerTech.includes('java') || lowerTech.includes('backend')) return 'Backend'
    if (lowerTech.includes('aws') || lowerTech.includes('azure') || lowerTech.includes('gcp') || lowerTech.includes('cloud')) return 'Cloud'
    if (lowerTech.includes('postgres') || lowerTech.includes('mongo') || lowerTech.includes('redis') || lowerTech.includes('database')) return 'Database'
    if (lowerTech.includes('docker') || lowerTech.includes('kubernetes') || lowerTech.includes('devops')) return 'DevOps'
    if (lowerTech.includes('mobile') || lowerTech.includes('ios') || lowerTech.includes('android')) return 'Mobile'
    if (lowerTech.includes('ai') || lowerTech.includes('ml') || lowerTech.includes('tensorflow')) return 'AI/ML'
    
    return 'Other'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'Backend': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Cloud': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'Database': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'DevOps': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Mobile': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
      case 'AI/ML': return 'bg-violet-500/20 text-violet-300 border-violet-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  // Group technologies by category
  const groupedTech = techStack.reduce((acc, tech) => {
    const category = getTechCategory(tech)
    if (!acc[category]) acc[category] = []
    acc[category].push(tech)
    return acc
  }, {} as Record<string, string[]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedTech).map(([category, technologies], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(category).split(' ')[0]}`} />
            {category} ({technologies.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {technologies.map((tech, index) => {
              const Icon = getTechIcon(tech)
              const category = getTechCategory(tech)
              
              return (
                <motion.div
                  key={`${tech}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-lg border text-center transition-all duration-200 hover:shadow-lg ${getCategoryColor(category)}`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium text-sm">{tech}</div>
                  
                  {/* Show confidence if available from techStackData */}
                  {techStackData && techStackData.find(t => t.name === tech) && (
                    <div className="text-xs opacity-75 mt-1">
                      {techStackData.find(t => t.name === tech)?.confidence} confidence
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ))}

      {/* Tech Stack Summary */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-gray-300">Technology Analysis</span>
        </div>
        <p className="text-xs text-gray-400">
          Stack analysis based on {techStackData ? 'BuiltWith API, ' : ''}job postings, news mentions, and industry patterns. 
          {techStack.length} technologies detected across {Object.keys(groupedTech).length} categories.
        </p>
      </div>
    </div>
  )
}