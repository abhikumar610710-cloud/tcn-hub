
# Total Crypto Hub - AI Assistant

A friendly animated AI companion for Total Crypto Hub.

## Project Files

- `assistant.html` - Assistant robot and chat interface.
- `assistant.css` - Robot design, chat window and visual styling.
- `assistant.js` - Loads the assistant and handles chat interactions.
- `robot-animation.js` - Handles robot eye movement and reactions.
- `README.md` - Project documentation.

## Current Features

- Floating robot assistant.
- Animated robot face.
- Chat window with welcome message.
- Suggested questions about crypto topics.
- Draggable robot.
- Basic offline demo responses.

## Important

The current chat uses predefined demo responses.

A secure backend and AI API integration are still required for real AI-powered conversations.

Never place private API keys in frontend JavaScript or HTML files.

## Website Integration

After the assistant files are ready, the website pages will load the assistant using a script tag.

The script path must be adjusted according to each page's folder location.

Example for the homepage:

```html
<script src="ai-assistant/assistant.js" defer></script>
```

For pages inside a one-level subfolder:

```html
<script src="../ai-assistant/assistant.js" defer></script>
```

The robot animation script will also need to be loaded after the assistant script.
