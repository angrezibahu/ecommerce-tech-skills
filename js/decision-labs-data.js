// Decision Labs: Cross-cutting synthesis scenarios
// Each lab sits between weeks and requires integrating knowledge from multiple weeks

var decisionLabsData = [

    // ─── LAB 1: After Week 1 (Infrastructure) ────────────────────────────────
    {
        id: 1,
        afterWeek: 0,
        title: "The Replatforming Decision",
        tagline: "Synthesises: DNS, APIs, Databases, Caching, CDN, Scaling",
        duration: "60–90 min",
        scenario: `
<div class="lab-scenario">
<h3>🏗 The Situation</h3>
<p>You are the Commercial Director of <strong>Luminary Fashion</strong>, a UK-based ecommerce brand with £22M annual revenue. Your platform is Magento 1, which reached official end-of-life in June 2020.</p>
<p>Last Black Friday you suffered a <strong>4-hour outage</strong> that cost an estimated £190,000 in lost revenue. Post-mortem showed the database couldn't handle concurrent writes during the flash sale, and the CDN configuration caused cache poisoning that took three hours to diagnose.</p>
<p>Your CTO has presented three options. You must make a board-level recommendation within 48 hours.</p>
</div>

<h3>The Three Options</h3>
<table>
<tr><th>Option</th><th>Description</th><th>Upfront Cost</th><th>Annual Cost</th><th>Timeline</th></tr>
<tr><td><strong>A — Shopify Plus</strong></td><td>Migrate to hosted SaaS platform. Shopify manages infrastructure, hosting, and platform updates.</td><td>£80k (migration)</td><td>£60k (licence + apps)</td><td>4–6 months</td></tr>
<tr><td><strong>B — Headless on AWS</strong></td><td>Custom React frontend, Node.js API layer, PostgreSQL on RDS, Redis for caching, CloudFront CDN.</td><td>£380k (build)</td><td>£96k (infra + team)</td><td>10–14 months</td></tr>
<tr><td><strong>C — Emergency Magento 2 Patch</strong></td><td>Upgrade to Magento 2, optimise database indexes, add Redis caching, reconfigure CDN.</td><td>£95k (upgrade)</td><td>£24k (infra)</td><td>3–4 months</td></tr>
</table>

<h3>Additional Context</h3>
<ul>
<li>You serve customers in UK (60%), EU (25%), and are planning US expansion in 18 months</li>
<li>Your engineering team is 4 developers — none have AWS infrastructure experience</li>
<li>Your database has 2.1M customer records with complex order/product relationships</li>
<li>Current site serves ~8,000 concurrent users at peak; you expect 25,000 at next Black Friday</li>
<li>Your closest competitor just launched a headless PWA — your mobile conversion rate is 12% vs their reported 31%</li>
</ul>`,
        tasks: [
            { num: "01", label: "Infrastructure Readiness", prompt: "Evaluate each option against your scaling requirements. For Option B (headless AWS), what infrastructure components would you need for 25,000 concurrent users? What's your CDN strategy for UK, EU, and US customers? (Refer to: Days 1, 5, 6)" },
            { num: "02", label: "Data Architecture Risk", prompt: "Your 2.1M customer records have complex relational data (customers → orders → order_items → products → variants → inventory). Which option best preserves this structure? What migration risks exist with each? (Refer to: Day 3)" },
            { num: "03", label: "Performance Baseline", prompt: "Your current mobile conversion is 12%. What technical factors likely explain the gap with your competitor's 31%? How does each platform option address these factors? What caching strategy would you require? (Refer to: Days 4, 5)" },
            { num: "04", label: "Team Capability Gap", prompt: "Your team has no AWS experience. Option B requires them to manage DNS, load balancers, RDS, Redis, and CloudFront. What's the realistic risk? How does this change your recommendation? (Refer to: Days 1, 6)" },
            { num: "05", label: "Build vs Buy Decision", prompt: "Option A trades control for operational simplicity. Option B trades cost for flexibility. What questions would you ask to determine which matters more for Luminary Fashion right now?" }
        ],
        essay: {
            q: "Write your board recommendation. In 250–400 words, state which option you recommend, explain the three most important reasons using technical evidence from the scenario, quantify the key risks of your chosen option, and describe the one condition under which you would change your recommendation.",
            guide: "Strong answers will reference specific technical factors (not just cost): database migration complexity for relational data, CDN strategy for multi-region, engineering team capability gap for headless. Avoid recommending the 'newest' option without addressing the team capability gap. The best answers acknowledge trade-offs explicitly."
        }
    },

    // ─── LAB 2: After Week 2 (Frontend) ──────────────────────────────────────
    {
        id: 2,
        afterWeek: 1,
        title: "The Performance Crisis",
        tagline: "Synthesises: Core Web Vitals, CSS, JavaScript, Caching, CDN, Accessibility",
        duration: "60–90 min",
        scenario: `
<div class="lab-scenario">
<h3>⚡ The Situation</h3>
<p>You are the Head of Ecommerce at <strong>Meridian Outdoors</strong>, a £14M outdoor equipment retailer. Your SEO agency has just sent an urgent report: Google Search Console shows your Core Web Vitals are now rated <strong>"Poor"</strong> across all key page types.</p>

<table>
<tr><th>Page</th><th>LCP</th><th>CLS</th><th>FID / INP</th><th>Rating</th></tr>
<tr><td>Homepage</td><td>8.2s</td><td>0.45</td><td>380ms</td><td style="color:#f85149">Poor</td></tr>
<tr><td>Category Pages</td><td>6.8s</td><td>0.28</td><td>290ms</td><td style="color:#f85149">Poor</td></tr>
<tr><td>Product Pages</td><td>5.1s</td><td>0.18</td><td>210ms</td><td style="color:#d29922">Needs Improvement</td></tr>
<tr><td>Checkout</td><td>4.2s</td><td>0.05</td><td>180ms</td><td style="color:#d29922">Needs Improvement</td></tr>
</table>
</div>

<p>Organic traffic has dropped <strong>23% over three months</strong>, costing approximately £85,000/month in revenue. A major spring campaign is booked to launch in <strong>4 weeks</strong>, generating an estimated £400k in paid spend.</p>

<h3>Root Cause Analysis from Engineering</h3>
<p>Your lead developer has identified three culprits:</p>
<ol>
<li><strong>Hero images:</strong> Homepage hero is a 4.8MB unoptimised JPEG served from the same London origin server for all users (no CDN). Images have no width/height attributes, causing significant layout shift when they load.</li>
<li><strong>Third-party scripts:</strong> A/B testing tool, live chat, three analytics libraries, and an affiliate tracking pixel total 2.3MB of JavaScript loaded synchronously in the <code>&lt;head&gt;</code>. Combined parse + execution time: 1.8 seconds on mid-range mobile.</li>
<li><strong>CSS architecture:</strong> 680KB of CSS loaded on every page, including styles for components that don't exist on most pages. No critical CSS extraction. Render-blocking on all pages.</li>
</ol>

<h3>Additional Context</h3>
<ul>
<li>Mobile accounts for 67% of your traffic but only 19% of revenue (industry average: ~35%)</li>
<li>Your site has 43 accessibility errors flagged by an axe audit — your legal team raised this separately</li>
<li>Engineering estimates: full fix = 16 weeks. Marketing wants "something" in 4 weeks for the campaign.</li>
<li>Your CDN contract expired 6 weeks ago and wasn't renewed — site now serves from a single London server</li>
</ul>`,
        tasks: [
            { num: "01", label: "Triage and Prioritise", prompt: "You have 4 weeks before the campaign. Which of the three root causes has the highest impact-to-effort ratio? For each issue, estimate the LCP improvement it would produce and the engineering hours required. (Refer to: Days 5, 10, 13)" },
            { num: "02", label: "The JavaScript Audit", prompt: "2.3MB of third-party JavaScript is catastrophic for FID/INP. List the questions you'd ask to decide which scripts are truly essential vs removable. What's the business case for removing the A/B testing tool temporarily? (Refer to: Days 10, 11, 13)" },
            { num: "03", label: "CSS Emergency Fix", prompt: "680KB of CSS on every page is the slow poison. You can't do a full rewrite in 4 weeks. What's the 80/20 approach — what specific, targeted CSS changes would give the biggest performance gain in the shortest time? (Refer to: Days 9, 10)" },
            { num: "04", label: "The Accessibility Intersection", prompt: "The 43 accessibility errors include missing image alt text and fake button elements. Fixing these also improves Core Web Vitals (alt text prevents layout shift; native buttons reduce INP). How do you frame the accessibility work as a performance win, not a separate compliance project? (Refer to: Days 8, 10)" },
            { num: "05", label: "Campaign Decision", prompt: "Marketing insists the campaign launches in 4 weeks regardless. Engineering says full remediation takes 16 weeks. You need to make a call. What's your decision and how do you communicate the residual risk to the CMO?" }
        ],
        essay: {
            q: "Write a technical performance brief for your CMO (250–400 words). It must: (1) explain what Core Web Vitals are and why they matter to the campaign, in plain English; (2) present your 4-week emergency plan with specific actions; (3) quantify the expected improvement; and (4) clearly state what risk remains after 4 weeks and why the 16-week roadmap is also necessary.",
            guide: "Strong answers will not just list fixes — they will explain why each fix works (e.g., 'adding width/height to images removes layout shift because the browser can reserve space before the image loads'). The best answers also acknowledge the campaign risk honestly rather than promising outcomes that can't be guaranteed."
        }
    },

    // ─── LAB 3: After Week 3 (Backend & Integrations) ────────────────────────
    {
        id: 3,
        afterWeek: 2,
        title: "The Security Breach Response",
        tagline: "Synthesises: Authentication, Payment Security, APIs, Webhooks, Incident Management",
        duration: "75–90 min",
        scenario: `
<div class="lab-scenario">
<h3>🚨 The Situation</h3>
<p>It is <strong>2:47am on the Wednesday before Black Friday</strong>. Your on-call engineer pages you with an alert from your SIEM (Security Information and Event Management) tool:</p>
<pre>ALERT: Anomalous database query pattern detected
Timestamp: 02:31 UTC
Source IP: 185.220.101.47 (known Tor exit node)
Query pattern: Sequential SELECT on customers table
Rows accessed: ~47,000 (estimated)
Duration: 18 minutes before session terminated
Affected tables: customers, orders, payment_methods (tokenised)
Auth: Valid session token — user account ID: 8821 (inactive account, last login 2019)</pre>
</div>

<p>A preliminary investigation shows:</p>
<ul>
<li>Account 8821 is a former contractor whose account was never deactivated</li>
<li>The account had admin-level database read access</li>
<li>The session token was issued 3 hours ago from an IP not previously associated with this account</li>
<li>Your payment processor (Stripe) has just called — they've detected unusual card-not-present fraud patterns on cards that were used on your site in the last 6 months</li>
<li>Your database stores: email addresses, hashed passwords (bcrypt), delivery addresses, order history, and <strong>Stripe payment method tokens</strong> (not raw card numbers)</li>
<li>Your site serves 180,000 registered customers</li>
</ul>

<h3>Legal and Regulatory Context</h3>
<ul>
<li>Under GDPR, you have <strong>72 hours</strong> to notify the ICO if the breach is likely to result in risk to individuals</li>
<li>Under PCI DSS, you must notify your payment processor and potentially card brands</li>
<li>Black Friday is in <strong>68 hours</strong></li>
</ul>`,
        tasks: [
            { num: "01", label: "Immediate Containment (First 30 Minutes)", prompt: "List in priority order the first five technical actions you take right now. For each, state why it matters and what the cost of delay is. Consider: the live session, the compromised account, Black Friday, and your payment processor. (Refer to: Days 16, 17, 26)" },
            { num: "02", label: "Assess the Blast Radius", prompt: "Stripe payment method tokens are not raw card numbers — but Stripe has called about fraud. Is this a contradiction? Explain what a payment token is, what an attacker could do with 47,000 customer records (without raw card numbers), and whether your customers are at risk. (Refer to: Days 16, 17)" },
            { num: "03", label: "The Black Friday Decision", prompt: "It is 3am Wednesday. Black Friday is in 68 hours. You have a partial breach, unknown attack scope, and a major revenue event approaching. What are the arguments for launching as planned vs delaying? What additional information do you need before deciding? (Refer to: Day 26)" },
            { num: "04", label: "Systems and Process Failures", prompt: "This breach happened because an inactive contractor account had admin read access and was never deactivated. This is an authentication and access control failure. List every process and technical control that failed, and for each, describe the fix. (Refer to: Days 16, 24)" },
            { num: "05", label: "Webhook and Monitoring Gaps", prompt: "Your SIEM detected the breach, but the attacker accessed 47,000 rows over 18 minutes before the alert fired. Why is that detection window so long? What real-time monitoring and webhook-based alerting would have caught this faster? (Refer to: Days 18, 22, 23)" }
        ],
        essay: {
            q: "Write your incident response communication (250–400 words total across two audiences): (1) A 100-word Slack message to your engineering team at 3am with immediate actions assigned; (2) A 200-word brief to your CEO at 8am explaining what happened, what you've done, what you don't yet know, and your recommendation on Black Friday. (3) One paragraph explaining whether you believe customer notification is required and why.",
            guide: "Strong answers to part (1) will be decisive and specific — not 'look into the breach' but 'revoke session token for account 8821 immediately, rotate all admin session tokens, lock all inactive accounts.' Part (2) should be honest about uncertainty — CEOs need to know what you don't know. Part (3) requires applying the GDPR 72-hour rule to the actual data types exposed."
        }
    },

    // ─── LAB 4: After Week 4 (Operations) ────────────────────────────────────
    {
        id: 4,
        afterWeek: 3,
        title: "The Vendor Shake-Up",
        tagline: "Synthesises: Payment Integration, Security, CI/CD, Monitoring, Cost Optimisation, Technical Leadership",
        duration: "75–90 min",
        scenario: `
<div class="lab-scenario">
<h3>💳 The Situation</h3>
<p>You are the CTO of <strong>Compass Commerce</strong>, a £35M multi-category ecommerce business. On Monday morning you receive a letter from Stripe announcing a <strong>35% price increase</strong> effective in 90 days. Your current Stripe bill is £41,000/month. The increase adds <strong>£172,000/year</strong> to your cost base.</p>
<p>By Tuesday, three competitors have reached out:</p>
</div>

<table>
<tr><th>Provider</th><th>Rate</th><th>Annual Saving vs New Stripe</th><th>Their Pitch</th></tr>
<tr><td><strong>Adyen</strong></td><td>0.3% + 11p</td><td>~£89k/year</td><td>"Enterprise-grade, used by H&M, eBay. Lower fraud rates. 3–6 month integration."</td></tr>
<tr><td><strong>PayPal Braintree</strong></td><td>1.9% + 30p</td><td>~£22k/year</td><td>"Includes PayPal checkout (12% uplift claimed). Stripe-compatible SDK. 4–8 week migration."</td></tr>
<tr><td><strong>Checkout.com</strong></td><td>0.4% + 15p</td><td>~£67k/year</td><td>"Better auth rates for EU cards, lower decline rates. 6–9 month integration."</td></tr>
</table>

<h3>Engineering Context</h3>
<p>Your lead developer has provided a technical brief:</p>
<ul>
<li>Stripe is deeply embedded: checkout, subscriptions (12% of revenue), refunds, dispute handling, 3D Secure flows, and webhooks for order management are all Stripe-native</li>
<li>You process ~£2.9M/month across 14,000 transactions</li>
<li>Current auth rate: 94.2%. Industry benchmark: 96–97% for optimised processors</li>
<li>Your payment code has no abstraction layer — Stripe SDK is called directly throughout the codebase</li>
<li>You have a 4-week code freeze starting in 75 days for your Christmas trading period</li>
</ul>

<h3>Additional Pressures</h3>
<ul>
<li>Your CFO wants the cost saving actioned within 90 days to hit this year's budget</li>
<li>Your engineering team is currently mid-way through a 16-week platform migration project</li>
<li>Last year, a botched payment provider migration at a competitor caused a 6-hour checkout outage on Cyber Monday</li>
<li>Stripe has indicated they are willing to negotiate on price for customers over £30k/month spend</li>
</ul>`,
        tasks: [
            { num: "01", label: "Total Cost of Ownership", prompt: "The CFO is focused on the £172k saving. But switching has hidden costs. List every cost — technical, operational, and business — of switching payment provider. What's the real net saving of each option once you account for migration, testing, potential downtime, and authorisation rate changes? (Refer to: Days 17, 25, 27)" },
            { num: "02", label: "The Auth Rate Opportunity", prompt: "Your current auth rate is 94.2% against an industry benchmark of 96–97%. On £2.9M/month in GMV, each 1% improvement in auth rate is worth approximately £29,000/month. How does this change the decision? Which provider's auth rate claims should you validate, and how? (Refer to: Days 17, 22)" },
            { num: "03", label: "Technical Risk Assessment", prompt: "Your payment code has no abstraction layer — Stripe is called directly throughout. Adyen claims 3–6 months for migration. What technical work is required? Why does the lack of abstraction layer make this harder? What would you do differently in future? (Refer to: Days 17, 25)" },
            { num: "04", label: "The Negotiation Option", prompt: "Stripe has indicated willingness to negotiate. You spend £492k/year with them. Design your negotiation strategy: what information do you bring to the table, what concessions do you ask for, what's your walk-away position, and how do competitor quotes change your leverage? (Refer to: Day 17)" },
            { num: "05", label: "Decision Under Constraint", prompt: "You have a 90-day deadline, a 4-week code freeze at day 75, an ongoing 16-week migration project, and a team that has never executed a payment migration. What's your recommendation? If you switch, which provider and why? If you negotiate, what's your target rate? If you delay, what do you tell the CFO? (Refer to: Days 26, 29, 30)" }
        ],
        essay: {
            q: "Write your recommendation memo to the CFO and CEO (300–450 words). You must: (1) clearly state your recommended course of action (switch / negotiate / hybrid approach); (2) quantify the 12-month financial impact of your recommendation including migration costs; (3) explain the top two technical risks and how you mitigate them; (4) define the decision point — what would have to be true for you to change course; and (5) state what you need approved in the next 7 days to begin.",
            guide: "The strongest answers will not choose purely on headline rate — they'll recognise that the auth rate improvement opportunity may exceed the rate saving, that the no-abstraction-layer problem is a significant migration risk, and that Stripe's negotiation openness is a material factor. The best answers acknowledge the timing constraint (code freeze + ongoing migration) without using it as a reason to do nothing."
        }
    }
];
