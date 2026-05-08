import { chatEmitter } from "@/lib/chat-bus";

export const dynamic = 'force-dynamic';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const onMessage = (message) => {
        // Send message data to client
        controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
      };

      chatEmitter.on("newMessage", onMessage);

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(": heartbeat\n\n");
        } catch (e) {
          clearInterval(heartbeat);
          chatEmitter.off("newMessage", onMessage);
        }
      }, 15000);

      // Listen for manual stream cancellation
      this.cancel = () => {
        chatEmitter.off("newMessage", onMessage);
        clearInterval(heartbeat);
      };
    },
    cancel() {
      // Handled above, but standard compliant
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
