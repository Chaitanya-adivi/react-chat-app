# Conversant

A modern, ChatGPT-like online chat application built with React. Conversant provides a clean, intuitive interface for managing multiple conversations with persistent storage, message timestamps, and date grouping.

## Project Overview

Conversant is a single-page web application that mimics the user experience of ChatGPT, featuring a two-column layout with a sidebar for conversation management and a main chat window for messaging. The application is built with React and follows modern best practices for component architecture, state management, and user experience design.

The application demonstrates clean separation of concerns with a modular structure that separates UI components, business logic (custom hooks), and service layers. All conversations are persisted to `localStorage`, ensuring that users can continue their chats across browser sessions.

## Features

### Core Functionality
- **Multiple Conversations**: Create and manage multiple chat conversations simultaneously
- **Message Persistence**: All conversations are automatically saved to `localStorage` and restored on page reload
- **Message Timestamps**: Every message includes a timestamp displayed in a user-friendly format (hh:mm AM/PM)
- **Date Grouping**: Messages are automatically grouped by date with visual dividers showing "Today", "Yesterday", or specific dates
- **Auto-scrolling**: Chat window automatically scrolls to the latest message
- **Loading States**: Visual indicators show when the assistant is processing a response
- **Input Validation**: Prevents sending empty or whitespace-only messages

### User Experience
- **Clean UI**: Minimal, modern design inspired by ChatGPT
- **Responsive Layout**: Two-column layout that works across different screen sizes
- **Keyboard Shortcuts**: 
  - `Enter` to send messages
  - `Shift + Enter` for new lines
- **Conversation Management**:
  - Create new conversations with a single click
  - Clear individual conversations while preserving the conversation thread
  - Automatic conversation naming ("First conversation", "Second conversation", etc.)
- **Empty State Handling**: Prevents duplicate empty conversations
- **Smooth Animations**: Subtle fade-in animations for new messages

### Technical Features
- **State Persistence**: Versioned `localStorage` storage with automatic migration support
- **Conversation Isolation**: Messages are stored separately per conversation
- **Error Handling**: Graceful error handling for API calls and storage operations
- **Backward Compatibility**: Handles messages without timestamps gracefully

## Tech Stack

### Frontend
- **React 19.2.0**: Modern React with hooks and functional components
- **Vite 7.2.4**: Fast build tool and development server
- **CSS3**: Custom styling with Flexbox for layout

### Development Tools
- **ESLint**: Code linting and quality checks
- **React Hooks ESLint Plugin**: Enforces React hooks rules

### Browser APIs
- **localStorage**: Client-side data persistence
- **Modern JavaScript**: ES6+ features (arrow functions, destructuring, async/await)

## Project Structure

```
conversant/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Image assets
│   ├── components/        # React UI components
│   │   ├── Sidebar.jsx           # Conversation list sidebar
│   │   ├── ChatWindow.jsx        # Main chat container
│   │   ├── MessageList.jsx       # Message rendering with date grouping
│   │   └── MessageInput.jsx      # Message input with auto-resize
│   ├── hooks/             # Custom React hooks
│   │   └── useChat.js            # Core chat state and logic
│   ├── services/          # API and service layer
│   │   └── chatService.js        # Simulated API service
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

### Architecture Overview

- **Components** (`src/components/`): Presentational React components that receive props and handle UI rendering
- **Hooks** (`src/hooks/`): Custom hooks that encapsulate business logic and state management
- **Services** (`src/services/`): Abstraction layer for API calls and external services
- **Styles** (`src/App.css`, `src/index.css`): Global and component-specific styling

## Installation

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager

### Setup Steps

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd conversant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Usage

### Starting a Conversation

1. Click the **"New Chat"** button in the sidebar
2. Type your message in the input field at the bottom
3. Press `Enter` to send (or `Shift + Enter` for a new line)
4. Wait for the assistant response

### Managing Conversations

- **Create New Conversation**: Click "New Chat" in the sidebar
- **Switch Conversations**: Click on any conversation in the sidebar
- **Clear Messages**: Click "Clear Chat" in the chat header to clear messages while keeping the conversation
- **Automatic Naming**: Conversations are automatically named ("First conversation", "Second conversation", etc.) when you send the first message

### Message Features

- **Timestamps**: Each message displays its timestamp below the message bubble
- **Date Dividers**: Messages are grouped by date with visual dividers
- **Auto-scroll**: The chat automatically scrolls to show the latest message
- **Input States**: The input field is disabled while waiting for assistant responses

### Data Persistence

- All conversations are automatically saved to browser `localStorage`
- Data persists across browser sessions and page reloads
- To clear all data, clear your browser's localStorage (via DevTools)

## Notes

### Development Notes

- **Mock API**: The current implementation uses a simulated API (`chatService.js`) with artificial delays. To integrate with a real API, modify `src/services/chatService.js`
- **State Management**: The application uses React hooks for state management, with `useChat` as the primary hook for chat-related state
- **Persistence Versioning**: The `localStorage` storage includes versioning to handle future data structure changes gracefully

### Design Decisions

- **Component Architecture**: Separation of concerns with presentational components (Sidebar, MessageList) and container components (ChatWindow, App)
- **Custom Hooks**: Business logic is encapsulated in `useChat` to keep components focused on rendering
- **Service Layer**: API calls are abstracted in `chatService.js` for easy replacement with real endpoints
- **No External State Management**: The application uses React's built-in state management to keep dependencies minimal

### Browser Compatibility

- Modern browsers that support ES6+ features
- `localStorage` API support required for persistence
- Tested on Chrome, Firefox, Edge, and Safari

### Technical Improvements
- **TypeScript Migration**: Add type safety with TypeScript
- **Unit Tests**: Comprehensive test coverage with Jest and React Testing Library
- **E2E Tests**: End-to-end testing with Cypress or Playwright
- **Performance Optimization**: Implement virtualization for long message lists
- **Accessibility**: Enhanced ARIA labels and keyboard navigation
- **PWA Support**: Progressive Web App features for offline usage
- **Internationalization**: Multi-language support

## Author

Built as a demonstration project showcasing modern React development practices and clean architecture patterns.

## License

This project is open source and available for educational and personal use. 

---

**Note**: This is a frontend-only application. For production use, you would need to implement a backend API for actual chat functionality, user authentication, and data persistence.
#   r e a c t - c h a t - a p p  
 