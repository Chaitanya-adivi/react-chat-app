import { useState, useCallback, useEffect } from "react";
import { getAssistantReply } from "../services/chatService";

/**
 * useChat
 *
 * Manages messages for multiple conversations, tracking loading state and exposing
 * a simple API to the UI (messages, isLoading, sendMessage).
 *
 * @param {string|null} activeConversationId - ID of the conversation currently displayed.
 */
export const useChat = (activeConversationId) => {
  const STORAGE_KEY = "chat-app:conversations";
  const STORAGE_VERSION = 1;

  const [conversations, setConversations] = useState([
    { id: "c1", title: "First conversation" },
    { id: "c2", title: "Second conversation" },
  ]);

  const [conversationsById, setConversationsById] = useState({
    c1: [],
    c2: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * Persistence: hydrate from localStorage on initial load.
   *
   * - Runs once when the hook is first used in the app.
   * - If we find previously saved data with a matching version, we use that
   *   instead of the seeded default conversations.
   * - If parsing fails, nothing is stored, or the version mismatches, we
   *   quietly fall back to the in-memory defaults above.
   */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      console.log("[useChat] hydrate: effect run on mount. Raw value:", raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log("[useChat] hydrate: parsed payload:", parsed);
        if (parsed.version === STORAGE_VERSION) {
          if (parsed?.conversations && parsed?.conversationsById) {
            console.log(
              "[useChat] hydrate: applying stored conversations to state."
            );
            setConversations(parsed.conversations);
            setConversationsById(parsed.conversationsById);
          }
        } else {
          console.log(
            "[useChat] hydrate: version mismatch, ignoring stored data. Stored version:",
            parsed.version,
            "Expected:",
            STORAGE_VERSION
          );
        }
      }
    } catch (e) {
      console.error("Failed to restore conversations from localStorage", e);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      console.log(
        "[useChat] persist: skipped because hydration has not completed yet."
      );
      return;
    }

    try {
      console.log(
        "[useChat] persist: effect run. Current conversations:",
        conversations,
        "conversationsById:",
        conversationsById
      );
      const payload = JSON.stringify({
        version: STORAGE_VERSION,
        conversations,
        conversationsById,
      });
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch (e) {
      console.error("Failed to save conversations to localStorage", e);
    }
  }, [conversations, conversationsById, isHydrated]);

  const createConversation = useCallback(() => {
    const activeMessages =
      (activeConversationId && conversationsById[activeConversationId]) || [];

    if (activeConversationId && activeMessages.length === 0) {
      return activeConversationId;
    }

    const existingEmptyConversation = conversations.find((conv) => {
      const convMessages = conversationsById[conv.id] || [];
      return convMessages.length === 0;
    });

    if (existingEmptyConversation) {
      return existingEmptyConversation.id;
    }

    const newId = `c-${Date.now()}`;
    const newConversation = {
      id: newId,
      title: "New conversation",
    };

    setConversations((prev) => [...prev, newConversation]);

    setConversationsById((prev) => ({
      ...prev,
      [newId]: [],
    }));

    return newId;
  }, [activeConversationId, conversationsById, conversations]);

  const sendMessage = useCallback(
    async (userText) => {
      if (!userText || !userText.trim() || !activeConversationId) return;

      setError(null);
      setIsLoading(true);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userText.trim(),
        timestamp: new Date().toISOString(),
      };

      const previousMessagesForConversation =
        conversationsById[activeConversationId] ?? [];
      const isFirstMessage = previousMessagesForConversation.length === 0;

      let conversationCount = 0;
      if (isFirstMessage) {
        conversations.forEach((conv) => {
          if (conv.id !== activeConversationId) {
            const convMessages = conversationsById[conv.id] || [];
            if (convMessages.length > 0 || conv.title !== "New conversation") {
              conversationCount++;
            }
          }
        });
      }

      let updatedMessagesForConversation;
      setConversationsById((prev) => {
        const currentMessages = prev[activeConversationId] ?? [];

        updatedMessagesForConversation = [...currentMessages, userMessage];

        return {
          ...prev,
          [activeConversationId]: updatedMessagesForConversation,
        };
      });

      if (isFirstMessage) {
        setConversations((prevConversations) => {
          const currentConversation = prevConversations.find(
            (c) => c.id === activeConversationId
          );

          if (
            !currentConversation ||
            currentConversation.title !== "New conversation"
          ) {
            return prevConversations;
          }

          const ordinals = [
            "First",
            "Second",
            "Third",
            "Fourth",
            "Fifth",
            "Sixth",
            "Seventh",
            "Eighth",
            "Ninth",
            "Tenth",
          ];
          const ordinal =
            ordinals[conversationCount] || `${conversationCount + 1}th`;
          const newTitle = `${ordinal} conversation`;

          // Update the conversation title in the conversations array.
          // Since conversations is in the persistence effect's dependency array,
          // this will automatically save to localStorage.
          return prevConversations.map((conv) =>
            conv.id === activeConversationId
              ? { ...conv, title: newTitle }
              : conv
          );
        });
      }

      try {
        const assistantMessage = await getAssistantReply({
          messages: updatedMessagesForConversation,
          userText: userMessage.content,
        });

        const assistantMessageWithTimestamp = {
          ...assistantMessage,
          timestamp: new Date().toISOString(),
        };
        
        setConversationsById((prev) => {
          const existing = prev[activeConversationId] ?? [];
          return {
            ...prev,
            [activeConversationId]: [...existing, assistantMessageWithTimestamp],
          };
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversationId]
  );

  const clearConversation = useCallback(
    (conversationId) => {
      if (!conversationId) return;

      setConversationsById((prev) => ({
        ...prev,
        [conversationId]: [],
      }));
    },
    []
  );

  const messagesForActiveConversation =
    (activeConversationId && conversationsById[activeConversationId]) || [];

  return {
    conversations,
    messages: messagesForActiveConversation,
    isLoading,
    error,
    sendMessage,
    createConversation,
    clearConversation,
  };
};


