/**
 * getAssistantReply
 *
 * @param {Object} params
 * @param {Array}  params.messages - The full conversation so far (including user and assistant).
 * @param {string} params.userText - The latest user message that triggered this call.
 *
 * @returns {Promise<Object>} A promise that resolves to an assistant message object,
 *                            e.g. { id, role: "assistant", content }.
 */
export const getAssistantReply = async ({ messages, userText }) => {
  return new Promise((resolve) => {
    const minDelay = 500;
    const maxDelay = 800;
    const delay = Math.floor(
      minDelay + Math.random() * (maxDelay - minDelay)
    );

    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: [
          "Here's a mock ChatGPT-style response based on your last message:",
          "",
          `> ${userText}`,
          "",
          "In a real app, this text would come from an AI model running on a server.",
        ].join("\n"),
      };

      resolve(assistantMessage);
    }, delay);
  });
};


