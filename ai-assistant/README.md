# Total Crypto Hub - AI Assistant

A professional, green-themed animated AI assistant for Total Crypto Hub.

## Project Files

- `assistant.html` - Assistant character and chat interface.
- `assistant.css` - Assistant design, floating styles, chat window and visual styling.
- `assistant.js` - Loads the assistant and handles interactive chat and dragging logic.
- `robot-animation.js` - Handles hovering and reactive animations.
- `README.md` - Project documentation.

## Current Features

- Floating assistant mascot.
- Smooth hovering and reactive animations.
- Interactive chat window with customized TCN ecosystem knowledge.
- Suggested questions covering DePIN, Airdrops, Wallets, and Hub features.
- Fully draggable assistant mascot across the screen.
- Responsive design for both desktop and mobile views.

## Important

The current chat uses curated offline responses tailored for Total Crypto Network.

A secure backend and AI API integration can be integrated later for advanced AI conversations.

Never place private API keys in frontend JavaScript or HTML files.

## Website Integration

After the assistant files are ready, the website pages load the assistant using a script tag.

The script path must be adjusted according to each page's folder location.

Example for the homepage:

```html
<script src="ai-assistant/assistant.js" defer></script>
