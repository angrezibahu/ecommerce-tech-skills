// Module-based curriculum structure
// Units reference existing lessonsData by dayRef
var modulesData = [
  {
    id: 1,
    title: "How the Internet Actually Works",
    subtitle: "Foundation",
    description: "Master the fundamentals that underpin every ecommerce system.",
    objectives: [
      "Explain what happens when a user visits your site",
      "Evaluate CDN and DNS proposals intelligently",
      "Understand database trade-offs for ecommerce",
      "Describe how APIs connect your tech stack"
    ],
    estimatedTime: "3–4 hours",
    units: [
      { id: "1-1", dayRef: 1, title: "DNS, HTTP & the Request Lifecycle", readingTime: "45 min",
        thinkLeader: {
          prompt: "Your CTO proposes moving your site's DNS to Cloudflare and enabling their CDN proxy. Your current DNS is managed by your domain registrar. What questions would you ask before approving this, and what risks would you want mitigated?",
          modelAnswer: "Key questions: (1) What's the rollback plan if Cloudflare has an outage? (2) Will SSL certificates auto-renew? (3) How long will DNS propagation take — can we do it in a maintenance window? (4) Does Cloudflare's proxy affect our analytics IP data? Risks: DNS misconfiguration can make entire site unreachable. Mitigations: Test on staging subdomain first, keep registrar DNS as fallback, schedule during low-traffic window, have rollback runbook ready."
        },
        diagram: {
          title: "DNS Lookup & HTTP Request Flow",
          definition: `graph LR
  A[Browser] -->|1 DNS query| B[DNS Resolver]
  B -->|2 IP address| A
  A -->|3 TCP connect| C[CDN Edge]
  C -->|4 cache hit| A
  C -->|5 cache miss| D[Origin Server]
  D -->|6 HTML response| C
  C -->|7 cached response| A
  style A fill:#00d4aa,color:#000
  style C fill:#3b82f6,color:#fff
  style D fill:#f59e0b,color:#000`
        }
      },
      { id: "1-2", dayRef: 2, title: "Client-Server Architecture & APIs", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your mobile team wants a separate API endpoint because 'the web API is too slow'. Your senior developer says the real problem is that you're fetching 50 fields when mobile needs 5. What do you do, and why?",
          modelAnswer: "The developer is almost certainly right. Start by measuring: add response-time logging to the existing API. If the slowness is payload size, the cheapest fix is adding a ?fields= query parameter. Only consider a separate API or GraphQL if: (1) the endpoints have fundamentally different auth requirements, (2) mobile needs very different data shapes across many endpoints, or (3) the team has the capacity to maintain two APIs. The worst outcome is duplicating business logic across two backends."
        }
      },
      { id: "1-3", dayRef: 3, title: "Databases — Where Your Data Lives", readingTime: "55 min",
        thinkLeader: {
          prompt: "Your developer says the site is slow and proposes switching from PostgreSQL to MongoDB. Your data includes customers, orders, products, and inventory — all highly relational. How do you respond?",
          modelAnswer: "Ask for evidence first: What's the slow query? Have they added indexes? What does EXPLAIN ANALYZE show? MongoDB solves specific problems (flexible schemas, massive write throughput for unstructured data) — none of which apply to typical ecommerce data. Relational data belongs in a relational database. The likely fixes are: add missing indexes, rewrite N+1 queries, add a caching layer for hot reads. A database migration is a 3-6 month project with high risk. Don't do it without proof it solves the specific problem."
        }
      },
      { id: "1-4", dayRef: 18, title: "APIs & Event Architecture", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your payment provider sends a webhook when an order is paid. Sometimes the webhook arrives before your order-creation process is complete, causing errors. What architectural approaches would you consider?",
          modelAnswer: "This is a classic race condition in event-driven systems. Options: (1) Idempotent webhook handler — store webhook events in a queue, process asynchronously, retry on failure. (2) Add a short delay + retry loop when the order isn't found yet. (3) Store webhooks in a pending table and process them after order creation. The root cause is that payment and order-creation are coupled but asynchronous. The most resilient pattern is to decouple: accept the webhook, acknowledge it immediately (return 200), then process it from a queue. This also handles payment provider retries gracefully."
        }
      }
    ],
    problemSet: {
      id: "ps-1",
      title: "Trace a Customer Order Through Your Tech Stack",
      scenario: "A customer on your UK ecommerce site clicks 'Buy Now' on a product page at 11:42am on Black Friday. Their browser is in Tokyo. The order succeeds but takes 8 seconds. You need to diagnose this.",
      parts: [
        { label: "Part A — Trace the Request",
          question: "Map out every technical step from the customer clicking 'Buy Now' to seeing 'Order confirmed'. Include: DNS, TCP/TLS, page request, API calls, database queries, payment processing, email confirmation. Estimate the time each step takes.",
          placeholder: "Write your step-by-step trace here. Be specific about which systems are involved at each stage and what could add latency..."
        },
        { label: "Part B — Diagnose the 8-Second Problem",
          question: "Given the customer is in Tokyo and your servers are in London, identify the top 3 causes of the 8-second load time and explain how you'd verify each one.",
          placeholder: "List your 3 hypotheses and how you'd test them..."
        },
        { label: "Part C — Fix It",
          question: "You have a £500/month budget for infrastructure improvements. The current bill is £200/month for a single London server. What would you change, and what improvement would you expect?",
          placeholder: "Describe your proposed changes and the expected impact on load time for Tokyo users..."
        }
      ],
      rubric: [
        { criterion: "Completeness of request trace", levels: ["Identified 3+ steps", "Identified most major steps with timing", "Comprehensive trace including all HTTP, DB, and payment steps"] },
        { criterion: "Quality of diagnosis", levels: ["Named a plausible cause", "Explained 2+ causes with reasoning", "Evidence-based diagnosis with specific metrics and test methodology"] },
        { criterion: "Decision quality on budget", levels: ["Proposed a change within budget", "Justified trade-offs between options", "Cost-benefit analysis with expected latency improvements quantified"] }
      ],
      interactive: "trace-request"
    }
  },
  {
    id: 2,
    title: "The Ecommerce Platform Layer",
    subtitle: "Architecture Decisions",
    description: "Understand how platform choices shape your business's agility and cost.",
    objectives: [
      "Compare monolith, headless, and composable architectures",
      "Evaluate platform proposals using real trade-off frameworks",
      "Understand how search and payments work technically",
      "Identify risks in replatforming projects"
    ],
    estimatedTime: "3–4 hours",
    units: [
      { id: "2-1", dayRef: 22, title: "Platform Architecture: Monolith vs Headless vs Composable", readingTime: "55 min",
        thinkLeader: {
          prompt: "Your CTO recommends migrating from Shopify to a headless architecture 'for flexibility'. The project is estimated at 6 months and £400k. Your site converts at 3.2% and handles 50k monthly visits. Should you approve this?",
          modelAnswer: "Almost certainly not at this stage. Headless solves specific problems: (1) You need custom frontend experiences Shopify can't support, (2) Your team can't iterate quickly in Shopify's constraints, (3) You need deep integrations with your own systems. At 50k monthly visits, Shopify handles the load fine. 3.2% conversion is solid — a 6-month engineering freeze could harm it. Ask: What specific customer or business outcome does this enable that we can't achieve today? If the answer is 'flexibility' or 'it's more modern', that's not a business case. If the answer is 'our personalisation roadmap requires it and here's the revenue projection', that's worth evaluating."
        },
        diagram: {
          title: "Platform Architecture Comparison",
          definition: `graph TD
  subgraph Monolith["Monolith (e.g. Shopify)"]
    M1[Frontend] --- M2[Backend Logic]
    M2 --- M3[Database]
  end
  subgraph Headless["Headless"]
    H1[Custom Frontend] -->|API| H2[Commerce Backend]
    H2 --- H3[Database]
  end
  subgraph Composable["Composable MACH"]
    C1[Frontend] -->|APIs| C2[OMS]
    C1 -->|APIs| C3[PIM]
    C1 -->|APIs| C4[Search]
    C1 -->|APIs| C5[Payments]
  end
  style Monolith fill:#1c1c1c,color:#f0f0f0
  style Headless fill:#1c1c1c,color:#f0f0f0
  style Composable fill:#1c1c1c,color:#f0f0f0`
        },
        decisionTree: {
          id: "platform-choice",
          start: "q1",
          nodes: {
            "q1": { type: "question", text: "Does your current platform block specific customer experience improvements you've identified?", options: [{ text: "Yes — we have specific examples", next: "q2" }, { text: "No — it's more of a general feeling", next: "r-stay" }] },
            "q2": { type: "question", text: "Does your team have 2+ experienced headless/React developers?", options: [{ text: "Yes", next: "q3" }, { text: "No / We'd need to hire", next: "r-hire-first" }] },
            "q3": { type: "question", text: "Is your monthly revenue above £500k?", options: [{ text: "Yes", next: "r-headless" }, { text: "No", next: "r-wait" }] },
            "r-stay": { type: "result", title: "Stay on your current platform", body: "General dissatisfaction isn't a business case. Identify specific customer outcomes being blocked, quantify the revenue impact, then revisit. Premature replatforming is one of the most expensive mistakes in ecommerce." },
            "r-hire-first": { type: "result", title: "Hire first, replatform second", body: "A headless architecture without headless expertise will take 2x as long and cost 3x as much. Hire or contract the right people before committing to the architecture." },
            "r-headless": { type: "result", title: "Headless may be justified", body: "You have the scale, the team, and the specific use cases. Get a detailed technical proposal with: phased migration plan, performance benchmarks, and a cost model for the first 2 years of operation." },
            "r-wait": { type: "result", title: "Too early — optimise the platform you have", body: "At this revenue level, the ROI on a replatform rarely justifies the risk and cost. Invest in conversion rate optimisation, performance, and personalisation within your existing platform first." }
          }
        }
      },
      { id: "2-2", dayRef: 20, title: "Search & Recommendations", readingTime: "45 min",
        thinkLeader: {
          prompt: "Your head of product wants to add 'AI-powered personalised recommendations' to the product listing pages. A vendor quotes £2k/month. What do you need to know before saying yes?",
          modelAnswer: "Key questions: (1) What metric are we optimising? (Average order value? Conversion rate? Click-through?) (2) How will we measure success — do we have an A/B testing framework? (3) What data does the vendor need, and does it comply with GDPR? (4) What's the integration effort — tag manager or API integration? (5) What's the contract length and exit clause? Start with a time-limited pilot (90 days) with a clear success metric. £2k/month is £24k/year — at typical ecommerce margins, you need ~£120k in attributable incremental revenue to justify it."
        }
      },
      { id: "2-3", dayRef: 17, title: "Payments & Checkout Flows", readingTime: "55 min",
        thinkLeader: {
          prompt: "Your checkout has a 68% abandonment rate. Your developer says the fix is to rewrite it in React. Your UX lead says it's a design problem. Your data analyst says there's a payment error affecting 4% of transactions. Where do you start?",
          modelAnswer: "Start with the 4% payment error — it's measurable, fixable, and directly costing revenue. 4% of transactions failing is significant: on 1000 orders/day at £60 AOV, that's £2,400/day in lost revenue. Fix that first. For abandonment, React won't fix a UX problem. Look at: (1) Where in checkout do users drop off? (2) What error messages do they see? (3) Is mobile checkout worse than desktop? Rewriting in React takes 3+ months. A checkout UX audit and fix might take 2 weeks. Always measure before building."
        }
      },
      { id: "2-4", dayRef: 4, title: "Caching & the Product Catalogue", readingTime: "50 min",
        thinkLeader: {
          prompt: "Marketing wants product prices to update in real-time for a flash sale. Engineering says changing the cache TTL will increase database load by 10x. How do you resolve this?",
          modelAnswer: "This is a caching strategy decision, not a conflict to resolve. Options: (1) Cache-busting on price change — when a price updates, explicitly invalidate that product's cache entry. No TTL needed. (2) Shorter TTL only during sale window (5 min instead of 60 min). (3) Cache prices separately from product data with a very short TTL. The underlying principle: don't invalidate all caches, invalidate specific keys. A good caching implementation should make this a routine operation, not a database-load emergency."
        }
      }
    ],
    problemSet: {
      id: "ps-2",
      title: "Evaluate a Replatforming Proposal",
      scenario: "You're the Head of Ecommerce at a £8M/year DTC brand. You're on Magento 2, which is slow to deploy and requires a dedicated developer to update. Your CTO has presented two options: (A) Migrate to Shopify Plus at £2k/month + 6 weeks effort, or (B) Build a headless frontend on Next.js connected to Shopify's Storefront API at £4k/month + 6 months effort.",
      parts: [
        { label: "Part A — Map the Trade-offs",
          question: "Create a decision matrix comparing Option A and Option B across: time-to-market, ongoing cost (3-year horizon), technical flexibility, team capability requirements, and risk.",
          placeholder: "Build your comparison matrix here..."
        },
        { label: "Part B — What Questions Would You Ask?",
          question: "List 5 questions you'd ask the CTO before making this decision. For each, explain why the answer changes your recommendation.",
          placeholder: "Your 5 questions and reasoning..."
        },
        { label: "Part C — Make the Call",
          question: "Which option do you recommend, and under what conditions would you change your answer?",
          placeholder: "Your recommendation and reasoning..."
        }
      ],
      rubric: [
        { criterion: "Trade-off analysis quality", levels: ["Listed pros and cons", "Quantified costs and timelines", "3-year TCO model with assumptions stated"] },
        { criterion: "Question quality", levels: ["Asked relevant questions", "Questions would change the decision", "Questions address risk, capability, and business outcomes"] },
        { criterion: "Decision clarity", levels: ["Made a recommendation", "Justified against criteria", "Acknowledged conditions that would flip the decision"] }
      ]
    }
  },
  {
    id: 3,
    title: "Frontend, Performance & User Experience",
    subtitle: "What Users Actually See",
    description: "Understand how browsers work, why performance matters, and how to make good frontend decisions.",
    objectives: [
      "Explain why Core Web Vitals matter for revenue",
      "Evaluate frontend framework proposals",
      "Interpret a Lighthouse report",
      "Make informed decisions about mobile and accessibility"
    ],
    estimatedTime: "3–4 hours",
    units: [
      { id: "3-1", dayRef: 9,  title: "How Browsers Render Pages", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your site's Largest Contentful Paint is 4.2s on mobile. Google Search Console shows this is affecting 60% of your traffic. Your developer says fixing it requires 'a full frontend rebuild'. Is that true?",
          modelAnswer: "Almost certainly not. LCP is usually caused by a few specific issues: (1) Hero image not preloaded or too large, (2) Render-blocking JavaScript in the <head>, (3) Slow server response time (TTFB), (4) Third-party scripts delaying the critical path. Each has a targeted fix. Ask your developer: which specific resource is the LCP element? (Chrome DevTools shows this in the Performance tab.) Then fix that element specifically. A full rebuild that doesn't address the root cause won't fix LCP."
        },
        diagram: {
          title: "Browser Critical Rendering Path",
          definition: `graph LR
  A[HTML] -->|Parse| B[DOM Tree]
  C[CSS] -->|Parse| D[CSSOM Tree]
  B --> E[Render Tree]
  D --> E
  E -->|Layout| F[Layout/Reflow]
  F -->|Paint| G[Paint]
  G -->|Composite| H[Screen]
  I[JavaScript] -->|Can block| B
  I -->|Can modify| D
  style H fill:#00d4aa,color:#000
  style I fill:#ef4444,color:#fff`
        }
      },
      { id: "3-2", dayRef: 14, title: "JavaScript Frameworks: React, Next.js & the Arguments", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your developers are arguing: one wants to use Next.js App Router, another wants to stay on Pages Router, and a third wants to migrate the whole site to Astro. You have 2 developers and 3 months. What do you decide?",
          modelAnswer: "With 2 developers and a 3-month window, framework migration is almost certainly not the right use of time. The real question is: what business outcome are we trying to improve? If it's performance: measure first, the problem might be images or third-party scripts, not the framework. If it's developer velocity: pick the option your team already knows. If it's SEO: both Next.js options support SSR/SSG. Astro is compelling for content-heavy sites but requires learning. My default answer: don't change the framework unless there's a measured problem it specifically solves."
        }
      },
      { id: "3-3", dayRef: 8,  title: "Accessibility, Mobile & Responsive Design", readingTime: "50 min",
        thinkLeader: {
          prompt: "Legal has warned you that your site may not be WCAG 2.1 AA compliant. Your developer says 'a full accessibility audit will take 3 months'. How do you triage this?",
          modelAnswer: "You don't need a full audit to start fixing. The 80/20 approach: (1) Run axe DevTools or WAVE on your 5 highest-traffic pages today. (2) Fix the critical issues: missing alt text, keyboard-inaccessible checkout, missing form labels, insufficient colour contrast. These are the most common and highest-risk. (3) Fix the checkout flow first — it's the revenue path and the most legally exposed. Prioritise by: severity (critical > serious > moderate), traffic, and legal risk. The goal isn't a perfect audit; it's demonstrably fixing the most important issues."
        }
      },
      { id: "3-4", dayRef: 10, title: "Core Web Vitals & Performance Budgets", readingTime: "45 min",
        thinkLeader: {
          prompt: "Your marketing team wants to add a new live chat widget, a cookie consent tool, and a retargeting pixel this quarter. Your developer says each adds ~200ms to load time. How do you respond?",
          modelAnswer: "This is a performance budget conversation. Start by establishing what your current LCP and TBT are, and what your budget is. If you're already at 3.5s LCP, 200ms × 3 tools = 4.1s — that's likely to push you into 'Poor' territory on Google's metrics. Questions to ask: (1) Is there a lighter-weight alternative to each tool? (2) Can they be loaded asynchronously/lazily so they don't block rendering? (3) What's the measured conversion impact of a 600ms slowdown vs the value each tool provides? Treat third-party scripts like features: they have a cost (performance) and a benefit (revenue). Require ROI justification."
        }
      }
    ],
    problemSet: {
      id: "ps-3",
      title: "Audit a Real Ecommerce Site's Performance",
      scenario: "Use Google PageSpeed Insights (pagespeed.web.dev) to audit a real ecommerce site of your choice — ideally a competitor or a site you know well. Run it on both mobile and desktop.",
      parts: [
        { label: "Part A — Read the Report",
          question: "Record the Core Web Vitals scores (LCP, FID/INP, CLS). What does each metric mean in plain English, and what's the user experience impact of the scores you found?",
          placeholder: "Site you audited, scores, and plain-English interpretation..."
        },
        { label: "Part B — Diagnose the Top 3 Issues",
          question: "PageSpeed shows 'Opportunities' and 'Diagnostics'. Pick the 3 highest-impact issues and explain: what's causing them, what the fix would be, and who on the team would own the fix.",
          placeholder: "Your top 3 issues with diagnosis and fix..."
        },
        { label: "Part C — Write a Brief",
          question: "Write a 3-bullet brief to your development team prioritising the fixes, with business justification for each.",
          placeholder: "Your engineering brief..."
        }
      ],
      rubric: [
        { criterion: "Metric interpretation", levels: ["Defined the metrics", "Linked metrics to user experience", "Connected metrics to business outcomes (conversion, SEO)"] },
        { criterion: "Diagnosis quality", levels: ["Identified issues from the report", "Explained root causes", "Proposed specific, actionable fixes with clear ownership"] },
        { criterion: "Communication quality", levels: ["Written a brief", "Brief prioritises by business impact", "Brief includes success metrics and acceptance criteria"] }
      ]
    }
  },
  {
    id: 4,
    title: "Data, Analytics & Personalisation",
    subtitle: "Measuring and Learning",
    description: "Understand how data flows through your stack and how to make decisions based on evidence.",
    objectives: [
      "Understand event tracking and tag management",
      "Identify the most common A/B testing mistakes",
      "Evaluate personalisation vendor proposals",
      "Design a measurement plan for a product launch"
    ],
    estimatedTime: "3–4 hours",
    units: [
      { id: "4-1", dayRef: 12, title: "Event Tracking & Tag Management", readingTime: "45 min",
        thinkLeader: {
          prompt: "Your analytics data shows that 30% of 'Add to Cart' events are duplicated. Marketing is making decisions based on this data. What do you do?",
          modelAnswer: "This is a data quality crisis. Steps: (1) Verify the duplication — is it in GA4 raw events, or in the reporting layer? Use DebugView. (2) Find the cause — duplicate event listeners, a GTM trigger firing twice, or multiple tag firing on SPA route changes. (3) Fix the root cause, not the symptoms. (4) Document the fix and the date, so historical analysis accounts for the data quality issue. (5) Alert marketing and put a hold on any decisions that relied on Add-to-Cart data until it's fixed. Bad data is worse than no data — people make confident wrong decisions."
        }
      },
      { id: "4-2", dayRef: 21, title: "A/B Testing — The Stats Your Team Gets Wrong", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your A/B test has been running for 5 days. Variant B shows +12% conversion rate with 78% statistical significance. Your CMO wants to ship Variant B immediately. What do you say?",
          modelAnswer: "Don't ship yet. 78% confidence means there's a 22% chance the result is noise — roughly 1 in 5. Industry standard is 95%. Also: 5 days isn't enough to capture weekly patterns (weekday vs weekend behaviour differs). You need: (1) 95%+ confidence, (2) at least 2 full business cycles (2 weeks minimum), (3) the test to have reached its pre-calculated sample size. Pre-calculating sample size before running the test prevents 'peeking' — the practice of stopping tests early when they look good, which inflates false positive rates. If the CMO insists, explain the risk: shipping a false positive could permanently harm conversion rate."
        }
      },
      { id: "4-3", dayRef: 16, title: "Customer Data Architecture: CDP, Auth & Privacy", readingTime: "55 min",
        thinkLeader: {
          prompt: "A vendor is pitching a Customer Data Platform for £3k/month. They claim it will 'unify all your customer data and enable personalisation'. What do you need to understand before evaluating this?",
          modelAnswer: "Key questions: (1) What specific personalisation use cases are we trying to enable, and why can't we do them today? (2) What data sources would feed the CDP, and what's the integration effort? (3) Who in the team will own it — CDP value is only realised if someone actively manages segments and activates them. (4) How does it handle GDPR consent — can it suppress data for opted-out users across all channels? (5) What's the lock-in risk — can we export our data? CDPs solve a real problem, but many companies buy them and never use them properly. Validate the use cases first."
        }
      },
      { id: "4-4", dayRef: 15, title: "Server-Side Rendering & SEO Data Flows", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your site uses client-side rendered JavaScript for product listings. You're ranking well for branded terms but poorly for category pages. Your SEO agency says 'Google can't crawl your pages'. Is that true, and what do you do?",
          modelAnswer: "It's partially true and increasingly less so — Googlebot does execute JavaScript, but with a delay (days to weeks in the 'second wave' of indexing). The result: CSR pages are indexed later and may miss real-time content changes. Solutions: (1) Server-Side Rendering (SSR) — pages render on the server, Google gets complete HTML immediately. (2) Static Site Generation (SSG) — pre-render pages at build time. (3) Dynamic Rendering — detect Googlebot and serve pre-rendered HTML only to it. For category pages with SEO value, SSR or SSG is worth the investment. Measure first: use Google Search Console's URL Inspection tool to see what Googlebot actually sees."
        }
      }
    ],
    problemSet: {
      id: "ps-4",
      title: "Design a Measurement Plan for a Product Launch",
      scenario: "You're launching a new 'buy now, pay later' payment option at checkout. The goal is to increase conversion rate and average order value. You have Google Analytics 4, a basic A/B testing tool, and a data analyst.",
      parts: [
        { label: "Part A — Define Success",
          question: "Write 3 specific, measurable success criteria for the BNPL launch. For each, state: the metric, the baseline (you can estimate), the target, and the timeframe.",
          placeholder: "Your 3 success criteria with baselines and targets..."
        },
        { label: "Part B — Design the Measurement",
          question: "What events do you need to track to measure success? Where in the funnel do you place them, and what properties do you capture on each event?",
          placeholder: "Your event tracking plan..."
        },
        { label: "Part C — Spot the Risks",
          question: "Name 3 ways this measurement could be misleading or wrong, and how you'd guard against each.",
          placeholder: "Your measurement risks and mitigations..."
        }
      ],
      rubric: [
        { criterion: "Success criteria quality", levels: ["Metrics are relevant", "Metrics are specific and measurable", "Metrics include leading indicators, baselines, and realistic targets"] },
        { criterion: "Tracking design", levels: ["Identified key events", "Specified event properties", "Complete tracking plan covering the full funnel"] },
        { criterion: "Critical thinking", levels: ["Named a risk", "Explained why it's misleading", "Proposed a specific mitigation for each risk"] }
      ]
    }
  },
  {
    id: 5,
    title: "Infrastructure, Security & Scaling",
    subtitle: "Keeping the Lights On",
    description: "Understand cloud infrastructure, how to survive peak traffic, and how to protect your customers.",
    objectives: [
      "Navigate cloud infrastructure proposals without being bamboozled",
      "Understand CDN and caching strategies for Black Friday",
      "Evaluate security risks: PCI-DSS, OWASP Top 10",
      "Understand CI/CD and what 'safe deployment' means"
    ],
    estimatedTime: "3–4 hours",
    units: [
      { id: "5-1", dayRef: 5, title: "CDNs, Caching & Surviving Black Friday", readingTime: "50 min",
        thinkLeader: {
          prompt: "It's 3 weeks before Black Friday. Your site went down last year at 10x normal traffic. Your developer says you need to 'upgrade the server'. What's the right conversation to have?",
          modelAnswer: "Upgrading the server (vertical scaling) is the least resilient solution. Better conversation: (1) Where did it fail last year — application server, database, third-party APIs? (2) Have you load tested? (3) Is the static content (images, CSS, JS) served via CDN, or from the same server taking the traffic? (4) Is the database connection pool sized for peak load? A CDN alone can deflect 80% of requests. Auto-scaling groups handle traffic spikes without manual intervention. The real answer is a load test at 20x normal traffic with monitoring, 4 weeks before the sale — so you have time to fix what breaks."
        },
        diagram: {
          title: "CDN & Origin Architecture",
          definition: `graph LR
  U1[User UK] -->|fast| CDN[CDN Edge London]
  U2[User US] -->|fast| CDN2[CDN Edge NYC]
  U3[User AU] -->|fast| CDN3[CDN Edge Sydney]
  CDN  -->|cache miss only| LB[Load Balancer]
  CDN2 -->|cache miss only| LB
  CDN3 -->|cache miss only| LB
  LB --> S1[App Server 1]
  LB --> S2[App Server 2]
  S1 --> DB[(Database)]
  S2 --> DB
  style CDN fill:#3b82f6,color:#fff
  style CDN2 fill:#3b82f6,color:#fff
  style CDN3 fill:#3b82f6,color:#fff
  style LB fill:#f59e0b,color:#000`
        }
      },
      { id: "5-2", dayRef: 6, title: "Load Balancing, Auto-scaling & Cloud Architecture", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your cloud bill doubled last month. Your developer says it's because 'traffic was higher'. You check and traffic was only up 20%. What questions do you ask?",
          modelAnswer: "A 20% traffic increase shouldn't double the bill. Questions: (1) Are auto-scaling groups scaling up but not scaling back down? (2) Are there runaway processes spinning up compute? (3) Did data transfer costs spike — are you serving large files without CDN? (4) Did someone provision resources for testing and forget to tear them down? (5) Are there unused reserved instances, orphaned snapshots, or idle load balancers? Set up cost alerts and budget thresholds. Most cloud providers have a Cost Explorer — look at cost by service, by day, and by resource tag."
        }
      },
      { id: "5-3", dayRef: 24, title: "Security: PCI-DSS, OWASP Top 10 & Auth", readingTime: "55 min",
        thinkLeader: {
          prompt: "Your security team has flagged that your checkout page has an XSS vulnerability. Your developer says it's 'low risk because it requires a logged-in user'. Do you agree?",
          modelAnswer: "No. XSS on a checkout page is critical, not low risk. A logged-in user is exactly the target — they have an active session with payment methods and personal data. XSS can: (1) steal session cookies and hijack accounts, (2) exfiltrate form data including card numbers if you're not using a hosted payment page, (3) redirect users to phishing pages. 'Requires a logged-in user' is not a mitigation — it's a description of who gets exploited. Fix it immediately. For context: this is OWASP Top 10 A03 (Injection), and PCI-DSS requires you to fix critical vulnerabilities within 30 days."
        }
      },
      { id: "5-4", dayRef: 25, title: "CI/CD, Staging Environments & Safe Deployments", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your team currently deploys by FTP-ing files to the production server on Friday afternoons. Your developer wants to set up CI/CD. Your CFO asks 'what's the ROI?'. How do you answer?",
          modelAnswer: "The ROI argument for CI/CD is risk reduction and velocity. Current risks with Friday FTP deployments: (1) No automated testing means bugs reach customers, (2) No rollback means a bad deploy requires manual FTP reversal under pressure, (3) Friday deployments mean weekend incidents when the team is offline. CI/CD benefits: (1) Tests run automatically — catch bugs before production, (2) Deploys are automated and repeatable — remove human error, (3) One-click rollback, (4) Deploy any day, not just Fridays. Quantify: how many hours were lost to production incidents in the last year? What did one bad deployment cost in lost revenue? CI/CD pays for itself after one prevented incident."
        }
      }
    ],
    problemSet: {
      id: "ps-5",
      title: "Black Friday Incident Response Simulation",
      scenario: "It's Black Friday, 09:02am. Traffic is 8x normal. Your on-call engineer sends this Slack message: 'Checkout is down. Orders failing. Error rate 45%. DB CPU at 100%. Response times >30s.' You have a team of 3 engineers and a £50k/hour revenue loss clock ticking.",
      parts: [
        { label: "Part A — Immediate Response (first 10 minutes)",
          question: "Write the first 5 actions you take in the first 10 minutes. Be specific about who does what and why the order matters.",
          placeholder: "Your incident response actions in priority order..."
        },
        { label: "Part B — Diagnose",
          question: "The DB CPU is at 100%. List 3 possible causes and how you'd quickly test each hypothesis without making the incident worse.",
          placeholder: "Your 3 diagnoses and test methods..."
        },
        { label: "Part C — Post-Incident",
          question: "The incident lasted 47 minutes. Write the key sections of a blameless post-mortem: timeline, root cause, what went well, what didn't, and 3 specific action items to prevent recurrence.",
          placeholder: "Your post-mortem structure..."
        }
      ],
      rubric: [
        { criterion: "Incident response quality", levels: ["Actions are relevant", "Actions are prioritised and explained", "Actions follow an incident response framework: communicate, isolate, mitigate, fix"] },
        { criterion: "Diagnosis quality", levels: ["Named a plausible cause", "Explained how to test without worsening the incident", "Hypotheses are evidence-based from the given symptoms"] },
        { criterion: "Post-mortem quality", levels: ["Wrote a timeline", "Identified root cause vs contributing factors", "Action items are specific, assigned, and address systemic issues"] }
      ],
      interactive: "incident-timeline"
    }
  },
  {
    id: 6,
    title: "Technical Leadership & Decision-Making",
    subtitle: "Thinking Like a CTO",
    description: "Build the frameworks to evaluate technology proposals, manage technical debt, and lead engineering teams.",
    objectives: [
      "Read and evaluate technical proposals critically",
      "Apply build vs buy decision frameworks",
      "Communicate about technical debt to non-technical stakeholders",
      "Write a technical strategy document"
    ],
    estimatedTime: "3–4 hours",
    units: [
      { id: "6-1", dayRef: 29, title: "Reading & Evaluating Technical Proposals", readingTime: "50 min",
        thinkLeader: {
          prompt: "Your CTO sends you a 40-page technical proposal for a new microservices architecture. You have a 1-hour meeting to discuss it. How do you prepare and what are the 5 questions you'll definitely ask?",
          modelAnswer: "Preparation: Read the executive summary and the risks section first. Find the 'what problem does this solve' statement and the success criteria — if either is missing, that's your first question. Five questions: (1) What specific customer or business problem does this solve, and how are we measuring success? (2) What's the total cost of ownership for year 1 and year 3, including operational overhead? (3) What's the minimum viable version, and can we start smaller? (4) What's the rollback plan if we're 6 months in and it's not working? (5) Which team members have done this before, and what did they learn? A good proposal answers these. A proposal that can't answer them isn't ready."
        }
      },
      { id: "6-2", dayRef: 27, title: "Build vs Buy — Decision Frameworks", readingTime: "45 min",
        thinkLeader: {
          prompt: "Your team wants to build a custom order management system because 'none of the vendors do exactly what we need'. The project is estimated at 9 months. How do you evaluate this?",
          modelAnswer: "9 months of engineering is roughly £360k–£540k in salary costs alone. Questions: (1) Have you fully evaluated the vendors? Which specific features are missing, and are they truly blockers or nice-to-haves? (2) Could you use a vendor and extend it (APIs, custom fields) to meet the gaps? (3) What's the ongoing maintenance cost of a custom build — who owns it, and what happens when that person leaves? (4) How does 'build' affect your roadmap — what are you not building for 9 months? The rule of thumb: only build custom if the capability is a genuine competitive advantage and no vendor comes close. OMS is not a competitive advantage for most brands."
        },
        decisionTree: {
          id: "build-vs-buy",
          start: "q1",
          nodes: {
            "q1": { type: "question", text: "Is this capability a genuine competitive differentiator for your business?", options: [{ text: "Yes — it's core to our unique value", next: "q2" }, { text: "No — it's table stakes / operational", next: "r-buy" }] },
            "q2": { type: "question", text: "Have you evaluated 3+ vendors and found them all genuinely insufficient?", options: [{ text: "Yes — evaluated and they don't meet our needs", next: "q3" }, { text: "Not really — we assumed they wouldn't work", next: "r-evaluate-first" }] },
            "q3": { type: "question", text: "Do you have the engineering capacity to build AND maintain this long-term?", options: [{ text: "Yes — dedicated team with relevant expertise", next: "r-build" }, { text: "No — it would stretch our current team", next: "r-buy-extend" }] },
            "r-buy": { type: "result", title: "Buy — and integrate well", body: "Operational capabilities (payments, search, OMS, reviews) have mature vendor solutions. Buying lets you focus engineering on differentiated capabilities. Negotiate good SLAs, data export rights, and avoid deep lock-in." },
            "r-evaluate-first": { type: "result", title: "Evaluate vendors properly first", body: "Build a scorecard with your actual requirements. Run a proof of concept with 2-3 vendors. Many 'we need to build it' decisions reverse after a proper vendor evaluation." },
            "r-build": { type: "result", title: "Build — but start small", body: "Start with an MVP that solves the core problem. Set clear success metrics. Plan for the operational overhead of maintaining custom software." },
            "r-buy-extend": { type: "result", title: "Buy a vendor and extend via API", body: "Most modern vendors have good APIs and extension points. Use them to add the custom behaviour you need without owning the core platform." }
          }
        }
      },
      { id: "6-3", dayRef: 26, title: "Technical Debt — When to Pay It Down", readingTime: "45 min",
        thinkLeader: {
          prompt: "Your engineering team says they need 'a quarter of no new features' to pay down technical debt. Your CMO says the roadmap can't slip. How do you navigate this?",
          modelAnswer: "This is a false binary. The real conversation: (1) Ask engineering to quantify the debt: which specific pieces of debt are slowing delivery, by how much? Can they show that Feature X takes 3 weeks because of Debt Y, when it should take 1 week? (2) Use the data to negotiate: '20% of sprint capacity for debt reduction' is sustainable and shows measurable velocity improvement. (3) Prioritise debt that creates risk (security vulnerabilities, single points of failure) over debt that's just messy. (4) Frame debt repayment as roadmap enablement: 'paying down the checkout debt unlocks 3 features that have been blocked for 6 months.' A full quarter with no features is a red flag — either the debt is catastrophic, or the ask isn't well-reasoned."
        }
      },
      { id: "6-4", dayRef: 30, title: "Technical Roadmapping & Vendor Strategy", readingTime: "50 min",
        thinkLeader: {
          prompt: "You've been asked to present a '12-month technology roadmap' to the board. You have 6 competing priorities from different stakeholders and no clear budget. How do you structure this?",
          modelAnswer: "A board-ready tech roadmap needs three things: business outcomes, not technology projects; a clear prioritisation rationale; and honest about constraints. Structure: (1) Start with business goals for the year (growth, efficiency, risk reduction). (2) Map technology work to those goals — each initiative should have a clear line to a business outcome. (3) Prioritise using a simple framework: impact × confidence / effort. (4) Be explicit about trade-offs — 'if we do A and B, we can't do C'. (5) Show risks and dependencies, not just happy-path delivery. What not to do: list every technical project the team wants to do. The board doesn't need to approve the architecture; they need to understand what the investment will achieve."
        }
      }
    ],
    problemSet: {
      id: "ps-final",
      title: "Final Project: Technical Strategy Document",
      scenario: "You've just joined as Head of Ecommerce Technology at StyleForward, a fashion retailer doing £15M/year online. The site is on Magento 1 (end-of-life), the checkout conversion is 1.8% (industry average: 2.5%), there's no A/B testing capability, the site takes 6 seconds to load on mobile, and the team is 2 developers. You have a budget of £500k/year for technology.",
      parts: [
        { label: "Part A — Current State Assessment",
          question: "Write a 'current state' section. What are the 3 most urgent risks, and what are the 3 biggest opportunities? Justify each with the data given.",
          placeholder: "Your current state assessment..."
        },
        { label: "Part B — 12-Month Priorities",
          question: "Given the constraints (£500k budget, 2 developers), what are your top 3 priorities for the next 12 months? For each: state the goal, the approach, the budget allocation, and how you'll measure success.",
          placeholder: "Your 3 priorities with rationale..."
        },
        { label: "Part C — What You Won't Do (and Why)",
          question: "Name 2 things that might seem like priorities but you're explicitly not doing in year 1, and explain why.",
          placeholder: "Your explicitly deferred items and rationale..."
        }
      ],
      rubric: [
        { criterion: "Prioritisation quality", levels: ["Identified important issues", "Justified priorities against data", "Priorities are sequenced logically with dependencies and risk considered"] },
        { criterion: "Commercial grounding", levels: ["Referenced business context", "Linked technology to revenue/cost outcomes", "Quantified expected impact with assumptions stated"] },
        { criterion: "Strategic maturity", levels: ["Made choices", "Explicitly acknowledged trade-offs", "Articulated what's NOT being done and why — shows genuine strategic thinking"] }
      ]
    }
  }
];
