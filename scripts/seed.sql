-- Create resources table
create table if not exists resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null unique,
  domain text not null,
  description text not null,
  category text not null,
  og_image_url text,
  favicon_url text,
  og_fetched_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table resources enable row level security;

-- Create policy for public read access
create policy "Allow public read access" on resources
  for select using (true);

-- Seed data: Launch
insert into resources (title, url, domain, description, category) values
  ('Product Hunt', 'https://producthunt.com', 'producthunt.com', 'Launch and discover new products', 'launch'),
  ('Hacker News Show HN', 'https://news.ycombinator.com/show', 'news.ycombinator.com', 'Share what you''ve built with the HN community', 'launch'),
  ('BetaList', 'https://betalist.com', 'betalist.com', 'Discover and get early access to startups', 'launch'),
  ('Indie Hackers', 'https://indiehackers.com', 'indiehackers.com', 'Connect with founders building profitable businesses', 'launch'),
  ('Uneed', 'https://uneed.best', 'uneed.best', 'Free tool directory for launching products', 'launch'),
  ('MicroLaunch', 'https://microlaunch.net', 'microlaunch.net', 'Launch your micro-SaaS to an engaged audience', 'launch'),
  ('Launching.io', 'https://launching.io', 'launching.io', 'Step-by-step launch checklist for makers', 'launch')
on conflict (url) do nothing;

-- Seed data: Reddit
insert into resources (title, url, domain, description, category) values
  ('r/SideProject', 'https://reddit.com/r/SideProject', 'reddit.com', 'Share and get feedback on side projects', 'reddit'),
  ('r/indiehackers', 'https://reddit.com/r/indiehackers', 'reddit.com', 'Reddit community for indie hackers and solo founders', 'reddit'),
  ('r/startups', 'https://reddit.com/r/startups', 'reddit.com', 'Discuss startup strategies and get advice', 'reddit'),
  ('r/Entrepreneur', 'https://reddit.com/r/Entrepreneur', 'reddit.com', 'Community for entrepreneurs at every stage', 'reddit'),
  ('r/SaaS', 'https://reddit.com/r/SaaS', 'reddit.com', 'Discuss SaaS building, pricing, and growth', 'reddit'),
  ('r/webdev', 'https://reddit.com/r/webdev', 'reddit.com', 'Web development discussions and resources', 'reddit'),
  ('r/artificial', 'https://reddit.com/r/artificial', 'reddit.com', 'Discuss AI developments and applications', 'reddit')
on conflict (url) do nothing;

-- Seed data: Slack
insert into resources (title, url, domain, description, category) values
  ('Lenny''s Community', 'https://lennysnewsletter.com/community', 'lennysnewsletter.com', 'Premium Slack for product managers and growth leads', 'slack'),
  ('Indie Worldwide', 'https://indieworldwide.com', 'indieworldwide.com', 'Slack community for indie makers worldwide', 'slack'),
  ('Online Geniuses', 'https://onlinegeniuses.com', 'onlinegeniuses.com', 'Largest marketing Slack community', 'slack'),
  ('DevChat', 'https://devchat.devolio.com', 'devchat.devolio.com', 'Slack for developers to connect and share', 'slack'),
  ('Launch House', 'https://launchhouse.com', 'launchhouse.com', 'Community for ambitious tech builders', 'slack')
on conflict (url) do nothing;

-- Seed data: Building
insert into resources (title, url, domain, description, category) values
  ('YC Startup Library', 'https://ycombinator.com/library', 'ycombinator.com', 'Y Combinator''s startup library and founder resources', 'building'),
  ('Build in Public', 'https://buildinpublic.com', 'buildinpublic.com', 'Resources and guides for building in public', 'building'),
  ('Stripe Atlas', 'https://stripe.com/atlas', 'stripe.com', 'Incorporate and set up your startup', 'building'),
  ('Cursor', 'https://cursor.com', 'cursor.com', 'AI-powered code editor for vibe coding', 'building'),
  ('v0 by Vercel', 'https://v0.dev', 'v0.dev', 'Generate UI components with AI', 'building'),
  ('Supabase', 'https://supabase.com', 'supabase.com', 'Open source Firebase alternative with Postgres', 'building'),
  ('Replit', 'https://replit.com', 'replit.com', 'Collaborative browser IDE with AI assistance', 'building')
on conflict (url) do nothing;

-- Seed data: AI Marketing
insert into resources (title, url, domain, description, category) values
  ('Marketing with Claude', 'https://docs.anthropic.com/en/docs/about-claude/use-case-guides/marketing', 'docs.anthropic.com', 'Use Claude for marketing copy, strategy, and content', 'ai-marketing'),
  ('ChatGPT for Marketing', 'https://openai.com/chatgpt', 'openai.com', 'AI-powered marketing workflows with ChatGPT', 'ai-marketing'),
  ('Copy.ai', 'https://copy.ai', 'copy.ai', 'Generate marketing copy with AI', 'ai-marketing'),
  ('Jasper', 'https://jasper.ai', 'jasper.ai', 'Enterprise AI for marketing teams', 'ai-marketing'),
  ('Smartlead', 'https://smartlead.ai', 'smartlead.ai', 'AI-powered cold email outreach at scale', 'ai-marketing'),
  ('Writesonic', 'https://writesonic.com', 'writesonic.com', 'AI writing tool for blogs, ads, and social media', 'ai-marketing')
on conflict (url) do nothing;

-- Seed data: SEO & Marketing
insert into resources (title, url, domain, description, category) values
  ('Ahrefs', 'https://ahrefs.com', 'ahrefs.com', 'Comprehensive SEO toolset and learning resources', 'seo'),
  ('Google Search Console', 'https://search.google.com/search-console', 'search.google.com', 'Free tool to monitor search performance', 'seo'),
  ('Backlinko', 'https://backlinko.com', 'backlinko.com', 'Actionable SEO advice and link building strategies', 'seo'),
  ('SparkToro', 'https://sparktoro.com', 'sparktoro.com', 'Find where your audience hangs out online', 'seo'),
  ('Buffer', 'https://buffer.com', 'buffer.com', 'Schedule and analyze social media content', 'seo'),
  ('ConvertKit', 'https://convertkit.com', 'convertkit.com', 'Email marketing built for online creators', 'seo'),
  ('Plausible', 'https://plausible.io', 'plausible.io', 'Simple, privacy-focused web analytics', 'seo')
on conflict (url) do nothing;
