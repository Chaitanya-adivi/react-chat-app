import React, { useEffect, useRef } from "react";

/**
 * formatTimestamp
 * 
 * Formats a Date or timestamp string into a user-friendly time format (hh:mm AM/PM).
 * Handles backward compatibility for messages that don't have timestamps.
 * 
 * @param {Date|string|number|undefined} timestamp - The timestamp to format
 * @returns {string} Formatted time string (e.g., "2:30 PM") or empty string if invalid
 */
const formatTimestamp = (timestamp) => {
  // Handle backward compatibility: messages without timestamps won't display one
  if (!timestamp) {
    return "";
  }
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return ""; // Return empty string for invalid dates
  }
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12; // Convert 0 to 12, keep 1-11 as-is
  const displayMinutes = minutes.toString().padStart(2, "0");
  
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * getDateString
 * 
 * Converts a timestamp to a normalized date string (YYYY-MM-DD) for comparison.
 * This allows us to group messages by date regardless of time.
 * 
 * @param {Date|string|number|undefined} timestamp - The timestamp to convert
 * @returns {string} Date string in YYYY-MM-DD format, or empty string if invalid
 */
const getDateString = (timestamp) => {
  if (!timestamp) {
    return "";
  }
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }
  
  // Normalize to YYYY-MM-DD format using local timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
};

/**
 * formatDateDivider
 * 
 * Formats a date string (YYYY-MM-DD) into a user-friendly label:
 * - "Today" for the current date
 * - "Yesterday" for the previous date
 * - "Mon DD, YYYY" format for other dates (e.g., "Dec 14, 2025")
 * 
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date label for the divider
 */
const formatDateDivider = (dateString) => {
  if (!dateString) {
    return "";
  }
  
  const [year, month, day] = dateString.split("-").map(Number);
  const messageDate = new Date(year, month - 1, day);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Normalize dates to midnight for comparison (ignore time component)
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };
  
  const normalizedMessageDate = normalizeDate(messageDate);
  const normalizedToday = normalizeDate(today);
  const normalizedYesterday = normalizeDate(yesterday);
  
  // Check if message date is today
  if (normalizedMessageDate.getTime() === normalizedToday.getTime()) {
    return "Today";
  }
  
  // Check if message date is yesterday
  if (normalizedMessageDate.getTime() === normalizedYesterday.getTime()) {
    return "Yesterday";
  }
  
  // For other dates, format as "Mon DD, YYYY" (e.g., "Jan 18, 2025")
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const monthName = monthNames[month - 1];
  return `${monthName} ${day}, ${year}`;
};

/**
 * MessageList component (purely presentational).
 *
 * @param {Object} props
 * @param {Array}  props.messages - Array of message objects, e.g. { id, role, content }.
 *                                  "role" could be "user" or "assistant".
 * @param {boolean} props.isLoading - Indicates if the assistant is currently "thinking".
 */
const MessageList = ({ messages = [], isLoading = false }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (!endOfMessagesRef.current) return;

    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const showEmptyState = messages.length === 0 && !isLoading;

  /**
   * Group messages by date and insert date dividers.
   * 
   * This function processes the messages array and returns an array of items
   * that can be rendered. Each item is either:
   * - A message object (with type: 'message')
   * - A date divider object (with type: 'divider', dateString, and label)
   * 
   * Date dividers are inserted whenever the date changes between consecutive messages.
   * Messages without timestamps are grouped together (no divider shown).
   */
  const groupMessagesByDate = () => {
    const items = [];
    let previousDateString = null;

    messages.forEach((message, index) => {
      // Get the date string for this message (empty if no timestamp)
      const currentDateString = message.timestamp
        ? getDateString(message.timestamp)
        : null;

      // Insert a date divider if:
      // 1. This message has a timestamp (we can determine its date)
      // 2. The date differs from the previous message's date
      // 3. This is either the first message or the previous message had a different date
      if (
        currentDateString &&
        currentDateString !== previousDateString
      ) {
        // Only show divider if we have a valid date string
        const dividerLabel = formatDateDivider(currentDateString);
        if (dividerLabel) {
          items.push({
            type: "divider",
            dateString: currentDateString,
            label: dividerLabel,
            key: `divider-${currentDateString}-${index}`, // Unique key for React
          });
        }
      }

      // Always add the message itself
      items.push({
        type: "message",
        message: message,
        key: message.id, // Use message id as key
      });

      // Update previous date string for next iteration
      previousDateString = currentDateString;
    });

    return items;
  };

  // Process messages to include date dividers
  const itemsToRender = groupMessagesByDate();

  return (
    <div className="message-list">
      {showEmptyState && (
        <div className="message-list__empty">
          <p className="message-list__empty-text">Start a new conversation</p>
        </div>
      )}

      {itemsToRender.map((item) => {
        if (item.type === "divider") {
          return (
            <div key={item.key} className="message-list__date-divider">
              <span className="message-list__date-divider-label">
                {item.label}
              </span>
            </div>
          );
        }

        // Render message with timestamp
        const { message } = item;
        return (
          <div
            key={item.key}
            className={`message-list__item message-list__item--${message.role}`}
          >
            <div className="message-list__bubble">
              <div className="message-list__bubble-content">{message.content}</div>
              {(() => {
                const formattedTime = message.timestamp
                  ? formatTimestamp(message.timestamp)
                  : "";
                return formattedTime ? (
                  <span className="message-list__timestamp">{formattedTime}</span>
                ) : null;
              })()}
            </div>
          </div>
        );
      })}

      {/* Optional "typing" or loading indicator placeholder */}
      {isLoading && (
        <div className="message-list__item message-list__item--assistant">
          <div className="message-list__bubble message-list__bubble--typing">
            Assistant is thinking...
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;


