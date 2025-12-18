import React from "react";

/**
 * Sidebar component (presentational only).
 *
 * @param {Object} props
 * @param {Array}  props.conversations - List of conversation metadata to display
 *                                       (e.g. id, title, last message preview).
 * @param {string|null} props.activeConversationId - ID of the currently selected conversation.
 * @param {Function} props.onSelectConversation - Callback when a conversation is clicked.
 * @param {Function} props.onNewConversation - Callback when the user clicks "New Chat".
 * @param {React.ReactNode} [props.header] - Optional custom header content (e.g. user info).
 */
const Sidebar = ({
  conversations = [],
  activeConversationId = null,
  onSelectConversation = () => {},
  onNewConversation = () => {},
  header = null,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header-main">{header}</div>
        <button
          type="button"
          className="sidebar__new-chat-button"
          onClick={onNewConversation}
        >
          New Chat
        </button>
      </div>

      <ul className="sidebar__conversation-list">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;

          return (
            <li
              key={conversation.id}
              className={`sidebar__conversation-item${
                isActive ? " sidebar__conversation-item--active" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <span className="sidebar__conversation-title">
                {conversation.title || "Untitled conversation"}
              </span>
            </li>
          );
        })}

        {conversations.length === 0 && (
          <li className="sidebar__conversation-item sidebar__conversation-item--empty">
            No conversations yet. Start a new chat!
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;


