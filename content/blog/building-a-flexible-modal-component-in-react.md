---
title: Building a Flexible Modal Component in React
description: Learn how to create a flexible, accessible modal dialog component in React that can be used across your application.
image: /images/blog/modal-example.jpg
tags: React, Components, Accessibility, a11y
created: 1746201655
lastUpdated: 1768574180
---

Modal popups are a very common UI pattern that adds a lot of utility to modern web apps. Unfortunately for developers like us, that means we need to master all the technical complexities associated with them. What seems like a simple popup window actually involves a lot of intricate details: accessibility, responsive design, keyboard navigation, scroll management, and more.

For my current project, I needed something that could be reused throughout the application rather than reinventing the wheel each time. In this post, I'll walk through how we can create a flexible, reusable modal component that can render content, forms, or whatever else I need to show, on any device.

## What exactly do we need here?

A modal is best used to focus the user's attention on specific elements without navigating users away from the current page. The solution should be versatile enough to handle various use cases: terms and conditions, newsletter signups, contact forms, or notification alerts.

My wishlist looks something like this:

- **Accessibility**: The modal must be accessible and usable for keyboard and screen reader users
- **Scroll Management**: It should prevent scrolling of the underlying page, but allow scrolling within the modal when necessary
- **Flexibility**: The design must be simple enough to easily use anywhere, and adapt to different contexts and content types

## The Dialog Element, the Modern Standard

<img alt="Modal Component Example" width="480" src="/images/blog/modal-example.jpg#right" >

Since 2024, the HTML `<dialog>` element has achieved excellent cross-browser support and now handles focus management, keyboard navigation, and accessibility out of the box. **This is the recommended approach for most use cases.** The native dialog provides:

- Built-in backdrop and `::backdrop` pseudo-element for styling
- Automatic focus trapping and restoration
- `Escape` key handling by default
- Better performance and less JavaScript overhead
- Reduced complexity and bundle size

Here's a clean React wrapper around the native `<dialog>` element:

```tsx
import { useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	return (
		<dialog ref={dialogRef} className='modal' onClose={onClose}>
			<div className='modalHeader'>
				{title && <h2>{title}</h2>}
				<button
					className='closeButton'
					onClick={onClose}
					aria-label='Close modal'
				>
					×
				</button>
			</div>

			<div className='modalBody'>{children}</div>
		</dialog>
	);
};
```

### Styling the Dialog and Backdrop

The native dialog provides a `::backdrop` pseudo-element for styling the background. Here's a complete setup:

```scss
/* Dialog container */
.modal {
	padding: 2rem;
	border: none;
	border-radius: 8px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	max-width: 90vw;
	max-height: 90vh;
}

/* Background overlay */
.modal::backdrop {
	background-color: rgba(0, 0, 0, 0.5);
}
```

### Accessibility is Built-In

The native `<dialog>` element handles most accessibility concerns automatically:

- Focus management is handled by `showModal()` and `close()`
- Pressing `Escape` closes the dialog by default
- The browser manages focus trapping
- Screen readers recognize it as a dialog

### No Portals Needed

Unlike custom implementations, the native `<dialog>` element doesn't require React portals. The browser automatically layers dialogs above other content with `z-index: auto`, which is treated specially by the browser. You can place your modal component anywhere in your component tree without worrying about stacking contexts.

### Handling Long Content

For modals with extensive content, use a scrollable content area while keeping the header sticky:

```scss
.modal {
	display: flex;
	flex-direction: column;
}

.modalHeader {
	flex-shrink: 0;
	border-bottom: 1px solid #eee;
	padding-bottom: 1rem;
	margin-bottom: 1rem;
}

.modalBody {
	overflow-y: auto;
	flex-grow: 1;
}
```

The dialog automatically constrains itself to viewport size, so content inside scrolls naturally.

## Using the Modal

Here's the component in use. Click a button to open, and the dialog handles everything else:

```tsx
function Thumbnail({ title, description, image }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsModalOpen(true)} className='thumbnail'>
				<img src={image} alt={title} />
			</button>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={title}
			>
				<div className='itemModalContent'>
					<img src={image} alt={title} />
					<p>{description}</p>
				</div>
			</Modal>
		</>
	);
}
```

### For Forms and Other Use Cases

The same component works for any content—forms, confirmations, notifications:

```tsx
function ContactSection() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsModalOpen(true)}>Get in Touch</button>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Contact Us'
			>
				<ContactForm onSubmit={() => setIsModalOpen(false)} />
			</Modal>
		</>
	);
}
```

## The Closing Tag

The true value of building flexible modal components comes when you need to add new functionality. Whether you're wrapping the native `<dialog>` element or implementing a custom solution, reusable components ensure consistency, maintain accessibility standards, and let you focus on more important things.

Whether you're showing off your best cat photos, collecting emails nobody wants to give you, or displaying legal text no one wants to read, a well-built modal makes life better for everyone involved - especially future you, who doesn't have to build it again.

### Related Links

- [MDN: The Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) - Native HTML dialog documentation
- [React createPortal() Documentation](https://react.dev/reference/react-dom/createPortal) - For custom implementations
- [The A11Y Project - A guide to troublesome UI components](https://www.a11yproject.com/posts/a-guide-to-troublesome-ui-components/#modals) - Accessibility best practices
