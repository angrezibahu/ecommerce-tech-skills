// Day 19: Message Queues & Background Jobs
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[19] = {
  "day": 19,
  "week": 2,
  "title": "Message Queues & Background Jobs",
  "desc": "Async processing for reliability",
  "duration": "50 min",
  "coldOpen": "Checkout takes 12 seconds. Dev says it's because we 'send confirmation email, update inventory, create Shippo label, notify Slack, update analytics' during checkout. Can this be faster?",
  "coldRevisit": "Yes—only critical work happens synchronously (charge card, create order). Everything else queues for background processing. Checkout should be 2-3 seconds, background jobs handle rest.",
  "content": "<h2>Why This Matters</h2><p>Slow checkout = abandoned carts. If your checkout takes 10+ seconds, you're doing too much work synchronously. Message queues let you defer non-critical work to background, responding to users in 2-3 seconds while completing work asynchronously.</p><h2>1. Synchronous vs Asynchronous Work</h2><table><tr><th>Must Be Synchronous</th><th>Can Be Async (Queued)</th></tr><tr><td>Charge payment card</td><td>Send confirmation email</td></tr><tr><td>Create order record</td><td>Generate shipping label</td></tr><tr><td>Check inventory</td><td>Update analytics</td></tr><tr><td>Generate order ID</td><td>Notify Slack/internal systems</td></tr><tr><td></td><td>Process recommendations</td></tr><tr><td></td><td>Generate PDF receipt</td></tr></table><h2>2. Without Queue (Slow Checkout)</h2><pre>app.post('/checkout', async (req, res) => {\n  const start = Date.now();\n  \n  // 1. Charge card (500ms)\n  const charge = await stripe.charges.create({...});\n  \n  // 2. Create order (100ms)\n  const order = await db.orders.create({...});\n  \n  // 3. Send email (2000ms) - SLOW!\n  await sendgrid.send({ to: user.email, ... });\n  \n  // 4. Create shipping label (1500ms) - SLOW!\n  await shippo.createLabel({...});\n  \n  // 5. Update inventory (300ms)\n  await updateInventory(order.items);\n  \n  // 6. Notify Slack (800ms) - SLOW!\n  await slack.post({ text: `New order ${order.id}` });\n  \n  // 7. Update analytics (500ms)\n  await analytics.track('purchase', {...});\n  \n  const elapsed = Date.now() - start;\n  // Total: ~5700ms (5.7 seconds)\n  // User waited entire time!\n  \n  res.json({ orderId: order.id });\n});</pre><h2>3. With Queue (Fast Checkout)</h2><pre>app.post('/checkout', async (req, res) => {\n  // 1. Charge card (500ms)\n  const charge = await stripe.charges.create({...});\n  \n  // 2. Create order (100ms)\n  const order = await db.orders.create({...});\n  \n  // 3. Queue all non-critical work\n  await queue.add('send-confirmation-email', { orderId: order.id });\n  await queue.add('create-shipping-label', { orderId: order.id });\n  await queue.add('update-inventory', { orderId: order.id });\n  await queue.add('notify-slack', { orderId: order.id });\n  await queue.add('track-analytics', { orderId: order.id });\n  \n  // Total: ~600ms\n  // User gets response immediately!\n  \n  res.json({ orderId: order.id });\n});\n\n// Background workers process queue\nqueue.process('send-confirmation-email', async (job) => {\n  await sendgrid.send({ to: job.data.email, ... });\n});\n\nqueue.process('create-shipping-label', async (job) => {\n  await shippo.createLabel({...});\n});</pre><h2>4. Message Queue Architecture</h2><pre>┌─────────┐                  ┌───────────┐                  ┌────────────┐\n│  API    │ ---enqueue---&gt;  │   Queue   │  ---dequeue---&gt; │   Worker   │\n│ Server  │                  │  (Redis)  │                  │  Process   │\n└─────────┘                  └───────────┘                  └────────────┘\n   Quick                       Persistent                     Async\n   Response                    Storage                        Processing</pre><h2>5. Popular Queue Libraries</h2><table><tr><th>Library</th><th>Backend</th><th>Features</th><th>Best For</th></tr><tr><td><strong>BullMQ</strong></td><td>Redis</td><td>Retries, delays, priorities, rate limiting</td><td>Most use cases</td></tr><tr><td><strong>Sidekiq</strong></td><td>Redis</td><td>Ruby ecosystem, mature</td><td>Rails apps</td></tr><tr><td><strong>Celery</strong></td><td>Redis/RabbitMQ</td><td>Python ecosystem, distributed tasks</td><td>Python apps</td></tr><tr><td><strong>AWS SQS</strong></td><td>AWS</td><td>Managed service, scales automatically</td><td>AWS infrastructure</td></tr></table><h2>6. Job Retries & Error Handling</h2><pre>// Configure retries and backoff\nqueue.add('send-email', \n  { to: 'user@example.com', orderId: 123 },\n  {\n    attempts: 5,\n    backoff: {\n      type: 'exponential',\n      delay: 1000  // 1s, 2s, 4s, 8s, 16s\n    }\n  }\n);\n\n// Handle failures\nqueue.on('failed', (job, error) => {\n  console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, error);\n  \n  // After all retries exhausted\n  if (job.attemptsMade >= job.opts.attempts) {\n    // Alert team, store in dead letter queue\n    alertOps(`Job ${job.id} permanently failed`);\n  }\n});</pre>",
  "questions": [
    {
      "q": "Checkout endpoint takes 8 seconds. What work should you move to a background queue?",
      "opts": [
        "Charging the payment card",
        "Everything except: charging card, creating order record, checking inventory. Queue: emails, shipping labels, analytics, notifications.",
        "Create order record",
        "All of it"
      ],
      "correct": 1,
      "explain": "Only critical work must be synchronous: charge card, create order, check inventory. Everything else (emails, labels, analytics, notifications) can queue for background processing. Reduces checkout to 1-3 seconds."
    },
    {
      "q": "What happens if a background job fails (email service down)?",
      "opts": [
        "Job is lost",
        "Queue automatically retries with exponential backoff (1s, 2s, 4s...). After configured attempts (usually 5-10), job moves to dead letter queue for manual review.",
        "Must restart server",
        "Immediate alert"
      ],
      "correct": 1,
      "explain": "Queues provide automatic retries with backoff. Temporary failures (network glitch) succeed on retry. Permanent failures (bad email) exhaust retries and go to dead letter queue for investigation."
    },
    {
      "q": "Why use Redis for a message queue instead of a database?",
      "opts": [
        "Redis is newer",
        "Redis is in-memory (fast), optimized for queue operations (push/pop), supports atomic operations, and has built-in pub/sub. Databases are slower and not designed for high-frequency queue operations.",
        "Databases don't support queues",
        "Redis is free"
      ],
      "correct": 1,
      "explain": "Redis excels at queue operations: in-memory (microsecond latency), atomic operations, pub/sub support. Databases work but are slower (disk I/O) and not optimized for constant push/pop operations at scale."
    },
    {
      "q": "How do you handle jobs that depend on previous jobs (generate PDF after shipping label created)?",
      "opts": [
        "Run them synchronously",
        "Chain jobs: first job (create label) completes successfully → enqueue second job (generate PDF). Or use job dependencies feature in BullMQ.",
        "Poll database",
        "Manual coordination"
      ],
      "correct": 1,
      "explain": "Job chaining: When job 1 completes, it enqueues job 2. Or use queue library's dependency feature (BullMQ supports parent-child jobs). Never do this synchronously in checkout flow—defeats queue purpose."
    },
    {
      "q": "Your checkout is fast but confirmation emails arrive 30 minutes later. What's the problem?",
      "opts": [
        "Email provider is slow",
        "Workers are overwhelmed (too many jobs, not enough workers) or worker crash/not running. Check: worker process status, queue depth, processing rate. May need more workers.",
        "Queue is broken",
        "Database is slow"
      ],
      "correct": 1,
      "explain": "Long delays indicate worker capacity issue: 1) Workers crashed (not processing), 2) Too few workers for job volume, 3) Jobs backed up in queue. Solution: Monitor queue depth, scale workers, check worker process health."
    }
  ],
  "essay": {
    "q": "Your checkout takes 10 seconds because it sends email, creates shipping label, updates 3 systems, and logs to analytics. How do you redesign this? What stays synchronous? What goes to queue? What's the user experience?",
    "guide": "Current flow analysis: Payment charge (required): 500ms, Create order (required): 200ms, Email (can queue): 2s, Shipping label (can queue): 1.5s, Update systems (can queue): 800ms, Analytics (can queue): 300ms. Total: 10.3s. Redesign: Synchronous: 1) Charge card, 2) Create order, 3) Check inventory, 4) Respond to user. Queue: 5) Email, 6) Shipping label, 7) System updates, 8) Analytics. New total: 700ms response. UX: Checkout completes in <1 second, show 'Order confirmed! Confirmation email coming shortly.' Background workers process queue (30-60 seconds total). Monitoring: Track queue depth, job failures, processing time. Alert if queue depth > 1000 or jobs failing. Implementation: Use BullMQ with Redis, 3-5 worker processes, exponential retry, dead letter queue for failures."
  }
};
