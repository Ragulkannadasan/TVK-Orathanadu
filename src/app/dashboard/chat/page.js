import { getMessages } from "@/actions/chat";
import ChatView from "./chat-view";

export const metadata = { title: "Constituency Chat – TVK Orathanadu" };

export default async function ChatPage() {
  const initialMessages = await getMessages(50);

  return (
    <div className="p-3 md:p-6 h-full flex flex-col">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white display-font mb-0.5">
          Open <span className="gradient-text">Conversation</span>
        </h1>
        <p className="text-white/40 text-[10px] md:text-sm">
          Connect with members in real-time.
        </p>
      </div>

      <ChatView initialMessages={initialMessages} />
    </div>
  );
}
