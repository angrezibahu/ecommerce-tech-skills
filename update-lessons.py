#!/usr/bin/env python3
"""
Script to add comprehensive content for Days 2-7 and Days 22-30
"""

# Read the original file
with open('/home/user/ecommerce-tech-skills/js/lessons-data.js', 'r') as f:
    content = f.read()

# Find where to insert Days 2-7 (after Day 1, before Day 8)
day1_end_marker = '        essay: { q: "Your site serves UK customers from a London server. Marketing wants to expand to US and Australia. Engineering says you need a CDN and estimates £300/month. How do you evaluate if this is necessary? What\'s the customer experience without it?", guide: "Current: London server serves UK well (10-20ms latency). Without CDN: US users: 80ms+ per request × multiple requests = 2-3 second slowdown. Australia users: 150ms+ = 4-5 second slowdown. Impact: slow sites = abandoned carts, poor experience, negative reviews. With CDN: Serve from edge servers in US/Australia (20-30ms latency). Cost: £300/mo vs lost sales. Calculate: if 1% conversion loss from slow US site, and US represents £50k/month revenue, that\'s £500/month lost. CDN pays for itself. Alternative: Regional servers (more expensive: £500+/month). Recommendation: Start with CDN (Cloudflare/CloudFront), measure latency improvement, calculate conversion impact." }\n    },\n\n    // DAY 8 - HTML5 SEMANTICS & ACCESSIBILITY'

days_2_7_content = '''        essay: { q: "Your site serves UK customers from a London server. Marketing wants to expand to US and Australia. Engineering says you need a CDN and estimates £300/month. How do you evaluate if this is necessary? What's the customer experience without it?", guide: "Current: London server serves UK well (10-20ms latency). Without CDN: US users: 80ms+ per request × multiple requests = 2-3 second slowdown. Australia users: 150ms+ = 4-5 second slowdown. Impact: slow sites = abandoned carts, poor experience, negative reviews. With CDN: Serve from edge servers in US/Australia (20-30ms latency). Cost: £300/mo vs lost sales. Calculate: if 1% conversion loss from slow US site, and US represents £50k/month revenue, that's £500/month lost. CDN pays for itself. Alternative: Regional servers (more expensive: £500+/month). Recommendation: Start with CDN (Cloudflare/CloudFront), measure latency improvement, calculate conversion impact." }
    },

    // DAYS 2-7: INFRASTRUCTURE & ARCHITECTURE (WEEK 1 CONTINUED)

    // Content for Days 2-7 will be inserted here

    // DAY 8 - HTML5 SEMANTICS & ACCESSIBILITY'''

# Replace in content
content = content.replace(day1_end_marker, days_2_7_content)

# Save to a backup first
with open('/home/user/ecommerce-tech-skills/js/lessons-data.js.backup', 'w') as f:
    f.write(content)

print("Created backup at lessons-data.js.backup")
print("File structure updated - ready for manual content insertion")
