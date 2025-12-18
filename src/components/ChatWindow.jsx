import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

/**
 * ChatWindow component (layout/composition only).
 *
 * @param {Object} props
 * @param {Array}  props.messages - Array of message objects to display in the chat.
 * @param {boolean} props.isLoading - Indicates if a message/response is currently being generated.
 * @param {Function} props.onSendMessage - Callback to send a new user message.
 * @param {Function} [props.onClearChat] - Optional callback to clear all messages in the current conversation.
 * @param {string} [props.title] - Optional title for the chat (e.g. conversation name).
 */
const ChatWindow = ({
  messages = [],
  isLoading = false,
  onSendMessage = () => {},
  onClearChat,
  title = "New Chat",
}) => {
  const handleSend = (text) => {
    onSendMessage(text);
  };

  // Only show the Clear Chat button if:
  // 1. A callback is provided (meaning we have an active conversation)
  // 2. There are messages to clear (no point showing it for empty chats)
  const showClearButton = onClearChat && messages.length > 0;

  return (
    <section className="chat-window">
      {/* Header area with conversation title and optional Clear Chat button */}
      <header className="chat-window__header">
        <h2 className="chat-window__title">{title}</h2>
        {showClearButton && (
          <button
            className="chat-window__clear-button"
            onClick={onClearChat}
            type="button"
            aria-label="Clear chat messages"
          >
            Clear Chat
          </button>
        )}
      </header>

      <div className="chat-window__body">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <footer className="chat-window__footer">
        <div className="chat-window__composer-wrapper">
          <MessageInput
            disabled={isLoading}
            placeholder="Type your message..."
            onSend={handleSend}
          />
        </div>
      </footer>
    </section>
  );
};

export default ChatWindow;


