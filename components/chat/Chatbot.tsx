"use client";

import {
  CalendarDays,
  ChevronDown,
  Loader2,
  Send,
  Stethoscope,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ChatButton from "./Chatbutton";
import ChatMessage, {
  type ChatMessageType,
} from "./ChatMessage";

const suggestedQuestions = [
  "How can I book an appointment?",
  "What conditions do you treat?",
  "Where is the clinic located?",
  "What should I bring to my consultation?",
];

const initialMessage: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm the Mehta Care Clinic assistant. I can help with clinic information, treatments, appointments, and general questions about visiting the clinic.",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] =
    useState<ChatMessageType[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [messages, isOpen]);

  async function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();

    if (!text || isLoading) return;

    setInput("");

    const userMessage: ChatMessageType = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          pageContext: {
            pathname: window.location.pathname,
            title: document.title,
          },
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Chat API error:", data);

        throw new Error(
          data?.error ||
            `Chat API returned ${response.status}`
        );
      }

      const assistantMessage: ChatMessageType = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          data?.message ||
          "Sorry, I couldn't generate a response right now.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            "I'm sorry, I couldn't connect right now. Please try again or contact the clinic directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            z-[9997]
            bg-black/30
            md:hidden
          "
        />
      )}

      {/* Chat window */}
      {isOpen && (
        <section
          aria-label="Clinic chat assistant"
          className="
            fixed
            z-[9998]

            bottom-0
            left-0
            right-0

            h-[min(680px,100dvh)]
            w-full

            overflow-hidden
            rounded-t-2xl
            border
            border-slate-200
            bg-[#f8fafc]
            shadow-[0_-10px_40px_rgba(15,23,42,0.18)]

            sm:bottom-24
            sm:left-auto
            sm:right-6
            sm:h-[min(680px,calc(100dvh-120px))]
            sm:w-[390px]
            sm:rounded-2xl
          "
        >
          {/* Header */}
          <header
            className="
              flex
              h-[72px]
              shrink-0
              items-center
              justify-between
              bg-[#123B63]
              px-4
              text-white
              sm:px-5
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                "
              >
                <Stethoscope className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Mehta Care Clinic
                </p>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-blue-100">
                    Clinic Assistant
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                text-white
                transition
                hover:bg-white/10
              "
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </header>

          {/* Messages */}
          <div
            className="
              flex
              min-h-0
              flex-1
              flex-col
              overflow-y-auto
              bg-[#f8fafc]
              px-3
              py-4
              sm:px-4
            "
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
            </div>

            {/* Suggested questions */}
            {messages.length === 1 && (
              <div className="mt-4">
                <p className="mb-2 px-1 text-xs font-medium text-slate-500">
                  You can ask:
                </p>

                <div className="space-y-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        text-slate-700
                        shadow-sm
                        transition
                        hover:border-[#123B63]/30
                        hover:bg-blue-50
                      "
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Appointment CTA */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2.5">
            <a
              href="/appointment"
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#123B63]
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#0d2f50]
              "
            >
              <CalendarDays className="h-4 w-4" />
              Book an Appointment
            </a>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="
              flex
              shrink-0
              items-center
              gap-2
              border-t
              border-slate-200
              bg-white
              p-3
            "
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              disabled={isLoading}
              placeholder="Type your question..."
              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3
                py-2.5
                text-sm
                text-slate-900
                outline-none
                placeholder:text-slate-400
                focus:border-[#123B63]
                focus:ring-2
                focus:ring-[#123B63]/10
              "
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#123B63]
                text-white
                transition
                hover:bg-[#0d2f50]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="shrink-0 bg-white px-3 pb-2 text-center text-[10px] leading-4 text-slate-400">
            This assistant provides general clinic information and
            is not a substitute for medical advice.
          </p>
        </section>
      )}

      {/* Floating button */}
      <ChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      />
    </>
  );
}