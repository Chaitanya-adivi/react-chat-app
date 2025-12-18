import React, { useState, useRef, useEffect } from "react";

/**
 * MessageInput component (manages only local input state).
 *
 * @param {Object} props
 * @param {boolean} [props.disabled] - If true, sending is disabled (e.g. while loading).
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {Function} props.onSend - Callback invoked with the current message text
 *                                  when the user submits the form.
 * @param {Function} [props.onClear] - Optional callback to clear the current chat.
 *                                     Kept optional so the component stays reusable.
 */
const MessageInput = ({
  disabled = false,
  placeholder = "",
  onSend = () => {},
  onClear,
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content (up to max-height defined in CSS).
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height to scrollHeight, but respect max-height from CSS
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim() || disabled) return;

    onSend(text.trim());
    setText("");
  };

  /**
   * Handles keyboard input:
   * - Enter alone: sends the message (if not empty)
   * - Shift+Enter: inserts a new line
   */
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === "Enter") {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (text.trim() && !disabled) {
        onSend(text.trim());
        setText("");
      }
    }
  };

  const handleClear = () => {
    if (typeof onClear === "function") {
      onClear();
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="message-input__field"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
      {onClear && (
        <button
          type="button"
          className="message-input__button message-input__button--secondary"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
      <button
        className="message-input__button"
        type="submit"
        disabled={disabled || !text.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;


