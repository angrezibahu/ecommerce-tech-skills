// Day 17: Payment Integration
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[17] = {
  "day": 17,
  "week": 2,
  "title": "Payment Integration",
  "desc": "Stripe, PCI compliance, security",
  "duration": "55 min",
  "coldOpen": "CFO asks: 'Are we PCI compliant?' You're not sure. Your dev says 'We use Stripe'. Does that mean you're compliant? What are the implications if you're not?",
  "coldRevisit": "Using Stripe correctly = PCI compliant (Stripe handles card data, you never see it). If you store card numbers or CVVs = you must be PCI certified (expensive audit). Non-compliance = fines + banned from processing cards.",
  "content": "<h2>Why This Matters to You</h2><p>Payment processing is heavily regulated. PCI DSS (Payment Card Industry Data Security Standard) has strict requirements. Violating them can result in fines up to $100k/month and loss of ability to process cards. Understanding how Stripe and PCI work helps you avoid expensive mistakes.</p><h2>1. PCI Compliance Levels</h2><table><tr><th>Level</th><th>Transaction Volume (yearly)</th><th>Requirements</th></tr><tr><td>Level 1</td><td>&gt; 6 million</td><td>Annual on-site audit by QSA, quarterly scans</td></tr><tr><td>Level 2</td><td>1-6 million</td><td>Annual self-assessment, quarterly scans</td></tr><tr><td>Level 3</td><td>20k - 1 million</td><td>Annual self-assessment, quarterly scans</td></tr><tr><td>Level 4</td><td>&lt; 20k</td><td>Annual self-assessment (may vary by processor)</td></tr></table><p><strong>Cost of compliance:</strong> Level 1 audit costs $50k-300k. Level 4 self-assessment costs $2k-5k.</p><h2>2. The Right Way: Stripe Checkout/Elements</h2><pre>// CORRECT: Card data never touches your server\n&lt;form id=\"payment-form\"&gt;\n  &lt;!-- Stripe Elements: iframe hosted by Stripe --&gt;\n  &lt;div id=\"card-element\"&gt;&lt;/div&gt;\n  &lt;button&gt;Pay&lt;/button&gt;\n&lt;/form&gt;\n\n&lt;script&gt;\n  const stripe = Stripe('pk_test_...');\n  const elements = stripe.elements();\n  const cardElement = elements.create('card');\n  cardElement.mount('#card-element');\n  \n  form.addEventListener('submit', async (e) => {\n    e.preventDefault();\n    \n    // Stripe converts card to token (card data never hits your server)\n    const {token, error} = await stripe.createToken(cardElement);\n    \n    if (error) {\n      // Handle error\n    } else {\n      // Send token to your server (not card number!)\n      const response = await fetch('/charge', {\n        method: 'POST',\n        body: JSON.stringify({ token: token.id, amount: 5000 })\n      });\n    }\n  });\n&lt;/script&gt;\n\n// Your server: charge the token\nconst charge = await stripe.charges.create({\n  amount: 5000,  // $50.00\n  currency: 'usd',\n  source: req.body.token,  // Token from frontend\n  description: 'Order #123'\n});</pre><div class=\"info-box\"><div class=\"info-title\">💡 Why This Works</div><p>Card data goes directly from customer → Stripe (via iframe). Your server only sees tokens. You never store, process, or transmit card data. Result: Easiest PCI compliance (SAQ A: 22 questions).</p></div><h2>3. The Wrong Way: Storing Card Data</h2><pre>// WRONG: Card data touches your server\n&lt;form action=\"/charge\" method=\"POST\"&gt;\n  &lt;input name=\"cardNumber\" /&gt;      &lt;!-- PCI violation! --&gt;\n  &lt;input name=\"cardCVV\" /&gt;        &lt;!-- PCI violation! --&gt;\n  &lt;input name=\"cardExpiry\" /&gt;     &lt;!-- PCI violation! --&gt;\n  &lt;button&gt;Pay&lt;/button&gt;\n&lt;/form&gt;\n\n// Server receives card data directly\napp.post('/charge', (req, res) => {\n  const cardNumber = req.body.cardNumber;  // Now you're responsible for PCI!\n  // Even if you don't store it, you processed it = PCI applies\n});</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ PCI Violation Consequences</div><ul><li>Fines: $5k-100k per month</li><li>Banned from processing cards</li><li>Liable for breaches (millions in damages)</li><li>Audit costs: $50k-300k annually</li></ul></div><h2>4. Stripe Integration: Step by Step</h2><pre>// 1. Backend: Create Payment Intent\napp.post('/create-payment-intent', async (req, res) => {\n  const paymentIntent = await stripe.paymentIntents.create({\n    amount: 5000,\n    currency: 'usd',\n    metadata: { orderId: '123' }\n  });\n  \n  res.json({ clientSecret: paymentIntent.client_secret });\n});\n\n// 2. Frontend: Collect card details\nconst {clientSecret} = await fetch('/create-payment-intent').then(r => r.json());\n\nconst {error} = await stripe.confirmCardPayment(clientSecret, {\n  payment_method: {\n    card: cardElement,\n    billing_details: { name: 'Customer Name' }\n  }\n});\n\nif (error) {\n  // Payment failed\n} else {\n  // Payment succeeded!\n}</pre><h2>5. Webhooks: Handling Async Events</h2><pre>// Stripe sends webhooks for payment events\napp.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {\n  const sig = req.headers['stripe-signature'];\n  let event;\n  \n  try {\n    // Verify webhook signature (critical security)\n    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);\n  } catch (err) {\n    return res.status(400).send(`Webhook Error: ${err.message}`);\n  }\n  \n  // Handle event\n  switch (event.type) {\n    case 'payment_intent.succeeded':\n      // Payment succeeded - fulfill order\n      fulfillOrder(event.data.object.metadata.orderId);\n      break;\n    case 'payment_intent.payment_failed':\n      // Payment failed - notify customer\n      notifyCustomer(event.data.object.metadata.orderId);\n      break;\n  }\n  \n  res.json({received: true});\n});</pre><h2>6. Common Payment Mistakes</h2><table><tr><th>Mistake</th><th>Impact</th><th>Fix</th></tr><tr><td>Storing card numbers</td><td>PCI violation, fines, audit costs</td><td>Use Stripe tokens/Payment Intents</td></tr><tr><td>Not verifying webhook signatures</td><td>Attackers can fake payment confirmations</td><td>Always verify stripe-signature header</td></tr><tr><td>Fulfilling orders before payment confirms</td><td>Orders fulfilled, payment fails</td><td>Use webhooks, check payment status</td></tr><tr><td>No idempotency keys</td><td>Duplicate charges if user refreshes</td><td>Use idempotency keys in API calls</td></tr></table>",
  "questions": [
    {
      "q": "Your CFO asks if you're PCI compliant. You use Stripe Checkout. What do you answer?",
      "opts": [
        "Need to get audited first",
        "Yes—using Stripe Checkout/Elements properly means card data never touches our servers. We're SAQ A compliant (simplest level, 22 questions).",
        "Stripe handles it",
        "Not sure"
      ],
      "correct": 1,
      "explain": "Using Stripe Checkout/Elements correctly = SAQ A (simplest PCI level). Card data goes directly to Stripe. You never see, store, or process card numbers. Result: easiest compliance."
    },
    {
      "q": "Developer says we should store card numbers 'encrypted' in our database for faster future purchases. Your response?",
      "opts": [
        "Good idea if encrypted well",
        "No—storing card data requires expensive PCI certification, audits, and increased breach liability. Use Stripe's saved payment methods instead.",
        "Yes but use strong encryption",
        "Check with legal first"
      ],
      "correct": 1,
      "explain": "Storing card data (even encrypted) = full PCI audit ($50k+), ongoing compliance costs, massive liability if breached. Stripe offers saved payment methods—you store token, Stripe stores card."
    },
    {
      "q": "What's the security risk if you don't verify webhook signatures?",
      "opts": [
        "Webhooks will fail",
        "Attackers can send fake payment success webhooks to your endpoint, causing you to fulfill orders without actual payment.",
        "Slower processing",
        "No major risk"
      ],
      "correct": 1,
      "explain": "Without signature verification, anyone can POST to your webhook endpoint claiming 'payment succeeded'. Verify stripe-signature header to ensure webhook came from Stripe."
    },
    {
      "q": "Customer reports being charged twice. What likely happened?",
      "opts": [
        "Stripe bug",
        "No idempotency key used. User clicked Pay twice (or refreshed), creating two charges. Stripe's idempotency keys prevent duplicate charges for same request.",
        "Database issue",
        "Race condition"
      ],
      "correct": 1,
      "explain": "Without idempotency keys, rapid duplicate requests create duplicate charges. Stripe's idempotency keys (unique per request) ensure same request never charges twice, even if submitted multiple times."
    },
    {
      "q": "When should you fulfill an order after Stripe payment?",
      "opts": [
        "Immediately when form submits",
        "Only after payment_intent.succeeded webhook confirms payment. Don't trust client-side confirmation alone—can be spoofed.",
        "After user confirms",
        "When payment status is 'processing'"
      ],
      "correct": 1,
      "explain": "Wait for payment_intent.succeeded webhook. Client-side confirmations can be faked. Webhooks are server-to-server and signature-verified. Only fulfill orders after webhook confirms payment succeeded."
    }
  ],
  "essay": {
    "q": "Your dev proposes storing encrypted card numbers for 'faster checkout'. What are the PCI implications? What's the cost/benefit analysis? What's the Stripe alternative?",
    "guide": "PCI implications: Storing card data (even encrypted) requires: 1) Annual PCI audit ($50k-300k for Level 1), 2) Quarterly vulnerability scans, 3) Extensive security controls (firewalls, encryption, access logs), 4) Massive liability if breached (legal + fines + customer notification). Cost: $100k+ annually in compliance + dev time. Benefit: Slightly faster checkout. Analysis: Not worth it. Stripe alternative: Payment Methods API. Store Stripe payment method ID (pm_xxx), Stripe stores actual card. Customer's saved cards work in one click, zero PCI burden for you. Recommendation: Use Stripe's saved payment methods. Same UX, 99% less cost and risk."
  }
};
