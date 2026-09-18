"use client";

import { MessageCircle, X } from "lucide-react";
import Image from "next/image";
import ChatIcon from '@/public/chat-bot.svg';

type ChatButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function ChatButton({
  isOpen,
  onClick,
}: ChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className="
      
        fixed
        right-14
        bottom-14
        z-[9999]
        flex
        h-24
        w-24
        items-center
        justify-center
        rounded-full
        border
        border-white/20
        bg-[#123B63]
        text-white
        shadow-[0_10px_30px_rgba(18,59,99,0.30)]
        transition-all
        duration-200
        hover:scale-105
        hover:bg-[#0d2f50]
        focus:outline-none
        focus:ring-4
        focus:ring-[#123B63]/20
        sm:right-6
        sm:bottom-6
        sm:h-28
        sm:w-28
      "
    >
      {isOpen ? (
        <X className="h-6 w-6 sm:h-7 sm:w-7" />
      ) : (
      <Image
    src="/chat-bot.svg"
    alt=""
    width={56}
    height={56}
    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
  />
      )}

      {!isOpen && (
        <span
          className="
            absolute
            right-0
            top-0
            h-3
            w-3
            rounded-full
            border-2
            border-white
            bg-emerald-500
          "
        />
      )}
    </button>
  );
}