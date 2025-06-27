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
  salary?: string
}

interface TechStackItem {
  name: string
  confidence: 'High' | 'Medium' | 'Low'
  source: string
  category: string
  firstDetected?: string
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

    console.log(`Creating production-grade brief for ${companyName}...`)

    // 1. Extract domain and setup Clearbit
    let companyDomain = ''
    let companyLogo = ''
    if (website) {
      try {
        const url = new URL(website)
        companyDomain = url.hostname.replace('www.', '')
        companyLogo = `https://logo.clearbit.com/${companyDomain}`
      } catch (e) {
        console.log('Failed to extract domain from website:', e)
      }
    }

    // 2. Fetch real tech stack from BuiltWith API
    let techStackData: TechStackItem[] = []
    const builtWithApiKey = Deno.env.get('BUILTWITH_API_KEY')
    if (builtWithApiKey && companyDomain) {
      try {
        console.log(`Fetching tech stack for ${companyDomain} from BuiltWith...`)
        const builtWithResponse = await fetch(
          `https://api.builtwith.com/v21/api.json?KEY=${builtWithApiKey}&LOOKUP=${companyDomain}`
        )
        
        if (builtWithResponse.ok) {
          const builtWithData = await builtWithResponse.json()
          const results = builtWithData?.Results?.[0]?.Result?.Paths?.[0]?.Technologies || []
          
          techStackData = results.slice(0, 15).map((tech: any) => ({
            name: tech.Name,
            confidence: 'High' as const,
            source: 'BuiltWith API',
            category: tech.Categories?.[0]?.Name || 'Other',
            firstDetected: tech.FirstDetected ? formatDate(tech.FirstDetected) : undefined
          }))
          
          console.log(`Found ${techStackData.length} technologies from BuiltWith`)
        }
      } catch (e) {
        console.log('BuiltWith API failed, using fallback analysis:', e)
      }
    }

    // 3. Fetch enhanced news from NewsData.io
    let newsData: NewsItem[] = []
    const newsApiKey = Deno.env.get('NEWSDATA_API_KEY')
    if (newsApiKey) {
      try {
        console.log(`Fetching news for ${companyName} from NewsData.io...`)
        const newsResponse = await fetch(
          `https://newsdata.io/api/1/news?apikey=${newsApiKey}&q="${companyName}"&language=en&size=20&category=business,technology&prioritydomain=top`
        )
        
        if (newsResponse.ok) {
          const newsResult = await newsResponse.json()
          newsData = newsResult.results?.slice(0, 8).map((item: any) => {
            const sourceUrl = item.source_url || item.link
            let sourceFavicon = ''
            try {
              const domain = new URL(sourceUrl).hostname
              sourceFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
            } catch (e) {
              sourceFavicon = 'https://www.google.com/s2/favicons?domain=news.com&sz=32'
            }
            
            return {
              title: item.title,
              description: item.description || item.content?.substring(0, 250) + '...' || '',
              url: item.link,
              publishedAt: item.pubDate,
              source: item.source_id || 'News Source',
              sourceFavicon
            }
          }) || []
          
          console.log(`Found ${newsData.length} news articles`)
        }
      } catch (e) {
        console.log('Failed to fetch news:', e)
      }
    }

