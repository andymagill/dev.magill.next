---
title: Make Your Website Talk with The JavaScript Web Speech API
description: Give your readers the ability to listen to your content, powered by the JavaScript Web Speech API. Help make your site more accessible and ready for the future of AI-driven web experiences.
image: /images/blog/talking-phone.jpg
tags: JavaScript, API, a11y, UI
created: 1751579020
lastUpdated: 
---

If you have never heard your website speak, you are in for a real treat! I've spend enough time building and writing for my own site that I have decided to make it easy for people to listen too. Enter the Web Speech API, the best browser feature that most users never asked for. 

## Why bother with a "listen" button?

I added this feature to [my blog](https://magill.dev) for a couple reasons. First, I selfishly wanted to experiment and learn about the Web Speech API. Secondly, accessibility: not everyone reads the same way, and some folks rely on screen readers or just prefer listening. 

## The code

Here's a reusable function that only runs when the API is supported

```javascript
function setupSpeechButton(contentSelector, buttonSelector) {
  // Get associated elements
  const button = document.getElementById(buttonSelector);
  const content = document.getElementById(contentSelector);

  // Escape this function if Web Speech API is not supported, or associated elements are missing 
  if (!window.speechSynthesis || !button || !content) return;

  // Get the voice from document language
  function getPreferredVoice() {
    const htmlLang = document.documentElement.lang || 'en';
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang.startsWith(htmlLang)) || voices[0];
  }

  function speakContent() {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(content.innerText);
    
    // get the document language
    const htmlLang = document.documentElement.lang || 'en-US';
    utterance.lang = htmlLang;
    utterance.rate = 1;
    utterance.pitch = 1;

    // Select the voice to use
    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;

    // toggle the button
    utterance.onstart = () => {
      button.disabled = true;
      button.textContent = 'Stop';
    };
    utterance.onend = () => {
      button.disabled = false;
      button.textContent = 'Listen';
    };
    utterance.onend = () => button.disabled = false;

    // Speak the content
    window.speechSynthesis.speak(utterance);
  }

  // For browsers that load voices asynchronously
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      button.addEventListener('click', speakContent);
    };
  } else {
    button.addEventListener('click', speakContent);
  }
}

setupSpeechButton('blog-content', 'listen-btn');
```

_ABRACADABRA!_ If the user's browser supports speech synthesis, a "listen" button is rendered. If not, nothing happens. To see the latest version of the React implementation that I used on my site, checkout this [React component](https://github.com/andymagill/dev.magill.next/blob/master/app/components/blog/ListenButton.tsx). 

## Closing tag

Adding a "listen" button with the Web Speech API is a simple way to make my blog more inclusive and engaging. It helps make my content more flexible for everyone, not just the visually impaired.

Since Chatbots invaded the internet over the past year, voice synthesis and transcription is about to become much more common-place. The Web Speech API is a small piece of the web, but it's a foundational one that will lead to better user experiences, and not just for AI-enhanced web apps.

--- 

## Related Links

- [Web Speech API - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
Comprehensive documentation and browser support information
- [SpeechSynthesis Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
Detailed API reference for the speech synthesis functionality
- [Accessible Rich Internet Applications (ARIA)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
Best practices for accessible web applications
