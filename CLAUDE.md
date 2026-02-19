# CLAUDE.md — VibeStack

## What is this?

VibeStack is a curated resource directory for vibe builders (indie hackers, solo founders, AI-native builders). It's a clean, minimal list of links organized by category with AI-powered natural language search. Think of it as a bookmarks page — but public, searchable, and useful.

The design ethos is **Minimal** (the bookmarking app). Clean, lots of whitespace, single-column list layout, no visual clutter. Every design decision should lean toward "less."

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres)
- **OG Image Fetching**: Microlink API (`https://api.microlink.io/?url=`) for pulling Open Graph thumbnails from link metadata. Cache results in Supabase so we don't re-fetch.
- **AI Search**: Anthropic Claude API (claude-sonnet-4-20250514) for natural language resource matching
- **Deployment**: Vercel
- **Font**: DM Sans (body) + Newsreader (italic accents). Load from Google Fonts. Do NOT use Inter, Roboto, Arial, or system fonts.

---

## Core Data Model

### `resources` table (Supabase)

```sql
create table resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null unique,
  domain text not null,
  description text not null,
  category text not null,
  og_image_url text,          -- cached OG image from metadata
  favicon_url text,           -- cached favicon
  og_fetched_at timestamptz,  -- when we last fetched OG data
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Categories (hardcoded enum, not a separate table)

```typescript
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "launch", label: "Launch" },         // places to launch products
  { id: "reddit", label: "Reddit" },         // subreddits for builders
  { id: "slack", label: "Slack" },           // slack/discord communities
  { id: "building", label: "Building" },     // tools & articles about building
  { id: "ai-marketing", label: "AI Marketing" },  // AI-powered marketing tools & guides
  { id: "seo", label: "SEO & Marketing" },   // SEO tools, general marketing, analytics
] as const;
```

Category values stored in the `category` column: `"launch" | "reddit" | "slack" | "building" | "ai-marketing" | "seo"`

---

## Pages & Routes

### `/ ` — Home (main resource list)

This is the only page. Single page app feel. No routing complexity.

**Layout (top to bottom):**

1. **Header** — logo on left ("vibestack" with green dot), tagline on right ("resources for builders" in italic Newsreader)
2. **Search bar** — full-width input with ⌘ hint badge on left. Placeholder: `Try "how do I market with Claude" or "best place to launch"...`. Triggers AI search on Enter.
3. **Category pills** — horizontal row of filter buttons. "All" selected by default. Clicking a category filters the list. Clicking while search is active clears search.
4. **Table header** — "Title" on left, "Added" on right. When search is active, replace "Title" with italic result count (e.g., `3 results for "marketing with ai"`)
5. **Resource list** — vertical list of rows, each row contains:
   - **OG thumbnail** (56×40px, rounded corners, left side) — pulled from site's Open Graph meta image. Shows shimmer while loading. Falls back to centered favicon on neutral background if no OG image.
   - **Title + domain** — title in regular weight, domain in muted gray, same baseline
   - **Description** — one line, truncated with ellipsis, muted color, sits below title line
   - **Date** — right-aligned, muted, shows "Feb 19" format
6. **Footer** — subtle top border, centered italic text: "curated for the vibe builder community"

**Each row is a link** — clicking opens the resource URL in a new tab. Hover state: very subtle background color change (#fafaf9).

### `/api/search` — AI Search endpoint

POST endpoint. Accepts `{ query: string }`. Returns matched resource titles.

```typescript
// Takes the user's natural language query
// Sends all resources + query to Claude
// Claude returns a JSON array of matching resource titles
// We filter resources by those titles and return them

const prompt = `You are a resource matcher. Given this query and list of resources, return ONLY a JSON array of the most relevant resource titles (exact match). Return 3-8 results ranked by relevance. No explanation, just the JSON array of title strings.

Query: "${query}"

Resources:
${resources.map(r => `[${r.category}] "${r.title}" - ${r.description} (${r.url})`).join("\n")}

Return format: ["Title 1", "Title 2", ...]`;
```

Fallback: if the API call fails, do client-side keyword matching against title + description + category.

### `/api/og` — OG Image Fetcher (background job or on-demand)

Fetches OG metadata for a given URL via Microlink, caches `og_image_url` and `favicon_url` in Supabase so we only fetch once per resource. Re-fetch if `og_fetched_at` is older than 30 days.

```typescript
// Fetch OG data
const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
const data = await res.json();
const ogImage = data?.data?.image?.url || data?.data?.logo?.url || null;
const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
```

---

## Design System

### Colors

```
--text-primary: #1a1a19
--text-secondary: #737373
--text-muted: #a3a3a2
--text-faint: #b3b3b2
--text-ghost: #c4c4c3
--border-default: #e5e5e4
--border-light: #ebebea
--border-faint: #f0f0ef
--bg-page: #ffffff
--bg-hover: #fafaf9
--bg-pill: #f5f5f4
--accent-green: #22c55e
```

### Typography

```
Font stack: 'DM Sans', sans-serif
Italic accent: 'Newsreader', serif (italic)

