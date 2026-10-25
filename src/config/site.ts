// All site content lives here. Edit this file to update the portfolio.
// Anything wrapped in [square brackets] is a placeholder for Vansh to replace.

export type SocialId = 'github' | 'linkedin' | 'instagram'

export interface Social {
  id: SocialId
  label: string
  /** Leave empty until the profile URL is ready — renders as a non-navigating button. */
  href: string
}

export interface FocusArea {
  title: string
  /** One italic serif word inside the title, for the editorial accent. */
  accent: string
  line: string
  tools: string[]
}

export interface Project {
  name: string
  summary: string
  stack: string[]
  github?: string
  live?: string
}

export const site = {
  name: 'Vansh Vyas',
  firstName: 'Vansh',
  lastName: 'Vyas',
  monogram: 'VV',
  title: 'Developer building at the intersection of AI and the web.',
  roles: ['AI Engineer', 'Full-stack Engineer', 'Design Engineer'],
  description:
    'Vansh Vyas — developer building at the intersection of AI and the web. Interested in AI engineering, full-stack TypeScript, edge platforms and design engineering.',
  url: 'https://vanshportfolio-eosin.vercel.app', // update if you add a custom domain
  year: 2026,

  /** Status line in the footer. */
  status: 'building in public',
  /** IANA timezone, e.g. 'Asia/Kolkata'. Leave empty to hide the local-time readout. */
  timezone: '',

  /**
   * Live weather box in the top-right (data from OpenWeather).
   * The API key goes in .env.local as VITE_OPENWEATHER_API_KEY; without one the box shows
   * clearly labelled demo data. While `latitude`/`longitude` are null the box is hidden.
   */
  weather: {
    city: 'Jaipur',
    latitude: 26.9124 as number | null,
    longitude: 75.7873 as number | null,
    units: 'metric' as 'metric' | 'imperial',
  },

  about: [
    '[Write 2–3 lines about who you are and what got you into building software.]',
    '[Write a line about what you want to work on next, and what you are like to work with.]',
  ],

  /**
   * Focus areas are presented as interests and direction ("What I'm into"),
   * not as claimed expertise. Trim this list to what is true for you.
   */
  focus: [
    {
      title: 'AI engineering',
      accent: 'AI',
      line: 'LLM-powered apps, agents that use tools, and retrieval that actually finds the right thing.',
      tools: ['LLM APIs', 'Agents & tool use', 'MCP', 'RAG', 'Evals'],
    },
    {
      title: 'Full-stack TypeScript',
      accent: 'Full-stack',
      line: 'End-to-end products with typed boundaries from the database to the button.',
      tools: ['TypeScript', 'React', 'Next.js', 'Astro', 'Node', 'Postgres'],
    },
    {
      title: 'Edge & serverless',
      accent: 'Edge',
      line: 'Shipping close to the user — fast cold starts, small bundles, sensible caching.',
      tools: ['Vercel', 'Cloudflare Workers', 'Serverless functions'],
    },
    {
      title: 'Design engineering',
      accent: 'Design',
      line: 'Interfaces with craft: considered motion, accessible by default, pixels that line up.',
      tools: ['CSS', 'Motion', 'Accessibility', 'Design systems'],
    },
    {
      title: 'Tooling & performance',
      accent: 'performance',
      line: 'Making builds faster, pages lighter and developer loops shorter.',
      tools: ['Vite', 'Web vitals', 'Profiling', 'CLI tools'],
    },
  ] satisfies FocusArea[],

  /** Add real projects here. While empty, the Work section shows a "first case study in progress" row. */
  projects: [] as Project[],

  socials: [
    { id: 'github', label: 'GitHub', href: '' },
    { id: 'linkedin', label: 'LinkedIn', href: '' },
    { id: 'instagram', label: 'Instagram', href: '' },
  ] satisfies Social[],

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Focus', href: '#focus' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ],
} as const
