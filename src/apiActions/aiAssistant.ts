import { API_SERVER_V1 } from "../config/keys";
import { CallApiNew } from "../utils/callApiNew";
const chatApiUrl = `${API_SERVER_V1}/chat`;
// const apiUrl = "http://localhost:8080";
// const chatApiUrl = `${apiUrl}/api/chat`;

export const aiAssistantApi = {
  startThread: async (projectId?: string) => {
    const url = new URL(`${chatApiUrl}/threads`);
    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      HEADERS: {
        "content-type": "application/json",
      },
      BODY: { thread_id: projectId },
    });
  },
  sendPrompt: async (thread_id: string | undefined, prompt: string) => {
    const url = new URL(chatApiUrl);
    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      HEADERS: {
        "content-type": "application/json",
      },
      BODY: {
        thread_id,
        prompt,
      },
    });
  },
};