    // 4. Fetch detailed hiring signals from JSearch
    let jobSignals: JobSignal[] = []
    const jsearchApiKey = Deno.env.get('JSEARCH_API_KEY')
    if (jsearchApiKey) {
      try {
        console.log(`Fetching job signals for ${companyName} from JSearch...`)
        const jobResponse = await fetch(
          `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(companyName + ' jobs')}&page=1&num_pages=1&date_posted=month&employment_types=FULLTIME`,
          {
            headers: {
              'X-RapidAPI-Key': jsearchApiKey,
              'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
          }
        )
        
        if (jobResponse.ok) {
          const jobResult = await jobResponse.json()
          jobSignals = jobResult.data?.slice(0, 15).map((job: any) => ({
            title: job.job_title,
            company: job.employer_name,
            location: `${job.job_city || 'Remote'}, ${job.job_country || 'Global'}`,
            postedDate: job.job_posted_at_datetime_utc,
            description: job.job_description?.substring(0, 500) + '...' || '',
            salary: job.job_salary_period && job.job_min_salary 
              ? `${job.job_salary_currency || '$'}${job.job_min_salary}${job.job_max_salary ? '-' + job.job_max_salary : ''} ${job.job_salary_period}`
              : undefined
          })) || []
          
          console.log(`Found ${jobSignals.length} job postings`)
        }
      } catch (e) {
        console.log('Failed to fetch job signals:', e)
      }
    }

    // 5. Fallback tech stack analysis if BuiltWith failed
    if (techStackData.length === 0) {
      console.log('Using fallback tech stack analysis...')
      techStackData = analyzeTechStackFallback(companyName, website, jobSignals, newsData)
    }

    // 6. Generate strategic AI analysis using Groq with comprehensive context
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    let aiAnalysis = {
      summary: 'Strategic analysis in progress...',
      pitchAngle: 'Personalized strategy being crafted...',
      subjectLine: 'Subject line optimization pending...',
      whatNotToPitch: 'Risk assessment in progress...',
      signalTag: 'Signal analysis pending...'
    }

    if (groqApiKey) {
      try {
        console.log('Generating strategic analysis with Groq LLaMA-3...')
        
        // Create comprehensive context
        const newsContext = newsData.length > 0 
          ? newsData.map(n => `• "${n.title}" (${n.source}, ${formatRelativeDate(n.publishedAt)}) - ${n.description.substring(0, 150)}...`).join('\n')
          : 'No recent news coverage found in business/tech media'
        
        const jobContext = jobSignals.length > 0
          ? jobSignals.map(j => `• ${j.title} - ${j.location} (Posted: ${formatRelativeDate(j.postedDate)})${j.salary ? ` - ${j.salary}` : ''}\n  Description: ${j.description.substring(0, 200)}...`).join('\n')
          : 'No recent job postings detected'

        const techContext = techStackData.length > 0
          ? techStackData.map(t => `• ${t.name} (${t.confidence} confidence, ${t.category}${t.source === 'BuiltWith API' ? ', verified by BuiltWith' : ''})`).join('\n')
          : 'Technology stack not detected'

        const hiringTrends = extractHiringTrends(jobSignals)
        const newsTrends = extractNewsTrends(newsData)

        const strategicPrompt = `
STRATEGIC INTELLIGENCE BRIEF REQUEST

COMPANY: ${companyName}
DOMAIN: ${companyDomain || 'Not provided'}
WEBSITE: ${website || 'Not provided'}
USER INTENT: ${userIntent}

=== REAL-TIME INTELLIGENCE DATA ===

RECENT NEWS COVERAGE (${newsData.length} articles):
${newsContext}

CURRENT HIRING ACTIVITY (${jobSignals.length} positions):
${jobContext}

TECHNOLOGY INFRASTRUCTURE (${techStackData.length} technologies):
${techContext}

HIRING TRENDS ANALYSIS:
${hiringTrends}

NEWS SENTIMENT & TRENDS:
${newsTrends}

=== STRATEGIC ANALYSIS REQUIREMENTS ===

You are a world-class B2B strategist and market intelligence analyst. Generate a production-grade strategic brief that demonstrates deep market intelligence and insider knowledge. Each section must contain detailed, paragraph-level insights that sound like they come from an expert industry analyst who has been following this company closely.

CRITICAL REQUIREMENTS:
- Reference specific, recent company activities from the intelligence data
- Use concrete timing signals and recent developments
- Demonstrate strategic thinking beyond generic business advice
- Sound like insights from a seasoned industry expert
- Each section should be substantial (multiple sentences, not bullet points)

Generate the following sections:

1. EXECUTIVE SUMMARY (3-4 sentences): Synthesize the most compelling "why now" opportunity based on actual signals from news, hiring, and tech adoption. Focus on timing and market positioning.

2. STRATEGIC PITCH ANGLE (2-3 paragraphs): A sophisticated pitch strategy that:
   - References specific recent company activities and signals
   - Connects the user's offering to detected business needs and growth patterns
   - Uses timing-based urgency from real intelligence data
   - Demonstrates insider knowledge of their current challenges/opportunities
   - Avoids generic business language

3. SUBJECT LINE: A compelling, personalized subject line that feels like insider knowledge and references recent company developments

4. STRATEGIC WARNINGS (1-2 paragraphs): Specific "what NOT to pitch" guidance based on:
   - Company stage indicators from hiring and news
   - Recent developments that suggest certain approaches would fail
   - Industry context and competitive positioning
   - Timing considerations

5. SIGNAL TAG: A precise, descriptive tag of current company state (e.g., "Scaling AI Team Post-Series B", "Hiring DevOps for Cloud Migration", "Expanding European Operations")

Return ONLY valid JSON format with these exact keys: summary, pitchAngle, subjectLine, whatNotToPitch, signalTag
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
                content: 'You are a world-class B2B strategist and market intelligence analyst. You create sophisticated, data-driven outreach strategies that demonstrate deep industry knowledge. Always reference specific signals and avoid generic business language. Return only valid JSON with the exact keys requested.'
              },
              {
                role: 'user',
                content: strategicPrompt
              }
            ],
            temperature: 0.8,
            max_tokens: 2000
          })
        })

        if (groqResponse.ok) {
          const groqResult = await groqResponse.json()
          const content = groqResult.choices?.[0]?.message?.content
          if (content) {
            try {
              // Extract JSON from response
              const jsonMatch = content.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                const parsedAnalysis = JSON.parse(jsonMatch[0])
                aiAnalysis = { ...aiAnalysis, ...parsedAnalysis }
                console.log('Successfully generated AI strategic analysis')
              }
            } catch (e) {
              console.log('Failed to parse AI response as JSON:', e)
              console.log('Raw AI response:', content)
            }
          }
        }
      } catch (e) {
        console.log('Failed to get AI analysis:', e)
      }
    }

    // 7. Save comprehensive brief to database
    const { data, error } = await supabaseClient
      .from('briefs')
      .insert({
        companyName,
        website,
        userIntent,
        summary: aiAnalysis.summary,
        news: newsData,
        techStack: techStackData.map(t => t.name),
        pitchAngle: aiAnalysis.pitchAngle,
        subjectLine: aiAnalysis.subjectLine,
        whatNotToPitch: aiAnalysis.whatNotToPitch,
        signalTag: aiAnalysis.signalTag,
        jobSignals: jobSignals,
        techStackData: techStackData,
        intelligenceSources: {
          news: newsData.length,
          jobs: jobSignals.length,
          technologies: techStackData.length,
          builtWithUsed: techStackData.some(t => t.source === 'BuiltWith API')
        },
        companyLogo,
        hiringTrends,
        newsTrends
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

    console.log(`Successfully created comprehensive brief for ${companyName}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        brief: data
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

function analyzeTechStackFallback(companyName: string, website?: string, jobSignals: JobSignal[] = [], newsData: NewsItem[] = []): TechStackItem[] {
  const technologies: TechStackItem[] = []
  
  // Combine all text for analysis
  const allText = `${companyName} ${website || ''} ${jobSignals.map(j => j.title + ' ' + j.description).join(' ')} ${newsData.map(n => n.title + ' ' + n.description).join(' ')}`.toLowerCase()
  
  // Enhanced tech detection patterns
  const techPatterns = {
    // Frontend Frameworks
    'React': { keywords: ['react', 'react.js', 'reactjs'], category: 'Frontend', confidence: 'High' as const },
    'Vue.js': { keywords: ['vue', 'vue.js', 'vuejs'], category: 'Frontend', confidence: 'High' as const },
    'Angular': { keywords: ['angular', 'angularjs'], category: 'Frontend', confidence: 'High' as const },
    'Next.js': { keywords: ['next.js', 'nextjs'], category: 'Frontend', confidence: 'Medium' as const },
    'Svelte': { keywords: ['svelte', 'sveltekit'], category: 'Frontend', confidence: 'Medium' as const },
    
    // Backend Technologies
    'Node.js': { keywords: ['node', 'nodejs', 'node.js'], category: 'Backend', confidence: 'High' as const },
    'Python': { keywords: ['python', 'django', 'flask', 'fastapi'], category: 'Backend', confidence: 'High' as const },
    'Java': { keywords: ['java', 'spring', 'spring boot'], category: 'Backend', confidence: 'High' as const },
    'Go': { keywords: ['golang', 'go developer'], category: 'Backend', confidence: 'Medium' as const },
    'Ruby': { keywords: ['ruby', 'rails', 'ruby on rails'], category: 'Backend', confidence: 'Medium' as const },
    'PHP': { keywords: ['php', 'laravel', 'symfony'], category: 'Backend', confidence: 'Medium' as const },
    
    // Cloud Platforms
    'AWS': { keywords: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'], category: 'Cloud', confidence: 'High' as const },
    'Google Cloud': { keywords: ['gcp', 'google cloud', 'firebase'], category: 'Cloud', confidence: 'High' as const },
    'Microsoft Azure': { keywords: ['azure', 'microsoft azure'], category: 'Cloud', confidence: 'High' as const },
    'Vercel': { keywords: ['vercel'], category: 'Cloud', confidence: 'Medium' as const },
    'Netlify': { keywords: ['netlify'], category: 'Cloud', confidence: 'Medium' as const },
    
    // DevOps & Infrastructure
    'Docker': { keywords: ['docker', 'container'], category: 'DevOps', confidence: 'High' as const },
    'Kubernetes': { keywords: ['kubernetes', 'k8s'], category: 'DevOps', confidence: 'High' as const },
    'Jenkins': { keywords: ['jenkins'], category: 'DevOps', confidence: 'Medium' as const },
    'GitHub Actions': { keywords: ['github actions'], category: 'DevOps', confidence: 'Medium' as const },
    
    // Databases
    'PostgreSQL': { keywords: ['postgres', 'postgresql'], category: 'Database', confidence: 'High' as const },
    'MongoDB': { keywords: ['mongo', 'mongodb'], category: 'Database', confidence: 'High' as const },
    'Redis': { keywords: ['redis'], category: 'Database', confidence: 'Medium' as const },
    'MySQL': { keywords: ['mysql'], category: 'Database', confidence: 'Medium' as const },
    'Elasticsearch': { keywords: ['elasticsearch', 'elastic'], category: 'Database', confidence: 'Medium' as const },
    
    // AI/ML
    'TensorFlow': { keywords: ['tensorflow', 'tf'], category: 'AI/ML', confidence: 'High' as const },
    'PyTorch': { keywords: ['pytorch'], category: 'AI/ML', confidence: 'High' as const },
    'OpenAI': { keywords: ['openai', 'gpt', 'chatgpt'], category: 'AI/ML', confidence: 'Medium' as const },
    'Hugging Face': { keywords: ['hugging face', 'transformers'], category: 'AI/ML', confidence: 'Medium' as const },
    
    // Languages
    'TypeScript': { keywords: ['typescript', 'ts developer'], category: 'Language', confidence: 'High' as const },
    'JavaScript': { keywords: ['javascript', 'js developer'], category: 'Language', confidence: 'High' as const },
    'Rust': { keywords: ['rust', 'rust developer'], category: 'Language', confidence: 'Medium' as const },
    
    // Other Tools
    'GraphQL': { keywords: ['graphql'], category: 'API', confidence: 'Medium' as const },
    'Apache Kafka': { keywords: ['kafka', 'apache kafka'], category: 'Messaging', confidence: 'Medium' as const },
    'Stripe': { keywords: ['stripe'], category: 'Payments', confidence: 'Medium' as const }
  }
  
  for (const [tech, pattern] of Object.entries(techPatterns)) {
    const found = pattern.keywords.some(keyword => allText.includes(keyword))
    if (found) {
      const source = jobSignals.some(j => pattern.keywords.some(k => (j.title + ' ' + j.description).toLowerCase().includes(k))) 
        ? 'Job Analysis' 
        : newsData.some(n => pattern.keywords.some(k => (n.title + ' ' + n.description).toLowerCase().includes(k)))
        ? 'News Analysis'
        : 'Company Analysis'
      
      technologies.push({
        name: tech,
        confidence: pattern.confidence,
        source,
        category: pattern.category
      })
    }
  }
  
  // Industry-based inference if no specific tech found
  if (technologies.length === 0) {
    if (allText.includes('ai') || allText.includes('machine learning') || allText.includes('data')) {
      technologies.push(
        { name: 'Python', confidence: 'Low', source: 'Industry Inference', category: 'Backend' },
        { name: 'TensorFlow', confidence: 'Low', source: 'Industry Inference', category: 'AI/ML' },
        { name: 'AWS', confidence: 'Low', source: 'Industry Inference', category: 'Cloud' }
      )
    } else if (allText.includes('web') || allText.includes('frontend') || allText.includes('app')) {
      technologies.push(
        { name: 'JavaScript', confidence: 'Low', source: 'Industry Inference', category: 'Language' },
        { name: 'React', confidence: 'Low', source: 'Industry Inference', category: 'Frontend' },
        { name: 'Node.js', confidence: 'Low', source: 'Industry Inference', category: 'Backend' }
      )
    } else {
      technologies.push(
        { name: 'Cloud Infrastructure', confidence: 'Low', source: 'Industry Standard', category: 'Cloud' },
        { name: 'Modern Web Stack', confidence: 'Low', source: 'Industry Standard', category: 'Frontend' }
      )
    }
  }
  
  return technologies.slice(0, 12)
}

function extractHiringTrends(jobSignals: JobSignal[]): string {
  if (jobSignals.length === 0) return 'No hiring activity detected'
  
  const roles = jobSignals.map(j => j.title.toLowerCase())
  const locations = jobSignals.map(j => j.location)
  
  // Analyze role patterns
  const rolePatterns = {
    'AI/ML': ['ai', 'machine learning', 'data scientist', 'ml engineer'],
    'Engineering': ['engineer', 'developer', 'architect', 'tech lead'],
    'DevOps': ['devops', 'sre', 'infrastructure', 'cloud'],
    'Product': ['product manager', 'product owner', 'pm'],
    'Sales': ['sales', 'account', 'business development'],
    'Marketing': ['marketing', 'growth', 'content']
  }
  
  const trends = []
  for (const [category, keywords] of Object.entries(rolePatterns)) {
    const count = roles.filter(role => keywords.some(keyword => role.includes(keyword))).length
    if (count > 0) {
      trends.push(`${count} ${category} roles`)
    }
  }
  
  // Location analysis
  const locationCounts = locations.reduce((acc, loc) => {
    const key = loc.split(',')[1]?.trim() || loc
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topLocation = Object.entries(locationCounts).sort(([,a], [,b]) => b - a)[0]
  
  return trends.length > 0 
    ? `Active hiring: ${trends.join(', ')}${topLocation ? ` (primarily ${topLocation[0]})` : ''}`
    : `${jobSignals.length} open positions across various departments`
}

function extractNewsTrends(newsData: NewsItem[]): string {
  if (newsData.length === 0) return 'No recent news coverage'
  
  const titles = newsData.map(n => n.title.toLowerCase()).join(' ')
  
  const sentimentKeywords = {
    positive: ['funding', 'raised', 'growth', 'expansion', 'launch', 'partnership', 'acquisition', 'success'],
    negative: ['layoffs', 'cuts', 'decline', 'loss', 'controversy', 'investigation'],
    neutral: ['announces', 'reports', 'updates', 'changes']
  }
  
  let sentiment = 'neutral'
  let maxCount = 0
  
  for (const [type, keywords] of Object.entries(sentimentKeywords)) {
    const count = keywords.filter(keyword => titles.includes(keyword)).length
    if (count > maxCount) {
      maxCount = count
      sentiment = type
    }
  }
  
  const recentCount = newsData.filter(n => {
    const daysSince = Math.floor((Date.now() - new Date(n.publishedAt).getTime()) / (1000 * 60 * 60 * 24))
    return daysSince <= 7
  }).length
  
  return `${newsData.length} recent articles (${recentCount} this week) - ${sentiment} sentiment`
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return 'Recently'
  }
}

function formatRelativeDate(dateString: string): string {
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