Logo: 16px, weight 500, letter-spacing -0.02em
Category pills: 13px, weight 400 (500 when active)
Table header: 11px, uppercase, letter-spacing 0.06em, muted color
Resource title: 14px, weight 400
Resource domain: 12px, muted
Resource description: 12px, muted, single line truncated
Date: 12px, faint
Footer: 12px, Newsreader italic, ghost color
Search input: 14px
Search placeholder: muted color
```

### Spacing

```
Page max-width: 760px, centered
Header top padding: 44px
Search top margin: 44px
Search bottom margin: 28px
Category pills bottom margin: 28px
Row padding: 12px vertical, 8px horizontal
Row gap (thumbnail to content): 14px
Footer top margin: 52px
```

### Thumbnail Specs

```
Size: 56px wide × 40px tall
Border-radius: 6px
Border: 1px solid #ebebea
Background: #fafaf9
Object-fit: cover
Loading state: shimmer animation (gradient slide)
Fallback: favicon (20×20) centered on #fafaf9 background
```

### Interactions

- Row hover: background-color transitions to #fafaf9 (0.15s ease)
- Row click: opens URL in new tab
- Category pill click: filters list, clears any active search
- Search Enter: triggers AI search, shows loading spinner, replaces table header with result count
- Clear search (✕ button): resets to category view
- List items fade in with staggered animation (fadeUp, 0.03s delay per item, max 0.35s)

---

## Seed Data

Pre-populate the database with these resources. These are the initial curated links:

### Launch
- Product Hunt — producthunt.com — "Launch and discover new products"
- Hacker News Show HN — news.ycombinator.com — "Share what you've built with the HN community"
- BetaList — betalist.com — "Discover and get early access to startups"
- Indie Hackers — indiehackers.com — "Connect with founders building profitable businesses"
- Uneed — uneed.best — "Free tool directory for launching products"
- MicroLaunch — microlaunch.net — "Launch your micro-SaaS to an engaged audience"
- Launching.io — launching.io — "Step-by-step launch checklist for makers"

### Reddit
- r/SideProject — reddit.com — "Share and get feedback on side projects"
- r/indiehackers — reddit.com — "Reddit community for indie hackers and solo founders"
- r/startups — reddit.com — "Discuss startup strategies and get advice"
- r/Entrepreneur — reddit.com — "Community for entrepreneurs at every stage"
- r/SaaS — reddit.com — "Discuss SaaS building, pricing, and growth"
- r/webdev — reddit.com — "Web development discussions and resources"
- r/artificial — reddit.com — "Discuss AI developments and applications"

### Slack
- Lenny's Community — lennysnewsletter.com — "Premium Slack for product managers and growth leads"
- Indie Worldwide — indieworldwide.com — "Slack community for indie makers worldwide"
- Online Geniuses — onlinegeniuses.com — "Largest marketing Slack community"
- DevChat — devchat.devolio.com — "Slack for developers to connect and share"
- Launch House — launchhouse.com — "Community for ambitious tech builders"

### Building
- YC Startup Library — ycombinator.com — "Y Combinator's startup library and founder resources"
- Build in Public — buildinpublic.com — "Resources and guides for building in public"
- Stripe Atlas — stripe.com — "Incorporate and set up your startup"
- Cursor — cursor.com — "AI-powered code editor for vibe coding"
- v0 by Vercel — v0.dev — "Generate UI components with AI"
- Supabase — supabase.com — "Open source Firebase alternative with Postgres"
- Replit — replit.com — "Collaborative browser IDE with AI assistance"

### AI Marketing
- Marketing with Claude — docs.anthropic.com — "Use Claude for marketing copy, strategy, and content"
- ChatGPT for Marketing — openai.com — "AI-powered marketing workflows with ChatGPT"
- Copy.ai — copy.ai — "Generate marketing copy with AI"
- Jasper — jasper.ai — "Enterprise AI for marketing teams"
- Smartlead — smartlead.ai — "AI-powered cold email outreach at scale"
- Writesonic — writesonic.com — "AI writing tool for blogs, ads, and social media"

### SEO & Marketing
- Ahrefs — ahrefs.com — "Comprehensive SEO toolset and learning resources"
- Google Search Console — search.google.com — "Free tool to monitor search performance"
- Backlinko — backlinko.com — "Actionable SEO advice and link building strategies"
- SparkToro — sparktoro.com — "Find where your audience hangs out online"
- Buffer — buffer.com — "Schedule and analyze social media content"
- ConvertKit — convertkit.com — "Email marketing built for online creators"
- Plausible — plausible.io — "Simple, privacy-focused web analytics"

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
MICROLINK_API_KEY=            # optional, for higher rate limits
```

