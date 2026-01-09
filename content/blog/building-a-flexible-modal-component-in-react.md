---
title: Building a Flexible Modal Component in React
description: Learn how to create a flexible, accessible modal dialog component in React that can be used across your application.
image: /images/blog/modal-example.jpg
tags: React, Components, Accessibility, a11y
created: 1746201655
lastUpdated: 1747238853
---

Modal popups are a very common UI pattern that adds a lot of utility to modern web apps. Unfortunately for developers like us, that means we need to master all the technical complexities associated with them. What seems like a simple popup window actually involves a lot of intricate details: accessibility, responsive design, keyboard navigation, scroll management, and more.

For my current project, I needed something that could be reused throughout the application rather than reinventing the wheel each time. In this post, I'll walk through how we can create a flexible, reusable modal component that can render content, forms, or whatever else I need to show, on any device.

## What exactly do we need here?

A modal is best used to focus the user's attention on specific elements without navigating users away from the current page. The solution should be versatile enough to handle various use cases: terms and conditions, newsletter signups, contact forms, or notification alerts.

My wishlist looks something like this:

- **Accessibility**: The modal must be accessible and usable for keyboard and screen reader users
- **Scroll Management**: It should prevent scrolling of the underlying page, but allow scrolling within the modal when necessary
- **Flexibility**: The design must be simple enough to easily use anywhere, and adapt to different contexts and content types

<img alt="Modal Component Example" width="480" src="/images/blog/modal-example.png#right" >

### Component Structure

The foundation of any component is its structure, so here are the key parts we need:

1. **Overlay**: A full-screen layer that dims the background and captures clicks outside the modal
2. **Modal Container**: The actual modal window that holds the content
3. **Content Area**: The flexible section that can contain any React nodes
4. **Close Button**: Always accessible, whether in the header or floating

### Why Not Use the Native Dialog Element?

You might be wondering why we're avoiding the HTML `<dialog>` element here. While it offers built-in modal functionality, custom implementations give us more direct control over styling, positioning, and animations. The native dialog can also behave inconsistently across browsers, particularly with focus management and keyboard navigation. By rolling our own with divs and portals, we maintain complete control over the user experience, ensuring our modal works exactly as designed in all environments.

Using a custom approach with React's functional components and hooks approach, the basic structure looks something like this:

```tsx
const Modal = ({ isOpen, onClose, title, children }) => {
	// State and refs go here, along with my hopes and dreams

	return (
		<div
			className={`modalOverlay ${isOpen ? 'open' : ''}`}
			onClick={handleOutsideClick}
			role='dialog'
			aria-modal='true'
		>
			<div className={`modalContent`}>
				<div className='modalHeader'>
					{title && <h2>{title}</h2>}
					<button
						className='closeButton'
						onClick={onClose}
						aria-label='Close modal'
					>
						<CloseIcon />
					</button>
				</div>

				<div className='modalBody'>{children}</div>
			</div>
		</div>
	);
};
```

### Locking Body Scrolling

When a modal opens, you want to prevent the underlying page from scrolling. This creates a focused experience and prevents confusion, but we also need to preserve the user's scroll position for when they close the modal. Otherwise, users will lose their place on the page.

```tsx
useEffect(() => {
	if (isOpen) {
		// Save the current scroll position before locking
		const scrollY = window.scrollY;

		// Add class to body to prevent scrolling
		document.body.classList.add('modal-open');

		// Store the scroll position as a data attribute
		document.body.style.top = `-${scrollY}px`;

		return () => {
			// Remove the class when modal closes
			document.body.classList.remove('modal-open');

			// Reset the body position
			document.body.style.top = '';

			// Restore scroll position
			window.scrollTo(0, scrollY);
		};
	}
}, [isOpen]);
```

### Accessibility Concerns

It's tempting to pretend accessibility doesn't exist, but we don't want visually impaired users to grab their pitchforks and threaten our livelihood. Instead, we can just set ARIA attributes to help screen readers understand the purpose and state of the modal:

```tsx
<div
	role='dialog'
	aria-modal='true'
	aria-labelledby={title ? 'modal-title' : undefined}
	// ...other attributes
>
	{title && <h2 id='modal-title'>{title}</h2>}
	// ...content
</div>
```

### Using React Portals

One vital technical aspect of modals is rendering them outside the normal DOM hierarchy. React's Portal mechanism allows us to mount our modal to the document body regardless of where the component is used in our React component tree:

```tsx
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, ...props }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modalContent = (
    // Modal JSX structure here
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
};
```

This pattern ensures our modal appears above all other content, avoiding issues with z-index and stacking contexts.

### Scroll Management Within the Modal

For modals with a lot of content, we want the modal content to scroll while keeping other elements in their place. We can accomplish this by making the header sticky and having the content area scroll independently:

```scss
.modalHeader {
	position: sticky;
	top: 0;
	z-index: 10;
}
.modalInfo {
	overflow-y: auto;
	max-height: calc(100% - 5rem);
}
```

This keeps your header visible while users scroll through that novel-length privacy policy. The header and close button stay put, so users can escape when they inevitably get bored.

### Resetting Modal Content

When a modal is reused with different content, we need to ensure a fresh start each time. This small enhancement allows content taller than the modal and ensures UX consistency by scrolling the modal content back to the top:

```tsx
// Create a ref to access the modal body
const modalBodyRef = useRef(null);

// Reset scroll position when modal opens with new content
useEffect(() => {
	if (isOpen && modalBodyRef.current) {
		modalBodyRef.current.scrollTop = 0;
	}
}, [isOpen, children]);

// Then in your JSX, attach the ref:
<div className='modalBody' ref={modalBodyRef}>
	{children}
</div>;
```

## Using the Modal

Here we can see the component in its natural habitat. When users click on a thumbnail, the modal provides a seamless way to display additional details:

```tsx
function Thumbnail({ title, description, image }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className='thumbnail' onClick={() => setIsModalOpen(true)}>
				<Image src={image} alt={title} />
			</div>

			{isModalOpen && (
				<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
					<div className='itemModalContent'>
						<div className='itemModalImage'>
							<Image src={image} alt={title} />
						</div>
						<div className='itemModalInfo'>
							<h2>{title}</h2>
							<p>{description}</p>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
```

### For Forms and Signups

Let's imagine we want to collect some user data without sending them to another page? Same modal, different outfit:

```tsx
function Contact() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsModalOpen(true)}>Get in Touch</button>
			{isModalOpen && (
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title='Contact Us'
				>
					<ContactForm onSubmit={() => setIsModalOpen(false)} />
				</Modal>
			)}
		</>
	);
}
```

## Wrapping Up

The true value of this approach comes when you need to add new functionality. Instead of building specialized modals for each use case, you can reuse this component with different props and content. This ensures consistency, maintains accessibility standards, and lets you focus on more important things.

Whether you're showing off your best cat photos, collecting emails nobody wants to give you, or displaying legal text no one wants to read, a well-built modal makes life better for everyone involved - especially future you, who doesn't have to build it again.

### Related Links

- [React createPortal() Documentation](https://react.dev/reference/react-dom/createPortal)
- [The A11Y Project - A guide to troublesome UI components](https://www.a11yproject.com/posts/a-guide-to-troublesome-ui-components/#modals)
