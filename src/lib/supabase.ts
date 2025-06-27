import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Brief = {
  id: string
  companyName: string
  website?: string
  userIntent: string
  summary: string
  news: NewsItem[]
  techStack: string[]
  pitchAngle: string
  subjectLine: string
  whatNotToPitch: string
  signalTag: string
  createdAt: string
  jobSignals?: JobSignal[]
  techStackData?: TechStackItem[]
  intelligenceSources?: IntelligenceSources
  companyLogo?: string
  hiringTrends?: string
  newsTrends?: string
}

export type NewsItem = {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sourceFavicon?: string
}

export type JobSignal = {
  title: string
  company: string
  location: string
  postedDate: string
  description: string
  salary?: string
}

export type TechStackItem = {
  name: string
  confidence: 'High' | 'Medium' | 'Low'
  source: string
  category: string
  firstDetected?: string
}

export type IntelligenceSources = {
  news: number
  jobs: number
  technologies: number
  builtWithUsed: boolean
}

export type CreateBriefRequest = {
  companyName: string
  website?: string
  userIntent: string
}

// Database operations with proper column names
export const briefsService = {
  async getAll(): Promise<Brief[]> {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Brief | null> {
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  async create(brief: Omit<Brief, 'id' | 'createdAt'>): Promise<Brief> {
    const { data, error } = await supabase
      .from('briefs')
      .insert({
        companyName: brief.companyName,
        website: brief.website,
        userIntent: brief.userIntent,
        summary: brief.summary,
        news: brief.news,
        techStack: brief.techStack,
        pitchAngle: brief.pitchAngle,
        subjectLine: brief.subjectLine,
        whatNotToPitch: brief.whatNotToPitch,
        signalTag: brief.signalTag,
        jobSignals: brief.jobSignals,
        techStackData: brief.techStackData,
        intelligenceSources: brief.intelligenceSources,
        companyLogo: brief.companyLogo,
        hiringTrends: brief.hiringTrends,
        newsTrends: brief.newsTrends
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Brief>): Promise<Brief> {
    const { data, error } = await supabase
      .from('briefs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('briefs')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}