---

## File Structure

```
vibestack/
├── CLAUDE.md
├── app/
│   ├── layout.tsx            # root layout, fonts, metadata
│   ├── page.tsx              # main page, server component that fetches resources
│   ├── globals.css           # tailwind imports, custom animations (fadeUp, shimmer, spin)
│   └── api/
│       ├── search/
│       │   └── route.ts      # AI-powered search endpoint
│       └── og/
│           └── route.ts      # OG metadata fetcher + cache
├── components/
│   ├── search-bar.tsx        # search input with ⌘ badge
│   ├── category-pills.tsx    # horizontal filter buttons
│   ├── resource-list.tsx     # the list container
│   ├── resource-row.tsx      # single row: thumbnail + title + domain + desc + date
│   └── og-thumbnail.tsx      # thumbnail component with loading/fallback states
├── lib/
│   ├── supabase.ts           # supabase client setup
│   ├── types.ts              # Resource type, Category type
│   └── constants.ts          # categories array
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

## Key Implementation Notes

1. **OG images must be cached.** Do NOT call Microlink on every page load. Fetch once, store `og_image_url` in Supabase, serve from cache. The `/api/og` route handles fetching and caching. Run it as a one-time seed or trigger it when a new resource is added.

2. **AI search is server-side.** The Claude API call happens in `/api/search/route.ts`, not in the browser. The client POSTs the query and gets back filtered resources. Never expose the Anthropic API key client-side.

3. **Favicon fallback chain:** OG image → site logo (from Microlink) → Google favicon service (`https://www.google.com/s2/favicons?domain=${domain}&sz=32`) → hidden (display:none).

4. **No pagination.** We're curating ~50 resources max. Just load them all. If this grows past 100, add infinite scroll or "load more."

5. **Search fallback.** If the Claude API call fails (rate limit, network, etc.), fall back to client-side keyword matching against title + description + category. The user should never see an error — just potentially less-smart results.

6. **Animations should be subtle.** FadeUp on list items (staggered 30ms per item, max 350ms delay). Shimmer on loading thumbnails. No bounce, no spring, no dramatic motion. Everything whisper-quiet.

7. **Mobile responsive.** The 760px max-width and single-column layout means it works on mobile naturally. Just ensure:
   - Search bar and pills wrap properly
   - Thumbnails don't shrink below 48px wide
   - Row content truncates cleanly
   - Touch targets are at least 44px tall

8. **No auth.** This is a public read-only directory. Admin adds resources directly to Supabase. If we add a submission form later, it would write to a `submissions` table for review.

---

## What NOT to build

- No user accounts or auth
- No comments or upvotes
- No admin dashboard (use Supabase dashboard directly)
- No dark mode (white only, matches the Minimal aesthetic)
- No complex routing (single page)
- No newsletter signup (yet)
- No analytics beyond Vercel Analytics (optional)

---

## Quality Checklist

Before shipping, verify:

- [ ] All seed resources are in the database with cached OG images
- [ ] AI search returns relevant results for: "how to market with Claude", "where to launch my product", "reddit communities for builders", "SEO tools"
- [ ] Fallback search works when Claude API is down
- [ ] Thumbnails load with shimmer → image (or fallback)
- [ ] Category filtering works and clears search state
- [ ] All links open in new tabs
- [ ] Mobile layout looks clean at 375px width
- [ ] Page loads fast (< 2s) — OG images served from cache, not fetched live
- [ ] Fonts load correctly (DM Sans + Newsreader)
- [ ] No layout shift when thumbnails load
