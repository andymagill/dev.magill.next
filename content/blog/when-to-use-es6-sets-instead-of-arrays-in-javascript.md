---
title: When to Use ES6 Sets Instead of Arrays in JavaScript
description: Learn when to reach for ES6 Sets versus Arrays in JavaScript, with practical scenarios demonstrating where each shines.
image: /images/blog/new-set-closeup.jpg
tags: JavaScript, ES6, Sets, Arrays
created: 1750255285
lastUpdated: 
---

If you are like me, you often reach for arrays out of habit. They’re flexible, familiar, and perfect for most everyday tasks like rendering UI, keeping things in order, or working with duplicates. 

But sometimes we need to guarantee uniqueness as a requirement, or check values in a huge list quickly. That’s where ES6 Sets come in. Let's consider some real world examples of both Sets and Arrays, and demonstrate how to properly use them in your next project.

## Tracking Unique Events with Sets

Suppose you’re building a notification or error logging system that needs to track which unique error codes have occurred, so you don’t repeatedly alert users about the same issue.

```js
const uniqueErrorCodes = new Set();

function handleError(code) {
  if (!uniqueErrorCodes.has(code)) {
    uniqueErrorCodes.add(code);
    // Show notification or log error
    console.log(`New error: ${code}`);
  }
}
```
### Why use a Set here?

**Performance:** `Set.has()` offers lookups with [static complexity (O(1))](https://medium.com/analytics-vidhya/big-o-notation-time-complexity-in-javascript-f97f356de2c4), so checking for a value is much faster than `Array.includes()`, which has dynamic O(n) complexity—based on the size of the collection.

**Uniqueness:** Sets automatically enforce uniqueness, so you never have to worry about duplicate error codes.

**Scalability:** As your app grows and more error codes are tracked, Sets remain fast and efficient, while Arrays slow down with each additional check

### Limitations of Sets

While Sets offer unique advantages, arrays are still preferable in many scenarios:

- **Indexing & Ordering:** Arrays maintain the order of elements and allow direct access by index (e.g., `arr[2]`). Sets do not support index-based access.
- **Advanced Methods:** Arrays have methods like `map`, `filter`, `reduce`, and `sort` that are not available on Sets. If you need to transform or aggregate data, arrays are often more convenient.
- **Serialization & Compatibility:** Arrays can be easily serialized to JSON, while Sets require conversion first. Many libraries and APIs expect arrays, not Sets. Conversion adds brittle 'glue-code' to integrations.


## Displaying Form Validation Errors with Arrays

When building forms in React, it’s common to collect and display multiple validation errors to the user. The order of errors and their ability to be referenced by index (for accessibility or animation) make Arrays the more suitable option here : 

```jsx
import React from 'react';

const errors = [
  "Email is required.",
  "Password must be at least 8 characters.",
  "Please accept the terms and conditions."
];

function ErrorList() {
  return (
    <ul className="error-list">
      {errors.map((error, index) => (
        <li key={index} className="error-item">
          {error}
        </li>
      ))}
    </ul>
  );
}

export default ErrorList;
```
### Why use Arrays here?

* The order of errors matters for user experience.

* Arrays allow easy mapping and indexing for React keys.

* Sets would lose duplicate errors and don’t guarantee order, which could confuse users.

* Arrays are ideal for rendering ordered UI lists, such as form validation errors, notifications, or steps in a process, where order and duplicates may matter.

## The Closing Tag

Sets are a valuable tool when you need to guarantee uniqueness or need fast lookups of very large lists. But the array remains the reigning champion of ordering, indexing, and manual manipulation. Reach for the right tool and you can produce code that’s both efficient and easy to work with.

---

### Related Links

- [MDN Web Docs: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN Web Docs: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JavaScript.info: Map and Set](https://javascript.info/map-set)
- [ES6 In Depth: Collections](https://hacks.mozilla.org/2015/06/es6-in-depth-collections/)
