import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { useChat } from "./hooks/useChat";

function App() {
  const ACTIVE_ID_STORAGE_KEY = "chat-app:activeConversationId";

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const {
    conversations,
    messages,
    isLoading,
    sendMessage,
    createConversation,
    clearConversation,
  } = useChat(selectedConversationId);

  /**
   * Restore active conversation from localStorage on app initialization.
   *
   * Edge cases:
   * - If the stored id is missing or the conversations list is empty, we
   *   leave selectedConversationId as null and let the next effect below
   *   pick the first available conversation.
   * - If the stored id does not exist in the current conversations array
   *   (e.g. data was cleared or changed), we also fall back to selecting
   *   the first conversation instead of crashing.
   */
  useEffect(() => {
    try {
      const storedId = window.localStorage.getItem(ACTIVE_ID_STORAGE_KEY);
      if (!storedId) return;

      const exists = conversations.some((c) => c.id === storedId);
      if (exists) {
        setSelectedConversationId(storedId);
      }
    } catch (e) {
      // If localStorage isn't available or access fails, we fail silently
      // and rely on the default selection logic below.
      console.error("Failed to restore active conversation id", e);
    }
  }, [conversations.length]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  /**
   * Persist the active conversation id whenever it changes.
   *
   * - If the id is null (e.g. no conversations), we clear the stored value.
   * - This keeps the selection stable across page reloads while still
   *   allowing the app to recover gracefully if conversations are deleted
   *   or localStorage is cleared.
   */
  useEffect(() => {
    try {
      if (!selectedConversationId) {
        window.localStorage.removeItem(ACTIVE_ID_STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          ACTIVE_ID_STORAGE_KEY,
          selectedConversationId
        );
      }
    } catch (e) {
      console.error("Failed to persist active conversation id", e);
    }
  }, [selectedConversationId]);

  const handleNewConversation = () => {
    const newId = createConversation();
    setSelectedConversationId(newId);
  };

  return (
    <div className="app-shell">
      <div>
        <Sidebar
          conversations={conversations}
          activeConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onNewConversation={handleNewConversation}
          header={<div>My Chat App</div>}
        />
      </div>

      <div>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onClearChat={
            selectedConversationId
              ? () => clearConversation(selectedConversationId)
              : undefined
          }
          title={
            conversations.find((c) => c.id === selectedConversationId)?.title ??
            "New Chat"
          }
        />
      </div>
    </div>
  );
}

export default App;
