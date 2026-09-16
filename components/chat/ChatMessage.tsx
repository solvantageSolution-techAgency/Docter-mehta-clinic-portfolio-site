"use client";

import { Bot, User } from "lucide-react";
import Chatbot from "./Chatbot";

export type ChatMessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessageProps = {
  message: ChatMessageType;
};

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[88%] items-end gap-2 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              isUser
                ? "bg-[#123B63] text-white"
                : "bg-white text-[#123B63] shadow-sm"
            }
          `}
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        <div
          className={`
            rounded-2xl
            px-3
            py-2.5
            text-sm
            leading-5
            break-words
            ${
              isUser
                ? "rounded-br-md bg-[#123B63] text-white"
                : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
            }
          `}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}