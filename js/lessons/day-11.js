// Day 11: JavaScript Fundamentals
window.__lessonCache = window.__lessonCache || {};
window.__lessonCache[11] = {
  "day": 11,
  "week": 1,
  "title": "JavaScript Fundamentals",
  "desc": "The language of web interactivity",
  "duration": "55 min",
  "coldOpen": "Your dev team proposes rewriting your entire codebase in TypeScript. The project estimate is 4 months. Marketing needs new features next month. How do you evaluate if TypeScript is worth the investment?",
  "coldRevisit": "TypeScript adds type safety—catching errors at compile time instead of runtime. But it's not all-or-nothing. You can adopt TypeScript incrementally: add it to new code, convert critical files gradually. A 4-month rewrite is unnecessary.",
  "content": "<h2>Why This Matters to You</h2><p>JavaScript is the language of web interactivity—every button click, form submission, and dynamic update uses JavaScript. As a leader, you don't need to write JavaScript, but understanding how it works helps you evaluate technical decisions: Is this feature complex? Is this timeline realistic? Should we use TypeScript?</p><h2>1. JavaScript Basics: Variables and Data Types</h2><p>JavaScript stores data in variables. There are three ways to declare variables:</p><pre>// const: cannot be reassigned (use this by default)\nconst userName = 'John';\nconst userAge = 30;\n\n// let: can be reassigned (use when value changes)\nlet cartTotal = 0;\ncartTotal = cartTotal + 50;  // Allowed\n\n// var: old style, avoid (causes scoping issues)\nvar oldStyle = 'avoid this';</pre><h3>Data Types</h3><table><tr><th>Type</th><th>Example</th><th>Usage</th></tr><tr><td><strong>String</strong></td><td><code>'Hello'</code> or <code>\"World\"</code></td><td>Text data</td></tr><tr><td><strong>Number</strong></td><td><code>42</code> or <code>3.14</code></td><td>Integers and decimals</td></tr><tr><td><strong>Boolean</strong></td><td><code>true</code> or <code>false</code></td><td>Yes/no, on/off logic</td></tr><tr><td><strong>Array</strong></td><td><code>['apple', 'banana', 'orange']</code></td><td>Lists of items</td></tr><tr><td><strong>Object</strong></td><td><code>{ name: 'John', age: 30 }</code></td><td>Structured data</td></tr><tr><td><strong>null/undefined</strong></td><td><code>null</code> or <code>undefined</code></td><td>Empty or missing values</td></tr></table><h2>2. Functions: Reusable Code Blocks</h2><p>Functions are reusable pieces of code. They take inputs (parameters) and return outputs.</p><pre>// Function declaration\nfunction calculateTotal(price, quantity) {\n  return price * quantity;\n}\n\n// Usage\nconst total = calculateTotal(29.99, 3);\n// total is 89.97\n\n// Arrow function (modern syntax)\nconst calculateDiscount = (price, percent) => {\n  return price * (percent / 100);\n};\n\n// Short arrow function (single expression)\nconst calculateTax = (price) => price * 0.20;</pre><div class=\"info-box\"><div class=\"info-title\">💡 Why Functions Matter</div><p>Functions reduce duplication. If you calculate totals in 5 places, a bug fix requires 5 changes. With a function, fix it once. Functions also make code testable—you can verify <code>calculateTotal(10, 3)</code> returns <code>30</code>.</p></div><h2>3. Conditionals: Making Decisions</h2><p>Code needs to make decisions based on data:</p><pre>// if/else statement\nif (cartTotal > 100) {\n  shippingCost = 0;  // Free shipping\n} else if (cartTotal > 50) {\n  shippingCost = 5;  // Reduced shipping\n} else {\n  shippingCost = 10; // Standard shipping\n}\n\n// Ternary operator (shorthand for simple if/else)\nconst shipping = cartTotal > 100 ? 0 : 10;\n\n// Real-world example: checkout validation\nfunction canCheckout(cart, paymentMethod) {\n  if (cart.items.length === 0) {\n    return false;  // Empty cart\n  }\n  if (!paymentMethod) {\n    return false;  // No payment method\n  }\n  return true;  // Can proceed\n}</pre><h2>4. Loops: Processing Lists</h2><p>Loops process arrays of data:</p><pre>const products = [\n  { name: 'Laptop', price: 999 },\n  { name: 'Mouse', price: 29 },\n  { name: 'Keyboard', price: 79 }\n];\n\n// forEach: do something for each item\nproducts.forEach(product => {\n  console.log(product.name);\n});\n\n// map: transform each item into new array\nconst prices = products.map(product => product.price);\n// prices = [999, 29, 79]\n\n// filter: keep only items matching condition\nconst expensive = products.filter(product => product.price > 100);\n// expensive = [{ name: 'Laptop', price: 999 }]\n\n// reduce: calculate single value from array\nconst total = products.reduce((sum, product) => sum + product.price, 0);\n// total = 1107</pre><div class=\"exercise\"><h4>🔧 Understanding Business Logic</h4><p>This code calculates bulk discounts:</p><pre>function calculatePrice(quantity, unitPrice) {\n  if (quantity >= 100) return quantity * unitPrice * 0.8;\n  if (quantity >= 50) return quantity * unitPrice * 0.9;\n  return quantity * unitPrice;\n}</pre><p><strong>Question:</strong> What discount does a customer get at 75 units? (Answer: 10% off)</p></div><h2>5. Objects: Structured Data</h2><p>Objects group related data:</p><pre>// Product object\nconst product = {\n  id: 'ABC123',\n  name: 'Wireless Headphones',\n  price: 149.99,\n  inStock: true,\n  categories: ['Electronics', 'Audio'],\n  \n  // Objects can contain functions (methods)\n  applyDiscount: function(percent) {\n    return this.price * (1 - percent / 100);\n  }\n};\n\n// Accessing properties\nconsole.log(product.name);     // 'Wireless Headphones'\nconsole.log(product.price);    // 149.99\n\n// Calling methods\nconst salePrice = product.applyDiscount(20);\n// salePrice = 119.99</pre><h2>6. Asynchronous JavaScript: Handling Delays</h2><p>Many operations take time: API calls, database queries, file uploads. JavaScript handles these asynchronously using Promises and async/await.</p><pre>// Old way: callbacks (messy, hard to read)\nfetchUser(userId, function(user) {\n  fetchOrders(user.id, function(orders) {\n    fetchOrderDetails(orders[0].id, function(details) {\n      // \"Callback hell\" - deeply nested\n    });\n  });\n});\n\n// Modern way: async/await (clean, readable)\nasync function loadCheckoutData() {\n  try {\n    const user = await fetchUser(userId);\n    const orders = await fetchOrders(user.id);\n    const details = await fetchOrderDetails(orders[0].id);\n    return details;\n  } catch (error) {\n    console.error('Failed to load data:', error);\n  }\n}</pre><div class=\"warning-box\"><div class=\"warning-title\">⚠️ Common Async Mistake</div><p>Forgetting <code>await</code> causes bugs:</p><pre>// Bug: getData() returns Promise, not data\nconst data = getData();  // WRONG\n\n// Correct: await the Promise\nconst data = await getData();  // RIGHT</pre></div><h2>7. Error Handling: try/catch</h2><p>Code can fail. Handle errors gracefully:</p><pre>async function processPayment(paymentData) {\n  try {\n    // Attempt payment\n    const result = await stripeAPI.charge(paymentData);\n    return { success: true, transactionId: result.id };\n  } catch (error) {\n    // Payment failed - log error, show user-friendly message\n    console.error('Payment failed:', error);\n    return { \n      success: false, \n      message: 'Payment declined. Please try another card.' \n    };\n  }\n}</pre><h2>8. JavaScript vs TypeScript</h2><table><tr><th>Aspect</th><th>JavaScript</th><th>TypeScript</th></tr><tr><td><strong>Type Safety</strong></td><td>No compile-time checks</td><td>Catches type errors before runtime</td></tr><tr><td><strong>Learning Curve</strong></td><td>Easier to start</td><td>Requires learning type syntax</td></tr><tr><td><strong>Adoption</strong></td><td>Works immediately</td><td>Can adopt incrementally, file by file</td></tr><tr><td><strong>Build Step</strong></td><td>Runs directly in browser</td><td>Must compile to JavaScript</td></tr><tr><td><strong>IDE Support</strong></td><td>Basic autocomplete</td><td>Excellent autocomplete and refactoring</td></tr></table><h3>TypeScript Example</h3><pre>// JavaScript: no type checking\nfunction calculateTotal(price, quantity) {\n  return price * quantity;\n}\ncalculateTotal('29.99', '3');  // Returns '29.9929.9929.99' (bug!)\n\n// TypeScript: enforces types\nfunction calculateTotal(price: number, quantity: number): number {\n  return price * quantity;\n}\ncalculateTotal('29.99', '3');  // Compile error: strings not allowed</pre><div class=\"info-box\"><div class=\"info-title\">💡 TypeScript Decision Framework</div><p><strong>Adopt TypeScript if:</strong> Large team, complex codebase, frequent refactoring<br><strong>Skip TypeScript if:</strong> Small team, simple site, rapid prototyping<br><strong>Best approach:</strong> Start with JavaScript, add TypeScript to new files as team grows</p></div><h2>9. Common JavaScript Pitfalls</h2><h3>1. Truthy/Falsy Values</h3><pre>// These all evaluate to false:\nif (0) { }          // 0 is falsy\nif ('') { }         // empty string is falsy\nif (null) { }       // null is falsy\nif (undefined) { }  // undefined is falsy\n\n// Problem: this fails if quantity is 0\nif (quantity) {\n  processOrder();   // Won't run if quantity is 0!\n}\n\n// Better: explicit check\nif (quantity !== undefined && quantity !== null) {\n  processOrder();\n}</pre><h3>2. Equality Comparisons</h3><pre>// == does type coercion (usually wrong)\n'5' == 5    // true (string converted to number)\n0 == false  // true\n\n// === checks type and value (use this)\n'5' === 5    // false (different types)\n0 === false  // false</pre><h3>3. Variable Scope</h3><pre>// var has function scope (causes bugs)\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 3, 3, 3 (not 0, 1, 2)\n\n// let has block scope (correct)\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 0, 1, 2 (as expected)</pre>",
  "questions": [
    {
      "q": "Developer says TypeScript will prevent bugs and proposes 4-month rewrite. What should you ask?",
      "opts": [
        "Approve immediately—fewer bugs is good",
        "Ask: Can we adopt TypeScript incrementally for new code and critical files rather than rewriting everything? What specific bugs would this prevent?",
        "Reject—TypeScript is unnecessary",
        "Wait for TypeScript 2.0"
      ],
      "correct": 1,
      "explain": "TypeScript can be adopted incrementally—no rewrite needed. Add to new files, convert critical files gradually. Always ask: what specific problems are we solving? Don't rewrite unless necessary."
    },
    {
      "q": "This code has a bug: `if (quantity) { processOrder(); }` What's wrong?",
      "opts": [
        "Nothing, it's correct",
        "If quantity is 0 (a valid order), it's falsy and order won't process. Should use `if (quantity !== null && quantity !== undefined)` instead.",
        "Should use ==",
        "processOrder needs await"
      ],
      "correct": 1,
      "explain": "In JavaScript, 0 is falsy. If quantity is 0, the condition fails even though 0 is a valid quantity. Always check explicitly for null/undefined, not truthiness."
    },
    {
      "q": "Your site has async function that loads product data but sometimes shows 'undefined'. What's likely wrong?",
      "opts": [
        "Database is slow",
        "Forgot to use 'await' keyword—function returns Promise, not data. Code tries to use data before it's loaded.",
        "Need faster server",
        "JavaScript is broken"
      ],
      "correct": 1,
      "explain": "Common async bug: forgetting await. Without await, you get a Promise object, not the actual data. Always await async operations before using the result."
    },
    {
      "q": "How do you evaluate if learning TypeScript is worth the team's time?",
      "opts": [
        "TypeScript is always worth it",
        "Consider: team size (larger teams benefit more), codebase complexity (complex logic benefits from types), frequency of refactoring (types help). Small teams with simple sites can skip it.",
        "Never worth it—JavaScript is fine",
        "Flip a coin"
      ],
      "correct": 1,
      "explain": "TypeScript adds value for large teams, complex codebases, and frequent refactoring. Small teams with simple sites get less benefit. Evaluate based on your specific context, not hype."
    },
    {
      "q": "This code calculates a discount: `const price = product.price * (1 - discount / 100);` What happens if discount is '20' (string) instead of 20 (number)?",
      "opts": [
        "Works fine—JavaScript converts it",
        "Results in incorrect calculation because string math behaves unexpectedly. TypeScript would catch this at compile time.",
        "Throws error immediately",
        "Returns 0"
      ],
      "correct": 1,
      "explain": "JavaScript's type coercion can cause subtle bugs. '20' / 100 works, but unexpected results happen often. TypeScript catches these at compile time, preventing runtime bugs."
    }
  ],
  "essay": {
    "q": "Your dev team wants to adopt TypeScript, estimating 4 months for full migration. How do you evaluate this proposal? What questions do you ask? What alternative approaches might you suggest?",
    "guide": "Ask: What specific bugs or problems will TypeScript solve? Can we quantify the cost of current JavaScript bugs? Can we adopt incrementally (new files only, then convert critical files)? What's the team's TypeScript experience? Alternative: Start with TypeScript on new features only, use JSDoc comments for type hints in existing JavaScript, convert critical/frequently-changed files first. A 4-month full rewrite should be last resort. Calculate: 4 months = ~£80k dev cost. Is this justified by bug reduction? Or can incremental adoption achieve 80% of benefits for 20% of cost?"
  }
};
