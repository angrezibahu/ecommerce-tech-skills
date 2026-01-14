// Technical Fluency for Ecommerce Leaders - Complete Lessons Data  
// All 30 days of comprehensive technical education content

var lessonsData = [
    // Note: Days 1-7 would contain the full Infrastructure & Architecture content
    // These should be added from the existing comprehensive content
    // For now starting with Day 8 onwards as provided

    // DAY 8 - HTML5 SEMANTICS & ACCESSIBILITY (FULL CONTENT)
    {
        day: 8,
        week: 1,
        title: "HTML5 Semantics & Accessibility",
        desc: "Meaningful markup and inclusive design",
        duration: "55 min",
        coldOpen: "Legal warns about accessibility lawsuit risk. Your competitor just settled for £500k. The dev team says our site works fine. What do you need to know?",
        coldRevisit: "Accessibility is a legal requirement in many jurisdictions (ADA, EAA, WCAG). 'Works fine' often means 'works for people like us'. 15% of users have disabilities. Semantic HTML helps everyone—screen readers, SEO, and maintenance.",
        content: "<h2>Why This Matters to You</h2><p>Accessibility isn't just about compliance—though the legal risk is real. In 2023, over 4,000 web accessibility lawsuits were filed in the US alone. But beyond legal risk, accessible sites reach more customers, rank better in search, and are easier to maintain.</p><h2>1. Semantic HTML: Meaning Over Appearance</h2><p>HTML elements carry meaning. Using the right element helps browsers, search engines, and assistive technologies understand your content.</p><pre>&lt;!-- Bad: Divs mean nothing to assistive technology --&gt;\\n&lt;div class=\\\"header\\\"&gt;\\n  &lt;div class=\\\"nav\\\"&gt;\\n    &lt;div class=\\\"nav-item\\\"&gt;Products&lt;/div&gt;\\n  &lt;/div&gt;\\n&lt;/div&gt;\\n\\n&lt;!-- Good: Semantic elements convey structure --&gt;\\n&lt;header&gt;\\n  &lt;nav&gt;\\n    &lt;a href=\\\"/products\\\"&gt;Products&lt;/a&gt;\\n  &lt;/nav&gt;\\n&lt;/header&gt;</pre><h3>Key Semantic Elements</h3><table><tr><th>Element</th><th>Purpose</th><th>Screen Reader Behavior</th></tr><tr><td><code>&lt;header&gt;</code></td><td>Page or section header</td><td>Announced as banner landmark</td></tr><tr><td><code>&lt;nav&gt;</code></td><td>Navigation links</td><td>Announced as navigation landmark</td></tr><tr><td><code>&lt;main&gt;</code></td><td>Primary content</td><td>Users can skip directly to main content</td></tr><tr><td><code>&lt;article&gt;</code></td><td>Self-contained content</td><td>Announced as article</td></tr><tr><td><code>&lt;aside&gt;</code></td><td>Related but separate content</td><td>Announced as complementary</td></tr><tr><td><code>&lt;footer&gt;</code></td><td>Page or section footer</td><td>Announced as contentinfo landmark</td></tr><tr><td><code>&lt;button&gt;</code></td><td>Clickable action</td><td>Announced as button, keyboard accessible</td></tr></table><div class=\\\"info-box\\\"><div class=\\\"info-title\\\">💡 The Landmark Test</div><p>Screen reader users navigate by landmarks (header, nav, main, footer). If your site is all divs, they hear nothing useful. Ask your team: Can a screen reader user navigate our site by landmarks?</p></div><h2>2. Accessibility Fundamentals (WCAG)</h2><p>Web Content Accessibility Guidelines (WCAG) define accessibility standards. Level AA is typically the legal requirement.</p><h3>The Four Principles: POUR</h3><table><tr><th>Principle</th><th>Meaning</th><th>Example Requirement</th></tr><tr><td><strong>Perceivable</strong></td><td>Users can perceive content</td><td>Images have alt text, videos have captions</td></tr><tr><td><strong>Operable</strong></td><td>Users can interact</td><td>Everything works with keyboard, no seizure-inducing flashes</td></tr><tr><td><strong>Understandable</strong></td><td>Content is clear</td><td>Consistent navigation, error messages explain how to fix</td></tr><tr><td><strong>Robust</strong></td><td>Works with assistive tech</td><td>Valid HTML, ARIA used correctly</td></tr></table>",
        questions: [
            { q: "Your site uses div onclick for all buttons. Dev says it works fine. What's wrong?", opts: ["Nothing—JavaScript handles the click", "Screen readers can't identify it as interactive; keyboard users can't Tab to it or activate with Enter", "Divs are slower than buttons", "Only affects old browsers"], correct: 1, explain: "Native button elements are focusable, keyboard operable, and announced correctly by screen readers—for free. Divs need extensive ARIA and JavaScript to achieve the same." },
            { q: "Images have alt=\\\"\\\" (empty). When is this correct?", opts: ["Never—all images need descriptions", "When the image is purely decorative and adds no information", "Always—for faster loading", "Only for background images"], correct: 1, explain: "Decorative images should have empty alt so screen readers skip them. Informative images need descriptive alt text." }
        ],
        essay: { q: "Audit your company's checkout flow for accessibility. What issues exist? What is the business and legal risk?", guide: "Run axe DevTools, test with keyboard only, check color contrast on buttons. Consider: legal exposure, lost sales from excluded users, brand reputation. Prioritize fixes by severity." }
    }
];

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = lessonsData;
}
