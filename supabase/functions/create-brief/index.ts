const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateBriefRequest {
  companyName: string
  website?: string
  userIntent: string
}

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sourceFavicon?: string
}

interface JobSignal {
  title: string
  company: string
  location: string
  postedDate: string
  description: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { companyName, website, userIntent }: CreateBriefRequest = await req.json()

    // Validate input
    if (!companyName || !userIntent) {
      return new Response(
        JSON.stringify({ error: 'Company name and user intent are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Creating enhanced brief for ${companyName}...`)

    // 1. Fetch company logo/metadata from Clearbit
    let companyLogo = ''
    let companyDomain = ''
    if (website) {
      try {
        const url = new URL(website)
        companyDomain = url.hostname.replace('www.', '')
        companyLogo = `https://logo.clearbit.com/${companyDomain}`
      } catch (e) {
        console.log('Failed to extract domain from website:', e)
      }
    }

    // 2. Fetch real news from NewsData.io with enhanced data
    let newsData: NewsItem[] = []
    const newsApiKey = Deno.env.get('NEWSDATA_API_KEY')
    if (newsApiKey) {
      try {
        const newsResponse = await fetch(
          `https://newsdata.io/api/1/news?apikey=${newsApiKey}&q="${companyName}"&language=en&size=10&category=business,technology`
        )
        if (newsResponse.ok) {
          const newsResult = await newsResponse.json()
          newsData = newsResult.results?.slice(0, 4).map((item: any) => ({
            title: item.title,
            description: item.description || item.content?.substring(0, 200) + '...' || '',
            url: item.link,
            publishedAt: item.pubDate,
            source: item.source_id || 'Unknown Source',
            sourceFavicon: item.source_icon || `https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}&sz=32`
          })) || []
        }
      } catch (e) {
        console.log('Failed to fetch news:', e)
      }
    }

    // 3. Fetch detailed job signals from JSearch
    let jobSignals: JobSignal[] = []
    const jsearchApiKey = Deno.env.get('JSEARCH_API_KEY')
    if (jsearchApiKey) {
      try {
        const jobResponse = await fetch(
          `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(companyName + ' jobs')}&page=1&num_pages=1&date_posted=month`,
          {
            headers: {
              'X-RapidAPI-Key': jsearchApiKey,
              'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
          }
        )
        if (jobResponse.ok) {
          const jobResult = await jobResponse.json()
          jobSignals = jobResult.data?.slice(0, 8).map((job: any) => ({
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city + ', ' + job.job_country,
            postedDate: job.job_posted_at_datetime_utc,
            description: job.job_description?.substring(0, 300) + '...' || ''
          })) || []
        }
      } catch (e) {
        console.log('Failed to fetch job signals:', e)
      }
    }

    // 4. Enhanced tech stack inference with confidence levels
    const techStackAnalysis = analyzeTechStack(companyName, website, jobSignals, newsData)

    // 5. Generate enhanced AI analysis using Groq with real data context
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    let aiAnalysis = {
      summary: 'Company analysis in progress...',
      pitchAngle: 'Strategic recommendations being generated...',
      subjectLine: 'Subject line suggestion pending...',
      whatNotToPitch: 'Risk analysis in progress...',
      signalTag: 'Processing signals...'
    }

    if (groqApiKey) {
      try {
        // Create rich context for Groq
        const newsContext = newsData.length > 0 
          ? newsData.map(n => `"${n.title}" (${n.source}, ${formatDate(n.publishedAt)})`).join('\n')
          : 'No recent news found'
        
        const jobContext = jobSignals.length > 0
          ? jobSignals.map(j => `${j.title} - ${j.location} (Posted: ${formatDate(j.postedDate)})`).join('\n')
          : 'No recent job postings found'

        const techContext = techStackAnalysis.technologies.length > 0
          ? techStackAnalysis.technologies.map(t => `${t.name} (${t.confidence})`).join(', ')
          : 'Tech stack not detected'

        const prompt = `
COMPANY ANALYSIS REQUEST:
Company: ${companyName}
Website: ${website || 'Not provided'}
Domain: ${companyDomain || 'Unknown'}
User Intent: ${userIntent}

REAL DATA GATHERED:
Recent News Headlines:
${newsContext}

Current Hiring Activity:
${jobContext}

Detected Technology Stack:
${techContext}

ANALYSIS REQUIREMENTS:
Generate a strategic B2B outreach brief that is:
1. Specific to this company's current situation
2. Based on real signals from news and hiring data
3. Tailored to the user's intent
4. Avoids generic business language

OUTPUT FORMAT (JSON):
{
  "summary": "2-3 sentences with specific 'why now' insight based on real signals",
  "pitchAngle": "Personalized pitch strategy that references actual company signals and timing",
  "subjectLine": "Compelling subject line that feels personal and timely",
  "whatNotToPitch": "Specific warnings based on company stage, recent news, or industry context",
  "signalTag": "Descriptive tag based on actual hiring/news signals (e.g., 'Scaling AI Team in Europe', 'Post-Series B Growth Mode')"
}

GUIDELINES:
- Reference specific news headlines or job roles when relevant
- Use concrete timing signals (recent funding, new hires, product launches)
- Avoid phrases like "cutting-edge", "ideal time", "innovative solution"
- Make the pitch angle feel like insider knowledge
- Signal tag should reflect actual company activity, not generic labels
`

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [
              {
                role: 'system',
                content: 'You are an expert B2B strategist who creates personalized outreach strategies based on real company signals. Always reference specific data points and avoid generic business language. Return only valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1200
          })
        })

        if (groqResponse.ok) {
          const groqResult = await groqResponse.json()
          const content = groqResult.choices?.[0]?.message?.content
          if (content) {
            try {
              // Try to parse JSON from the response
              const jsonMatch = content.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                const parsedAnalysis = JSON.parse(jsonMatch[0])
                aiAnalysis = { ...aiAnalysis, ...parsedAnalysis }
              }
            } catch (e) {
              console.log('Failed to parse AI response as JSON, using fallback')
            }
          }
        }
      } catch (e) {
        console.log('Failed to get AI analysis:', e)
      }
    }

    // 6. Save to database with enhanced data structure
    const { data, error } = await supabaseClient
      .from('briefs')
      .insert({
        companyName,
        website,
        userIntent,
        summary: aiAnalysis.summary,
        news: newsData,
        techStack: techStackAnalysis.technologies.map(t => t.name),
        pitchAngle: aiAnalysis.pitchAngle,
        subjectLine: aiAnalysis.subjectLine,
        whatNotToPitch: aiAnalysis.whatNotToPitch,
        signalTag: aiAnalysis.signalTag
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save brief to database', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        brief: {
          ...data,
          jobSignals,
          techStackAnalysis,
          companyLogo
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating brief:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function analyzeTechStack(companyName: string, website?: string, jobSignals: JobSignal[] = [], newsData: NewsItem[] = []) {
  const technologies: Array<{ name: string; confidence: 'High' | 'Medium' | 'Low'; source: string }> = []
  
  // Combine all text for analysis
  const allText = `${companyName} ${website || ''} ${jobSignals.map(j => j.title + ' ' + j.description).join(' ')} ${newsData.map(n => n.title + ' ' + n.description).join(' ')}`.toLowerCase()
  
  // Enhanced tech detection with confidence levels
  const techPatterns = {
    // Frontend
    'React': { keywords: ['react', 'react.js', 'reactjs'], confidence: 'High' as const },
    'Vue.js': { keywords: ['vue', 'vue.js', 'vuejs'], confidence: 'High' as const },
    'Angular': { keywords: ['angular', 'angularjs'], confidence: 'High' as const },
    'TypeScript': { keywords: ['typescript', 'ts developer'], confidence: 'High' as const },
    'Next.js': { keywords: ['next.js', 'nextjs'], confidence: 'Medium' as const },
    
    // Backend
    'Node.js': { keywords: ['node', 'nodejs', 'node.js'], confidence: 'High' as const },
    'Python': { keywords: ['python', 'django', 'flask', 'fastapi'], confidence: 'High' as const },
    'Java': { keywords: ['java', 'spring', 'spring boot'], confidence: 'High' as const },
    'Go': { keywords: ['golang', 'go developer'], confidence: 'Medium' as const },
    'Ruby': { keywords: ['ruby', 'rails', 'ruby on rails'], confidence: 'Medium' as const },
    
    // Cloud & Infrastructure
    'AWS': { keywords: ['aws', 'amazon web services', 'ec2', 's3'], confidence: 'High' as const },
    'Google Cloud': { keywords: ['gcp', 'google cloud', 'firebase'], confidence: 'High' as const },
    'Azure': { keywords: ['azure', 'microsoft azure'], confidence: 'High' as const },
    'Docker': { keywords: ['docker', 'container'], confidence: 'Medium' as const },
    'Kubernetes': { keywords: ['kubernetes', 'k8s'], confidence: 'Medium' as const },
    
    // Databases
    'PostgreSQL': { keywords: ['postgres', 'postgresql'], confidence: 'High' as const },
    'MongoDB': { keywords: ['mongo', 'mongodb'], confidence: 'High' as const },
    'Redis': { keywords: ['redis'], confidence: 'Medium' as const },
    'MySQL': { keywords: ['mysql'], confidence: 'Medium' as const },
    
    // AI/ML
    'TensorFlow': { keywords: ['tensorflow', 'tf'], confidence: 'High' as const },
    'PyTorch': { keywords: ['pytorch'], confidence: 'High' as const },
    'OpenAI': { keywords: ['openai', 'gpt', 'chatgpt'], confidence: 'Medium' as const },
    
    // Other
    'GraphQL': { keywords: ['graphql'], confidence: 'Medium' as const },
    'Elasticsearch': { keywords: ['elasticsearch', 'elastic'], confidence: 'Medium' as const },
    'Kafka': { keywords: ['kafka', 'apache kafka'], confidence: 'Medium' as const }
  }
  
  for (const [tech, pattern] of Object.entries(techPatterns)) {
    const found = pattern.keywords.some(keyword => allText.includes(keyword))
    if (found) {
      const source = jobSignals.some(j => pattern.keywords.some(k => (j.title + ' ' + j.description).toLowerCase().includes(k))) 
        ? 'Job Posting' 
        : newsData.some(n => pattern.keywords.some(k => (n.title + ' ' + n.description).toLowerCase().includes(k)))
        ? 'News Article'
        : 'Company Analysis'
      
      technologies.push({
        name: tech,
        confidence: pattern.confidence,
        source
      })
    }
  }
  
  // Add some inferred technologies based on company type
  if (technologies.length === 0) {
    if (allText.includes('ai') || allText.includes('machine learning') || allText.includes('data')) {
      technologies.push({ name: 'Python', confidence: 'Low', source: 'Industry Inference' })
      technologies.push({ name: 'AWS', confidence: 'Low', source: 'Industry Inference' })
    } else if (allText.includes('web') || allText.includes('frontend')) {
      technologies.push({ name: 'JavaScript', confidence: 'Low', source: 'Industry Inference' })
      technologies.push({ name: 'React', confidence: 'Low', source: 'Industry Inference' })
    } else {
      technologies.push({ name: 'Cloud Infrastructure', confidence: 'Low', source: 'Industry Standard' })
      technologies.push({ name: 'Modern Web Stack', confidence: 'Low', source: 'Industry Standard' })
    }
  }
  
  return {
    technologies: technologies.slice(0, 8), // Limit to 8 technologies
    analysisDate: new Date().toISOString()
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'Recently'
  }
}

// Import Supabase client
import { createClient } from 'npm:@supabase/supabase-js@2'