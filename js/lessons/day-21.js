// Day 21: Week 2 Review & Integration Patterns
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[21] = {
  "day": 21,
  "week": 2,
  "title": "Week 2 Review & Integration Patterns",
  "desc": "Connecting systems effectively",
  "duration": "45 min",
  "coldOpen": "Systems are 'tightly coupled'—changing checkout requires updates to 5 other systems. Every deploy risks breaking something. How do you fix this architecture?",
  "coldRevisit": "Loose coupling via events: Checkout publishes 'order.created' event. Other systems subscribe independently. Change checkout = no ripple effects. Event-driven architecture enables independent scaling and deployment.",
  "content": "<h2>Week 2 Review: Backend & Integrations</h2><p>This week covered backend systems: SSR/SSG, authentication, payments, webhooks, queues, and search. The common theme: integration patterns—how systems connect without becoming tangled.</p><h2>1. Coupling: The Core Problem</h2><pre>// Tight coupling (bad)\nfunction checkout(order) {\n  // Checkout directly calls 5 systems\n  paymentService.charge(order);         // If this changes, checkout breaks\n  inventoryService.reduce(order);       // If this changes, checkout breaks\n  shippingService.createLabel(order);   // If this changes, checkout breaks\n  emailService.send(order);             // If this changes, checkout breaks\n  analyticsService.track(order);        // If this changes, checkout breaks\n  \n  // Must deploy all 6 systems together\n  // One failure breaks entire checkout\n}\n\n// Loose coupling (good)\nfunction checkout(order) {\n  // Checkout publishes event\n  eventBus.publish('order.created', order);\n  \n  // Other systems subscribe independently\n  // payment-service subscribes to order.created\n  // inventory-service subscribes to order.created\n  // shipping-service subscribes to order.created\n  // email-service subscribes to order.created\n  // analytics-service subscribes to order.created\n  \n  // Each system deploys independently\n  // One failure doesn't break checkout\n}</pre><h2>2. Integration Patterns Summary</h2><table><tr><th>Pattern</th><th>When to Use</th><th>Example</th></tr><tr><td><strong>REST API</strong></td><td>Request-response, real-time</td><td>Get product details</td></tr><tr><td><strong>Webhooks</strong></td><td>Event notification, push</td><td>Payment succeeded</td></tr><tr><td><strong>Message Queue</strong></td><td>Async work, retries</td><td>Send confirmation email</td></tr><tr><td><strong>Event Bus</strong></td><td>Loose coupling, many subscribers</td><td>Order created → 5 services</td></tr><tr><td><strong>Polling</strong></td><td>Third-party no webhooks</td><td>Check shipping status</td></tr></table><h2>3. Event-Driven Architecture</h2><pre>// Central event bus\nconst eventBus = new EventEmitter();\n\n// Publisher (checkout service)\napp.post('/checkout', async (req, res) => {\n  const order = await createOrder(req.body);\n  \n  // Publish event\n  eventBus.emit('order.created', {\n    orderId: order.id,\n    userId: order.userId,\n    total: order.total,\n    items: order.items\n  });\n  \n  res.json({ orderId: order.id });\n});\n\n// Subscribers (independent services)\neventBus.on('order.created', async (order) => {\n  await emailService.sendConfirmation(order);  // Email service\n});\n\neventBus.on('order.created', async (order) => {\n  await inventoryService.reduce(order.items);  // Inventory service\n});\n\neventBus.on('order.created', async (order) => {\n  await shippingService.createLabel(order);    // Shipping service\n});\n\n// Add new subscriber without changing checkout\neventBus.on('order.created', async (order) => {\n  await fraudService.check(order);             // New: Fraud detection\n});</pre><h2>4. Week 2 Key Takeaways</h2><ul><li><strong>SSR vs CSR:</strong> Public pages need SEO = SSR/SSG. Authenticated pages = CSR OK.</li><li><strong>Authentication:</strong> Login proves identity. Authorization checks permissions. Need both.</li><li><strong>Payments:</strong> Use Stripe properly = easy PCI compliance. Store cards = expensive audits.</li><li><strong>Webhooks:</strong> Verify signatures, handle idempotency, respond quickly.</li><li><strong>Queues:</strong> Defer non-critical work. Checkout should be <3 seconds.</li><li><strong>Search:</strong> Database LIKE = limited. Search engines = typos + relevance + speed.</li><li><strong>Integration:</strong> Loose coupling via events = independent deployment + scalability.</li></ul>",
  "questions": [
    {
      "q": "What's the main benefit of event-driven architecture over direct service calls?",
      "opts": [
        "Faster performance",
        "Loose coupling: services don't know about each other, only events. Can add/remove/modify services without changing others. Failure in one service doesn't break others.",
        "Easier to code",
        "Better security"
      ],
      "correct": 1,
      "explain": "Event-driven decouples services. Checkout publishes 'order.created'. Services subscribe independently. Add fraud check? Subscribe to event. Email fails? Doesn't break checkout. Direct calls = tightly coupled."
    },
    {
      "q": "Your checkout calls 8 services directly. One service is slow (3 seconds). What happens?",
      "opts": [
        "Checkout is slow (3+ seconds), user waits",
        "Checkout is slow (3+ seconds), user waits. All services are synchronous. Solution: Use events or queues—checkout publishes event, services process async.",
        "Only that service is affected",
        "Need faster servers"
      ],
      "correct": 0,
      "explain": "Synchronous calls = sequential wait time. If one service takes 3s, checkout takes 3s minimum. Solution: Async via events or queues. Checkout completes in <1s, services process in background."
    },
    {
      "q": "How do you prevent cascading failures in service architecture?",
      "opts": [
        "Use faster servers",
        "Loose coupling (events not direct calls), circuit breakers (stop calling failing service), retries with backoff, fallbacks (degrade gracefully), monitoring (detect issues fast).",
        "Restart services often",
        "Increase timeouts"
      ],
      "correct": 1,
      "explain": "Cascading failure prevention: 1) Loose coupling (failure doesn't propagate), 2) Circuit breakers (stop calling broken service), 3) Graceful degradation (continue without failed service), 4) Retries with backoff, 5) Monitoring + alerts."
    },
    {
      "q": "Week 2 covered many integration patterns. What's the decision framework?",
      "opts": [
        "Always use newest technology",
        "Real-time sync data? REST API. Event notification? Webhook. Async work? Queue. Multiple subscribers? Event bus. Third-party no webhooks? Polling. Choose based on requirements, not hype.",
        "Use what competitors use",
        "Flip a coin"
      ],
      "correct": 1,
      "explain": "Pattern selection based on use case: REST (request-response), Webhooks (push notifications), Queues (async work with retries), Event bus (many subscribers), Polling (no other option). Match pattern to problem."
    },
    {
      "q": "Your architecture has checkout → email service → analytics service (chain). Email fails = analytics doesn't run. How to fix?",
      "opts": [
        "Make email service more reliable",
        "Don't chain services. Checkout should publish event, both email and analytics subscribe independently. Email failure doesn't affect analytics. Each service is autonomous.",
        "Add retries",
        "Duplicate analytics call"
      ],
      "correct": 1,
      "explain": "Chaining creates dependencies—each failure blocks downstream. Event-driven: checkout publishes event → email subscribes → analytics subscribes. Both are independent. Email fails? Analytics still runs."
    }
  ],
  "essay": {
    "q": "Your checkout service directly calls 10 other services (payment, email, inventory, shipping, etc.). This is slow, fragile, and hard to change. Design a better architecture. What patterns do you use? How does this improve reliability and speed?",
    "guide": "Current problems: Tight coupling (checkout knows about all 10 services), synchronous (slow—sum of all service times), fragile (one failure breaks checkout), hard to change (adding service requires checkout changes). Better architecture: Event-driven. Checkout: 1) Charge payment (must be sync), 2) Create order, 3) Publish 'order.created' event, 4) Respond to user (<1s). Other services: Subscribe to 'order.created' event, process independently. Benefits: Speed (checkout: <1s vs 5-10s), Reliability (email fails? checkout succeeds), Scalability (add fraud check? just subscribe to event), Maintainability (change inventory? doesn't affect checkout). Implementation: Use message queue (Redis + BullMQ) or event bus (EventEmitter, or AWS EventBridge). Each service is autonomous microservice or background worker. Monitoring: Track event publishing, processing times, failure rates. Result: Fast checkout, resilient architecture, easy to extend."
  }
};
