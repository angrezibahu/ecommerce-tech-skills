// Day 18: Webhooks & Event Architecture
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[18] = {
  "day": 18,
  "week": 2,
  "title": "Webhooks & Event Architecture",
  "desc": "Asynchronous integrations",
  "duration": "50 min",
  "coldOpen": "Your shipping partner wants a webhook endpoint. Your dev asks 'where should I create this?' and 'what security do we need?' What are webhooks and why do they matter?",
  "coldRevisit": "Webhooks = reverse APIs. Instead of you calling them (polling), they POST to your endpoint when events happen. Must verify signatures (prevent fake requests) and handle idempotency (same event sent twice).",
  "content": "<h2>Why This Matters</h2><p>Webhooks enable real-time integrations without polling. When an order ships, Shippo POSTs to your webhook immediately—no need to check every 5 minutes. But webhooks introduce security and reliability challenges you must understand to approve implementations.</p><h2>1. Webhooks vs Polling</h2><table><tr><th>Polling (Old Way)</th><th>Webhooks (Modern Way)</th></tr><tr><td>You repeatedly ask: 'Any updates?'</td><td>They tell you immediately when something happens</td></tr><tr><td>Wastes API calls (mostly 'no updates')</td><td>Efficient—only called when needed</td></tr><tr><td>Delayed (check every 5-60 minutes)</td><td>Real-time (instant notification)</td></tr><tr><td>You control timing</td><td>They control timing</td></tr></table><h2>2. How Webhooks Work</h2><pre>// Sequence:\n1. You give Shippo your webhook URL: https://yoursite.com/webhooks/shippo\n2. Event happens (package ships)\n3. Shippo POSTs to your URL:\n   POST https://yoursite.com/webhooks/shippo\n   {\n     event: 'shipment.delivered',\n     trackingNumber: '1Z999AA10123456784',\n     orderId: 'ORDER-123'\n   }\n4. Your endpoint receives, processes event\n5. You respond with 200 OK (they retry if not 200)</pre><h2>3. Security: Verifying Signatures</h2><pre>// BAD: No verification (attacker can fake events)\napp.post('/webhooks/shippo', (req, res) => {\n  const event = req.body;\n  markOrderAsShipped(event.orderId);  // Trusts any POST!\n  res.sendStatus(200);\n});\n\n// GOOD: Verify signature\napp.post('/webhooks/shippo', (req, res) => {\n  const signature = req.headers['x-shippo-signature'];\n  const payload = JSON.stringify(req.body);\n  \n  // Verify HMAC signature\n  const expectedSig = crypto\n    .createHmac('sha256', WEBHOOK_SECRET)\n    .update(payload)\n    .digest('hex');\n  \n  if (signature !== expectedSig) {\n    return res.status(401).json({ error: 'Invalid signature' });\n  }\n  \n  // Signature valid - process event\n  markOrderAsShipped(req.body.orderId);\n  res.sendStatus(200);\n});</pre><h2>4. Idempotency: Handling Duplicates</h2><pre>// Webhooks may be sent multiple times (network issues, retries)\n// Must handle idempotently (same event twice = same result)\n\napp.post('/webhooks/payment', async (req, res) => {\n  const eventId = req.body.id;\n  \n  // Check if already processed\n  const processed = await webhookLog.findOne({ eventId });\n  if (processed) {\n    return res.sendStatus(200);  // Already handled, return success\n  }\n  \n  // Process event\n  await fulfillOrder(req.body.orderId);\n  \n  // Log as processed\n  await webhookLog.create({ eventId, processedAt: new Date() });\n  \n  res.sendStatus(200);\n});</pre><h2>5. Error Handling & Retries</h2><pre>// Providers retry if you don't respond 200\n// Retry schedule typically: immediate, 1 min, 5 min, 30 min, 1 hour...\n\napp.post('/webhooks/stripe', async (req, res) => {\n  try {\n    const event = verifyStripeWebhook(req);\n    \n    await processEvent(event);\n    \n    // Must respond 200 quickly (within 5-10 seconds)\n    res.sendStatus(200);\n    \n  } catch (error) {\n    // Log error for debugging\n    console.error('Webhook error:', error);\n    \n    // Return 500 so provider retries\n    res.sendStatus(500);\n  }\n});</pre>",
  "questions": [
    {
      "q": "What's the main security risk of webhooks if not properly verified?",
      "opts": [
        "Slow performance",
        "Anyone can POST fake events to your endpoint, triggering actions (marking orders shipped, crediting accounts) without actual events occurring.",
        "CORS issues",
        "Memory leaks"
      ],
      "correct": 1,
      "explain": "Without signature verification, attackers can fake webhooks (POST to your endpoint with fake data). Always verify signatures using HMAC with shared secret."
    },
    {
      "q": "Why must webhook handlers be idempotent?",
      "opts": [
        "For speed",
        "Providers retry webhooks if they don't get 200 response. Same event may be delivered multiple times. Idempotent handling ensures same event processed twice has same result (no duplicate actions).",
        "To reduce database load",
        "For security"
      ],
      "correct": 1,
      "explain": "Webhooks are retried on failure, network issues, or timeouts. You might receive same event 2-3 times. Idempotent handling (check if already processed, store event ID) prevents duplicate actions."
    },
    {
      "q": "Shippo webhook endpoint takes 15 seconds to process. What's the problem?",
      "opts": [
        "15 seconds is fine",
        "Webhook providers expect quick response (5-10 sec max). Slow response = timeout = retry. Solution: Respond 200 immediately, process event in background queue.",
        "Need faster server",
        "Database is slow"
      ],
      "correct": 1,
      "explain": "Webhooks timeout if you take too long. Pattern: 1) Verify signature, 2) Queue event for processing, 3) Respond 200 immediately, 4) Process async in background. Don't do heavy work in webhook handler."
    },
    {
      "q": "What's the benefit of webhooks vs polling every 5 minutes?",
      "opts": [
        "Webhooks are newer",
        "Real-time updates (instant vs 5-min delay), efficient (only called when needed vs constant polling), reduced API usage (no wasted 'no update' calls).",
        "Webhooks are easier to implement",
        "Better security"
      ],
      "correct": 1,
      "explain": "Webhooks are event-driven (push) vs polling (pull). Webhooks: instant, efficient. Polling: delayed (5-min average), wasteful (99% of polls return 'no change'). For real-time needs, webhooks are superior."
    },
    {
      "q": "How do you handle a webhook event that depends on data not yet in your database (race condition)?",
      "opts": [
        "Ignore the webhook",
        "Implement retry logic: if dependency missing, queue event for retry in 30 seconds. After 3-5 retries, log failure for manual investigation.",
        "Request webhooks slower",
        "Disable webhooks"
      ],
      "correct": 1,
      "explain": "Race conditions happen (webhook arrives before API sync completes). Solution: Check dependencies, queue for retry if missing. After retries exhausted, alert for manual check. Don't assume order of operations."
    }
  ],
  "essay": {
    "q": "Partner wants webhook endpoint for order updates. Your dev asks about security and implementation. What guidance do you provide?",
    "guide": "Security requirements: 1) Verify signature (HMAC with shared secret), 2) Use HTTPS only, 3) Log all webhook attempts, 4) Rate limiting (prevent DOS). Implementation guidance: 1) Respond 200 quickly (<5 sec), 2) Queue actual processing for background, 3) Handle idempotency (store event IDs to prevent duplicate processing), 4) Implement retry logic for dependencies. Architecture: POST /webhooks/partner -> verify signature -> queue event -> respond 200 -> background worker processes. Monitoring: Track success rate, failure reasons, processing time. Testing: Partner should provide test events/signature. Document: What events do we handle? What triggers what actions?"
  }
};
