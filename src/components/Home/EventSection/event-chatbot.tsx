"use client";

import { FormEvent, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { sendAiChatMessageAction } from "@/src/app/(CommonLayout)/action/ai";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi, I am Planora AI. Ask me to find free events, explain event types, or suggest what to attend.",
  },
];

const EventChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = input.trim();
    if (!message || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");
    setIsSending(true);

    const aiResponse = await sendAiChatMessageAction(message);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
      },
    ]);
    setIsSending(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <section className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-lg border bg-white shadow-xl">
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Planora AI</h2>
                <p className="text-xs text-gray-500">Event assistant</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border bg-white text-gray-700"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <p className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </p>
              </div>
            )}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about events..."
              disabled={isSending}
              className="h-9"
            />
            <Button type="submit" size="icon-lg" disabled={isSending || !input.trim()} aria-label="Send message">
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </section>
      )}

      <Button
        type="button"
        size="lg"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="h-11 rounded-full px-4 shadow-lg"
        aria-label={isOpen ? "Hide AI chatbot" : "Show AI chatbot"}
      >
        <MessageCircle className="h-4 w-4" />
        AI Chat
      </Button>
    </div>
  );
};

export default EventChatbot;
