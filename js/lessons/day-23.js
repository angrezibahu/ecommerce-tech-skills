// Day 23: Performance Monitoring & Observability
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[23] = {
  "day": 23,
  "week": 3,
  "title": "Performance Monitoring & Observability",
  "desc": "Proactive monitoring, metrics, and alerting",
  "duration": "55 min",
  "coldOpen": "Your site was down for 45 minutes before you knew—customers reported it. Your team says 'we have Google Analytics'. Is that enough? What monitoring do you actually need?",
  "coldRevisit": "Google Analytics shows user behavior but misses technical failures. Need: 1) Uptime monitoring (is site up?), 2) Error tracking (what's breaking?), 3) Performance monitoring (is it slow?), 4) Business metrics (revenue impact). Alert BEFORE customers notice.",
  "content": "<h2>Why This Matters to You</h2><p>Finding out about outages from customers is embarrassing and costly. 45 minutes of downtime for an ecommerce site doing £1M/month = £30k lost revenue. Proactive monitoring catches issues before customers notice, provides data for root cause analysis, and helps you evaluate if technical problems are affecting revenue.</p><h2>1. The Four Pillars of Monitoring</h2><table><tr><th>Pillar</th><th>What It Monitors</th><th>Questions Answered</th><th>Tools</th></tr><tr><td><strong>Uptime</strong></td><td>Is site accessible?</td><td>Can customers reach us?</td><td>Pingdom, UptimeRobot</td></tr><tr><td><strong>Errors</strong></td><td>Application exceptions</td><td>What's breaking? Where?</td><td>Sentry, Rollbar</td></tr><tr><td><strong>Performance</strong></td><td>Speed, resource usage</td><td>Is site slow? Why?</td><td>New Relic, Datadog</td></tr><tr><td><strong>Business</strong></td><td>Conversions, revenue</td><td>Technical issues affecting sales?</td><td>Google Analytics, Mixpanel</td></tr></table><h2>2. Uptime Monitoring</h2><pre>// External monitoring (checks from outside)\nPingdom checks every 60 seconds:\n├─ https://yoursite.com → 200 OK ✓\n├─ https://yoursite.com/api/health → 200 OK ✓\n├─ https://yoursite.com/checkout → 200 OK ✓\n\nIf ANY check fails:\n1. Retry 3 times (avoid false positives)\n2. Alert via: SMS, email, Slack, PagerDuty\n3. Start incident timer\n\nCost: $10-50/month\nValue: Know instantly when site is down</pre><h3>Uptime SLAs</h3><table><tr><th>SLA</th><th>Downtime/Year</th><th>Downtime/Month</th><th>Realistic?</th></tr><tr><td>99%</td><td>3.65 days</td><td>7.2 hours</td><td>Too low</td></tr><tr><td>99.9% (three nines)</td><td>8.76 hours</td><td>43.2 minutes</td><td>Good target</td></tr><tr><td>99.99% (four nines)</td><td>52.6 minutes</td><td>4.3 minutes</td><td>Expensive to achieve</td></tr><tr><td>99.999% (five nines)</td><td>5.26 minutes</td><td>26 seconds</td><td>Reserved for critical systems</td></tr></table><div class=\"info-box\"><div class=\"info-title\">💡 The 99.9% Target</div><p>Most ecommerce sites should target 99.9% uptime (43 minutes downtime/month). Going from 99.9% to 99.99% typically doubles infrastructure costs. Only pursue higher SLAs if downtime cost justifies investment.</p></div><h2>3. Error Monitoring</h2><pre>// Sentry integration (catches JavaScript/backend errors)\n// Automatically captures:\n\n// Frontend errors\ntry {\n  JSON.parse(invalidJSON);\n} catch (error) {\n  // Sentry captures: error message, stack trace, user context, breadcrumbs\n}\n\n// Backend errors\napp.post('/checkout', async (req, res) => {\n  try {\n    await processCheckout(req.body);\n  } catch (error) {\n    // Sentry captures: error, request data, user ID, environment\n    Sentry.captureException(error);\n    res.status(500).json({ error: 'Checkout failed' });\n  }\n});\n\n// Sentry dashboard shows:\n// - Error frequency (100 errors/hour → spike detected)\n// - Affected users (500 users affected)\n// - Stack traces (exact line where error occurred)\n// - Release tracking (error started in v2.3.1)\n// - Breadcrumbs (what user did before error)</pre><h2>4. Performance Monitoring (APM)</h2><pre>// Application Performance Monitoring tracks:\n\n// Response times (percentiles)\np50: 200ms   // 50% of requests faster than this (median)\np90: 450ms   // 90% faster\np95: 800ms   // 95% faster (important: catches slow outliers)\np99: 2000ms  // 99% faster (very slow edge cases)\n\nWhy percentiles > average?\nAverage: 300ms (looks fine)\np95: 5000ms (5% of users wait 5 seconds!)\n\nPercentiles reveal problems average hides.</pre><h2>5. Key Metrics to Track</h2><table><tr><th>Metric</th><th>What It Measures</th><th>Target</th><th>Alert If</th></tr><tr><td><strong>Uptime %</strong></td><td>Site availability</td><td>99.9%</td><td>Site down > 1 min</td></tr><tr><td><strong>Error rate</strong></td><td>% of requests failing</td><td>< 0.1%</td><td>> 1% or 10x baseline</td></tr><tr><td><strong>p95 response time</strong></td><td>95th percentile speed</td><td>< 500ms</td><td>> 1000ms</td></tr><tr><td><strong>Apdex score</strong></td><td>User satisfaction (0-1)</td><td>> 0.9</td><td>< 0.8</td></tr><tr><td><strong>Checkout completion</strong></td><td>% who complete checkout</td><td>75-80%</td><td>< 70% or 20% drop</td></tr><tr><td><strong>Revenue/hour</strong></td><td>Business health</td><td>Baseline × 0.8</td><td>30%+ drop</td></tr></table><h2>6. Alerting Strategy</h2><pre>// Alert levels (prioritize correctly)\n\n🚨 CRITICAL (wake up team)\n- Site completely down\n- Payment processing failing\n- Error rate > 5%\n- Revenue dropped 50%\nAction: Immediate response required\n\n⚠️ WARNING (investigate during work hours)\n- p95 response time > 1000ms\n- Error rate > 0.5%\n- Checkout completion < 70%\nAction: Investigate root cause, plan fix\n\n📊 INFO (track trends)\n- Traffic spike (not necessarily bad)\n- Slow gradual degradation\n- Resource usage increasing\nAction: Monitor, plan capacity\n\n// Alert fatigue prevention:\n// 1. Use thresholds (not every error)\n// 2. Group related alerts\n// 3. Suppress during known maintenance\n// 4. Escalate only critical alerts to SMS</pre><h2>7. Monitoring Stack (Typical Setup)</h2><table><tr><th>Tool</th><th>Purpose</th><th>Cost</th><th>Setup Time</th></tr><tr><td><strong>Pingdom</strong></td><td>Uptime monitoring</td><td>$10-50/mo</td><td>30 minutes</td></tr><tr><td><strong>Sentry</strong></td><td>Error tracking</td><td>$26-80/mo</td><td>1 hour</td></tr><tr><td><strong>New Relic/Datadog</strong></td><td>APM (performance)</td><td>$100-500/mo</td><td>2-4 hours</td></tr><tr><td><strong>LogRocket/FullStory</strong></td><td>Session replay</td><td>$100-300/mo</td><td>2 hours</td></tr><tr><td><strong>Google Analytics</strong></td><td>Business metrics</td><td>Free-$150k/yr</td><td>1 hour</td></tr></table><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The Minimum Setup</div><p>At minimum, you MUST have:<br>1. Uptime monitoring (Pingdom, $10/mo)<br>2. Error tracking (Sentry, $26/mo)<br>3. Business metrics (Google Analytics, free)<br><br>Without these, you're flying blind. Total cost: $36/month = 2% of one developer's salary.</p></div><h2>8. Dashboards That Matter</h2><pre>// Executive dashboard (daily review)\n┌─────────────────────────────────────┐\n│  Yesterday's Health                │\n├─────────────────────────────────────┤\n│  Uptime:           99.95% ✓         │\n│  Error rate:       0.03% ✓          │\n│  p95 latency:      420ms ✓          │\n│  Checkout rate:    77% ✓            │\n│  Revenue:          £34,567 (+3%)    │\n│  Incidents:        0 ✓              │\n└─────────────────────────────────────┘\n\n// Engineering dashboard (real-time)\n┌─────────────────────────────────────┐\n│  Right Now                         │\n├─────────────────────────────────────┤\n│  Requests/sec:     245              │\n│  Error rate:       0.01%            │\n│  Active users:     1,234            │\n│  Response times:   p50: 180ms       │\n│                    p95: 450ms       │\n│  Database:         420 queries/sec  │\n│  Queue depth:      15 jobs          │\n└─────────────────────────────────────┘</pre><h2>9. Correlation: Technical + Business Metrics</h2><pre>// Example: Slow checkout affecting revenue\n\nTimeline:\n10:00 AM - p95 checkout time: 400ms (normal)\n10:15 AM - p95 checkout time: 2000ms (5x slower)\n10:15 AM - Checkout completion: 78% → 65% (drops 13%)\n10:15 AM - Revenue/hour: £3k → £2.6k (down 15%)\n\nCorrelation found!\nSlow performance → abandoned checkouts → lost revenue\n\nRoot cause investigation:\n- Check: Recent deploys? (Yes, v2.4.0 at 10:10 AM)\n- Check: Database slow queries? (Yes, missing index)\n- Check: Third-party API? (Stripe API responding slowly)\n\nFix deployed 10:45 AM:\n- Rollback to v2.3.9\n- Checkout time returns to 400ms\n- Completion rate returns to 78%\n\nRevenue impact:\n30 minutes slow checkout × £400/hr lost = £200\nQuick detection + fix prevented £2k+ additional loss.</pre><h2>10. Incident Response Workflow</h2><pre>1. ALERT FIRES\n   └─> Slack: \"🚨 Site down (3 checks failed)\"\n   └─> SMS to on-call engineer\n\n2. ACKNOWLEDGE (< 5 minutes)\n   └─> Engineer: \"I'm investigating\"\n   └─> Status page: \"Investigating connectivity issues\"\n\n3. DIAGNOSE (< 15 minutes)\n   └─> Check: Uptime monitor, error logs, recent deploys\n   └─> Root cause: Database out of connections\n\n4. MITIGATE (< 30 minutes)\n   └─> Quick fix: Restart database, increase connection pool\n   └─> Status: \"Issue identified, implementing fix\"\n\n5. RESOLVE\n   └─> Confirm: Site responding, errors cleared\n   └─> Status: \"Resolved. Monitoring closely.\"\n\n6. POSTMORTEM (within 48 hours)\n   └─> What happened? Why? Timeline?\n   └─> Action items: Prevent recurrence\n   └─> Share learnings with team</pre>",
  "questions": [
    {
      "q": "What's the difference between average response time and p95 response time, and why does p95 matter more?",
      "opts": [
        "No real difference",
        "Average hides outliers. If 95% of requests are 200ms but 5% are 10 seconds, average might be 500ms (looks fine) but p95 is 10s (bad UX for 5% of users). p95 reveals slow experiences average masks.",
        "p95 is just a fancy metric",
        "Average is more accurate"
      ],
      "correct": 1,
      "explain": "Average response time is misleading—slow outliers are averaged away. p95 shows: 95% of requests are faster than this. If p95 is 5 seconds, 5% of your users wait 5+ seconds (terrible experience). Always monitor percentiles, not averages."
    },
    {
      "q": "Your site was down for 30 minutes before you knew. Customers reported it. What monitoring is missing?",
      "opts": [
        "Better customer service",
        "Uptime monitoring (Pingdom, etc). External checks every 60 seconds from multiple locations. Alerts via SMS/Slack when site unreachable. Cost: $10-20/month. Without it, you only know from customer complaints.",
        "More servers",
        "Google Analytics"
      ],
      "correct": 1,
      "explain": "External uptime monitoring ($10-20/mo) checks your site every minute from outside your infrastructure. Detects: site down, slow responses, SSL errors. Alerts within 1-2 minutes. Essential—can't rely on customers to tell you."
    },
    {
      "q": "You have 100 JavaScript errors per hour. Is this a problem?",
      "opts": [
        "Yes—all errors are bad",
        "Depends on traffic. 100 errors/hour with 10k users = 1% error rate (high, investigate). 100 errors/hour with 1M users = 0.01% error rate (acceptable). Track error RATE, not absolute count.",
        "No—some errors are normal",
        "Need more information about error types"
      ],
      "correct": 1,
      "explain": "Absolute error count is meaningless without context. Track error RATE (errors/requests). 0.01% error rate might be acceptable (edge cases). 1%+ error rate is high—many users affected. Also track: is rate increasing?"
    },
    {
      "q": "How do you prevent alert fatigue (team ignores alerts)?",
      "opts": [
        "Send more alerts to emphasize importance",
        "Alert only on actionable issues. Use levels: CRITICAL (immediate action), WARNING (investigate), INFO (track trends). Suppress during maintenance. Group related alerts. If team ignores alerts, you're alerting too much or on wrong things.",
        "Rotate who gets alerts",
        "Reduce all alerts"
      ],
      "correct": 1,
      "explain": "Alert fatigue happens when too many non-actionable alerts train team to ignore them. Fix: 1) Critical alerts only for urgent issues, 2) Warnings for investigation, 3) Info for trends, 4) Suppress known maintenance, 5) Group related alerts. Every alert should require action."
    },
    {
      "q": "Your monitoring shows checkout completion dropped from 78% to 65%. What do you check first?",
      "opts": [
        "Blame marketing for bad traffic",
        "Correlate with technical metrics: Did p95 response time spike? Error rate increase? Recent deploy? Payment API issues? Check timeline: when did drop start? Checkout slowness often causes abandonment.",
        "Wait to see if it recovers",
        "Run A/B test"
      ],
      "correct": 1,
      "explain": "Sudden checkout drops often have technical causes. Check: 1) Response times (slow checkout = abandonment), 2) Error rates (JS errors breaking checkout), 3) Recent deploys (new bugs), 4) Third-party APIs (Stripe down). Correlate technical and business metrics."
    }
  ],
  "essay": {
    "q": "You're the COO of an ecommerce company doing £1M/month revenue. Currently you find out about site issues from customer complaints. Design a monitoring strategy. What tools? What metrics? What alerts? What's the cost vs risk?",
    "guide": "Current risk: 30-60 min MTTR (mean time to resolution) because detection is slow. £1M/mo = £1.4k/hour. One hour of downtime per month = £16.8k/year lost. Monitoring strategy: 1) Uptime: Pingdom ($20/mo) - checks every 60 seconds, alerts within 2 min. 2) Errors: Sentry ($80/mo) - catches all JS/backend errors with stack traces. 3) Performance: New Relic or Datadog ($200/mo) - tracks p95 latency, identifies slow endpoints. 4) Business: Google Analytics (free) - tracks checkout completion, revenue/hour. 5) Alerts: Critical (SMS): site down, payment failing. Warning (Slack): error rate > 1%, p95 > 1000ms, checkout < 70%. Total cost: $300/month = £3.6k/year. ROI: Prevents even ONE hour of undetected downtime/year (£16.8k) = 4.6x return. Reduces MTTR from 30min to 5min = 83% improvement. Implementation: Week 1: Pingdom + Sentry ($100/mo minimum viable). Week 2-3: Add APM and correlate with business metrics. Week 4: Tune alerts, create dashboards, document runbooks."
  }
};
