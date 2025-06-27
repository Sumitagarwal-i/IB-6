
import { motion } from 'framer-motion'
import { Users, MapPin, DollarSign, TrendingUp, Briefcase, Calendar } from 'lucide-react'
import { JobSignal } from '../lib/supabase'

interface HiringChartProps {
  jobSignals: JobSignal[]
}

export function HiringChart({ jobSignals }: HiringChartProps) {
  if (!jobSignals || jobSignals.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700">
        <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Hiring Data Available</h3>
        <p className="text-gray-500 text-sm">No recent job postings detected for this company</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Analyze job patterns
  const roleAnalysis = jobSignals.reduce((acc, job) => {
    const title = job.title.toLowerCase()
    let category = 'Other'
    
    if (title.includes('engineer') || title.includes('developer') || title.includes('architect')) category = 'Engineering'
    else if (title.includes('data') || title.includes('ai') || title.includes('ml')) category = 'Data/AI'
    else if (title.includes('product') || title.includes('pm')) category = 'Product'
    else if (title.includes('sales') || title.includes('account')) category = 'Sales'
    else if (title.includes('marketing') || title.includes('growth')) category = 'Marketing'
    else if (title.includes('design') || title.includes('ux') || title.includes('ui')) category = 'Design'
    else if (title.includes('devops') || title.includes('sre') || title.includes('infrastructure')) category = 'DevOps'
    
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const locationAnalysis = jobSignals.reduce((acc, job) => {
    const location = job.location.split(',')[0].trim()
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topRoles = Object.entries(roleAnalysis).sort(([,a], [,b]) => b - a).slice(0, 5)
  const topLocations = Object.entries(locationAnalysis).sort(([,a], [,b]) => b - a).slice(0, 3)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Engineering': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'Data/AI': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'Product': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Sales': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'Marketing': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
      case 'Design': return 'bg-violet-500/20 text-violet-300 border-violet-500/30'
      case 'DevOps': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Hiring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
          <Briefcase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{jobSignals.length}</div>
          <div className="text-sm text-blue-300">Open Positions</div>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{topRoles.length}</div>
          <div className="text-sm text-green-300">Departments</div>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
          <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{topLocations.length}</div>
          <div className="text-sm text-purple-300">Locations</div>
        </div>
      </div>

      {/* Role Distribution */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Hiring by Department
        </h4>
        <div className="space-y-3">
          {topRoles.map(([role, count], index) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${getCategoryColor(role)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{role}</span>
                <span className="text-sm opacity-75">{count} position{count > 1 ? 's' : ''}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="h-2 rounded-full bg-current opacity-50"
                  style={{ width: `${(count / jobSignals.length) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Job Postings */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          Recent Postings
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {jobSignals.slice(0, 5).map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-white line-clamp-1">{job.title}</h5>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {formatDate(job.postedDate)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
              
              {job.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {job.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Location Distribution */}
      {topLocations.length > 1 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Top Locations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topLocations.map(([location, count], index) => (
              <motion.div
                key={location}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center"
              >
                <div className="font-medium text-purple-300">{location}</div>
                <div className="text-sm text-purple-400">{count} position{count > 1 ? 's' : ''}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
