// Day 12: DOM & Event Handling
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[12] = {
  "day": 12,
  "week": 1,
  "title": "DOM & Event Handling",
  "desc": "How JavaScript interacts with pages",
  "duration": "50 min",
  "coldOpen": "Customers report 'Add to Cart' sometimes doesn't work—they click, nothing happens. Your dev says 'works for me'. QA can't reproduce. What's happening?",
  "coldRevisit": "Classic race condition: JavaScript tries to attach event listeners before DOM elements exist. Happens intermittently based on connection speed. Fix: wait for DOM to load before running scripts, or use event delegation.",
  "content": "<h2>Why This Matters to You</h2><p>The DOM (Document Object Model) is how JavaScript interacts with web pages—reading form values, updating text, handling clicks. When customers say 'the button doesn't work sometimes', it's usually a DOM timing issue. Understanding DOM basics helps you diagnose why features work locally but fail in production.</p><h2>1. What is the DOM?</h2><p>The DOM is a tree representation of your HTML that JavaScript can manipulate:</p><pre>&lt;!-- HTML --&gt;\n&lt;div id=\"cart\"&gt;\n  &lt;h2&gt;Shopping Cart&lt;/h2&gt;\n  &lt;button class=\"checkout-btn\"&gt;Checkout&lt;/button&gt;\n&lt;/div&gt;\n\n/* DOM Tree:\ndocument\n  └─ div#cart\n       ├─ h2 \"Shopping Cart\"\n       └─ button.checkout-btn \"Checkout\"\n*/</pre><div class=\"info-box\"><div class=\"info-title\">💡 Key Concept</div><p>HTML is the blueprint. DOM is the living structure JavaScript can read and modify. When you click a button, JavaScript finds that button in the DOM and executes code.</p></div><h2>2. Selecting DOM Elements</h2><p>Before you can interact with elements, you need to find them:</p><pre>// Modern selectors (use these)\nconst button = document.querySelector('.checkout-btn');  // First match\nconst allButtons = document.querySelectorAll('.btn');    // All matches\n\n// Old selectors (still common)\nconst element = document.getElementById('cart');         // By ID\nconst items = document.getElementsByClassName('item');   // By class\n\n// Real-world example: find and update cart total\nconst totalElement = document.querySelector('.cart-total');\ntotalElement.textContent = '£149.99';</pre><h3>Selector Syntax (CSS-based)</h3><table><tr><th>Selector</th><th>Meaning</th><th>Example</th></tr><tr><td><code>.classname</code></td><td>Class selector</td><td><code>querySelector('.button')</code></td></tr><tr><td><code>#id</code></td><td>ID selector</td><td><code>querySelector('#checkout')</code></td></tr><tr><td><code>element</code></td><td>Tag selector</td><td><code>querySelector('button')</code></td></tr><tr><td><code>[attribute]</code></td><td>Attribute selector</td><td><code>querySelector('[data-id=\"123\"]')</code></td></tr><tr><td>Combinations</td><td>Multiple selectors</td><td><code>querySelector('button.primary')</code></td></tr></table><h2>3. The Race Condition Problem</h2><p>This is the most common DOM bug:</p><pre>&lt;!-- HTML --&gt;\n&lt;script&gt;\n  // This runs IMMEDIATELY - button doesn't exist yet!\n  const button = document.querySelector('.add-to-cart');\n  button.addEventListener('click', addToCart);  // ERROR: button is null\n&lt;/script&gt;\n\n&lt;button class=\"add-to-cart\"&gt;Add to Cart&lt;/button&gt;</pre><h3>Solution 1: Move Script to Bottom</h3><pre>&lt;button class=\"add-to-cart\"&gt;Add to Cart&lt;/button&gt;\n\n&lt;!-- Script runs after button exists --&gt;\n&lt;script&gt;\n  const button = document.querySelector('.add-to-cart');\n  button.addEventListener('click', addToCart);  // Works!\n&lt;/script&gt;</pre><h3>Solution 2: DOMContentLoaded Event</h3><pre>&lt;!-- Script can be anywhere --&gt;\n&lt;script&gt;\n  // Wait for DOM to be fully loaded\n  document.addEventListener('DOMContentLoaded', () => {\n    const button = document.querySelector('.add-to-cart');\n    button.addEventListener('click', addToCart);  // Safe!\n  });\n&lt;/script&gt;</pre><h3>Solution 3: Defer Attribute (Best Practice)</h3><pre>&lt;!-- defer = download in background, execute after DOM ready --&gt;\n&lt;script src=\"app.js\" defer&gt;&lt;/script&gt;\n\n&lt;!-- No DOMContentLoaded needed in app.js --&gt;\n// app.js\nconst button = document.querySelector('.add-to-cart');\nbutton.addEventListener('click', addToCart);</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ The 'Works For Me' Problem</div><p>Race conditions are intermittent. Fast connections/computers load scripts before DOM finishes. Slow connections finish DOM before scripts download. If dev tests locally (fast), it works. If user is on 3G (slow), it fails. Always use defer or DOMContentLoaded.</p></div><h2>4. Event Listeners: Responding to User Actions</h2><p>Event listeners attach code to user actions:</p><pre>// Basic click handler\nconst button = document.querySelector('.add-to-cart');\n\nbutton.addEventListener('click', (event) => {\n  event.preventDefault();  // Stop default action (for forms/links)\n  \n  // Get data from button\n  const productId = button.getAttribute('data-product-id');\n  const productName = button.getAttribute('data-product-name');\n  \n  // Add to cart\n  addToCart(productId, productName);\n  \n  // Update UI\n  button.textContent = 'Added!';\n  button.disabled = true;\n});</pre><h3>Common Events</h3><table><tr><th>Event</th><th>When It Fires</th><th>Common Use</th></tr><tr><td><code>click</code></td><td>Element clicked</td><td>Buttons, links</td></tr><tr><td><code>submit</code></td><td>Form submitted</td><td>Checkout, login, search</td></tr><tr><td><code>change</code></td><td>Input value changes</td><td>Dropdowns, checkboxes</td></tr><tr><td><code>input</code></td><td>Text input changes (realtime)</td><td>Search autocomplete</td></tr><tr><td><code>focus</code> / <code>blur</code></td><td>Input gains/loses focus</td><td>Form validation</td></tr><tr><td><code>load</code></td><td>Resource finishes loading</td><td>Images, scripts</td></tr><tr><td><code>scroll</code></td><td>User scrolls</td><td>Infinite scroll, animations</td></tr></table><h2>5. Event Delegation: Handling Dynamic Content</h2><p>Problem: Event listeners don't work on elements added after page load.</p><pre>// WRONG: Listener won't work for future buttons\ndocument.querySelectorAll('.delete-item').forEach(button => {\n  button.addEventListener('click', deleteItem);\n});\n\n// If you add new items dynamically, they won't have listeners!\n</pre><h3>Solution: Event Delegation</h3><pre>// RIGHT: Listen on parent, check if target matches selector\ndocument.querySelector('.cart-items').addEventListener('click', (event) => {\n  // Check if clicked element is a delete button\n  if (event.target.classList.contains('delete-item')) {\n    const itemId = event.target.getAttribute('data-item-id');\n    deleteItem(itemId);\n  }\n});\n\n// Now works for all current AND future delete buttons</pre><div class=\"exercise\"><h4>🔧 Debugging Exercise</h4><p>This code doesn't work. Why?</p><pre>&lt;script&gt;\n  const form = document.querySelector('#checkout-form');\n  form.addEventListener('submit', processCheckout);\n&lt;/script&gt;\n\n&lt;form id=\"checkout-form\"&gt;\n  &lt;!-- form fields --&gt;\n&lt;/form&gt;</pre><p><strong>Answer:</strong> Script runs before form exists. Fix: add 'defer' to script tag or wrap in DOMContentLoaded.</p></div><h2>6. Manipulating the DOM</h2><h3>Reading and Writing Content</h3><pre>// Get text content\nconst price = document.querySelector('.price').textContent;  // '£29.99'\n\n// Set text content\ndocument.querySelector('.total').textContent = '£149.99';\n\n// Get HTML content\nconst html = document.querySelector('.description').innerHTML;\n\n// Set HTML content (be careful with user input - XSS risk!)\ndocument.querySelector('.message').innerHTML = '&lt;strong&gt;Success!&lt;/strong&gt;';</pre><h3>Modifying Classes (Show/Hide, Styling)</h3><pre>const element = document.querySelector('.modal');\n\n// Add class\nelement.classList.add('visible');\n\n// Remove class\nelement.classList.remove('hidden');\n\n// Toggle class (add if absent, remove if present)\nelement.classList.toggle('active');\n\n// Check if class exists\nif (element.classList.contains('disabled')) {\n  // Do something\n}</pre><h3>Reading Form Values</h3><pre>// Get input value\nconst email = document.querySelector('#email').value;\n\n// Get checkbox state\nconst isChecked = document.querySelector('#terms').checked;\n\n// Get selected dropdown option\nconst country = document.querySelector('#country').value;</pre><h2>7. Creating and Removing Elements</h2><pre>// Create new element\nconst newItem = document.createElement('div');\nnewItem.className = 'cart-item';\nnewItem.innerHTML = `\n  &lt;span class=\"product-name\"&gt;Headphones&lt;/span&gt;\n  &lt;span class=\"product-price\"&gt;£149.99&lt;/span&gt;\n`;\n\n// Add to DOM\nconst cart = document.querySelector('.cart-items');\ncart.appendChild(newItem);\n\n// Remove element\nconst itemToRemove = document.querySelector('[data-item-id=\"123\"]');\nitemToRemove.remove();</pre><h2>8. Real-World Example: Dynamic Cart</h2><pre>// Add to cart functionality\nfunction setupCart() {\n  // Event delegation for all add-to-cart buttons\n  document.body.addEventListener('click', (event) => {\n    if (event.target.classList.contains('add-to-cart')) {\n      const button = event.target;\n      const productId = button.getAttribute('data-product-id');\n      const productName = button.getAttribute('data-product-name');\n      const productPrice = button.getAttribute('data-product-price');\n      \n      // Add to cart (localStorage for persistence)\n      addToCart({ id: productId, name: productName, price: productPrice });\n      \n      // Visual feedback\n      button.textContent = 'Added!';\n      button.classList.add('added');\n      setTimeout(() => {\n        button.textContent = 'Add to Cart';\n        button.classList.remove('added');\n      }, 2000);\n      \n      // Update cart count\n      updateCartCount();\n    }\n  });\n}\n\nfunction addToCart(product) {\n  const cart = JSON.parse(localStorage.getItem('cart') || '[]');\n  cart.push(product);\n  localStorage.setItem('cart', JSON.stringify(cart));\n}\n\nfunction updateCartCount() {\n  const cart = JSON.parse(localStorage.getItem('cart') || '[]');\n  document.querySelector('.cart-count').textContent = cart.length;\n}\n\n// Initialize when DOM ready\ndocument.addEventListener('DOMContentLoaded', setupCart);</pre>",
  "questions": [
    {
      "q": "Customer reports 'Add to Cart' button doesn't work on slow connections, but QA can't reproduce. What's likely the issue?",
      "opts": [
        "Browser compatibility",
        "Race condition: JavaScript tries to add event listener before button exists in DOM. Fix: use defer attribute or DOMContentLoaded event.",
        "Server is slow",
        "Need to clear cache"
      ],
      "correct": 1,
      "explain": "Classic race condition. On fast connections, DOM loads before script executes. On slow connections, script executes before DOM finishes. Always wait for DOM with defer or DOMContentLoaded."
    },
    {
      "q": "You dynamically add products to page after initial load. Their 'Add to Cart' buttons don't work. Why?",
      "opts": [
        "Event listeners were attached to original buttons only, not new ones. Fix: use event delegation—listen on parent container instead.",
        "Need to refresh page",
        "JavaScript is broken",
        "Buttons are disabled"
      ],
      "correct": 0,
      "explain": "Event listeners are attached at setup time. New elements don't have listeners. Event delegation solves this: listen on a parent that exists at page load, check if clicked target matches your selector."
    },
    {
      "q": "What's the difference between textContent and innerHTML?",
      "opts": [
        "No difference",
        "textContent sets plain text (safe). innerHTML sets HTML (can execute scripts if user input not sanitized—XSS risk).",
        "innerHTML is faster",
        "textContent doesn't work on all browsers"
      ],
      "correct": 1,
      "explain": "textContent treats input as plain text (safe). innerHTML parses HTML, which can execute malicious scripts if you insert unsanitized user input. Use textContent unless you specifically need to insert HTML."
    },
    {
      "q": "This code fails: `const form = document.querySelector('#form'); form.addEventListener(...)` What's the most common cause?",
      "opts": [
        "querySelector is deprecated",
        "Script runs before #form element exists in DOM (race condition)",
        "addEventListener syntax is wrong",
        "Form doesn't have an ID"
      ],
      "correct": 1,
      "explain": "Most common: script runs before DOM element exists. querySelector returns null, and null.addEventListener throws error. Fix: use defer attribute, DOMContentLoaded, or move script below HTML."
    },
    {
      "q": "Developer proposes using jQuery to 'make DOM manipulation easier'. Your response?",
      "opts": [
        "Approve—jQuery is essential",
        "Ask: What specific problems is jQuery solving? Modern vanilla JavaScript (querySelector, classList, fetch) handles most needs. jQuery adds 30KB+ overhead.",
        "Reject—jQuery is obsolete",
        "Require all third-party libraries"
      ],
      "correct": 1,
      "explain": "jQuery was essential in 2010 when browsers were inconsistent. Modern JavaScript has querySelector, classList, fetch—most jQuery use cases covered. Adding 30KB+ library needs justification beyond 'easier'."
    }
  ],
  "essay": {
    "q": "Your checkout flow has intermittent bugs: sometimes form validation doesn't run, sometimes 'Place Order' button doesn't respond. How do you diagnose these DOM timing issues? What questions do you ask your dev team?",
    "guide": "Ask: Where are scripts loaded (in <head>? at bottom?)? Are they using defer or DOMContentLoaded? Test: Throttle network to 3G in Chrome DevTools, does it fail consistently? Check: Open DevTools console, are there 'null' errors? Look for: event listeners attached before DOM ready, event delegation missing for dynamic content. Recommend: Add defer to all scripts, use event delegation for dynamic elements, add error monitoring (Sentry) to catch timing errors in production. Priority: These bugs lose revenue—customers can't checkout. Fix immediately."
  }
};
