// ============================================================
// Context — Customer Service Scripted Chat
// ============================================================
import React, { createContext, useContext, useState } from 'react';
import { WHATSAPP_NUMBER } from '../services/katering';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  hasWhatsAppCta?: boolean;
}

interface ChatContextValue {
  messages: ChatMessage[];
  isOpen: boolean;
  toggleChat: (open?: boolean) => void;
  sendMessage: (text: string) => void;
  quickReplies: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Assalamu’alaikum, selamat datang di RiaMiranda. Ada yang bisa kami bantu seputar koleksi busana, lelang properti, atau layanan katering hari ini?',
    timestamp: 'Baru saja',
  },
];

const DEFAULT_QUICK_REPLIES = [
  'Koleksi Busana Terbaru',
  'Jadwal Lelang Properti',
  'Pricelist Katering',
  'Hubungi CS via WhatsApp',
];

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = (open?: boolean) => {
    setIsOpen((prev) => (open !== undefined ? open : !prev));
  };

  const getBotResponse = (userText: string): { reply: string; hasWhatsApp?: boolean } => {
    const lower = userText.toLowerCase();
    if (lower.includes('busana') || lower.includes('baju') || lower.includes('koleksi') || lower.includes('luminara') || lower.includes('terra')) {
      return {
        reply: 'Koleksi busana unggulan kami saat ini adalah Luminara 2024 dan Terra. Anda dapat menjelajahi seluruh koleksi dan memanfaatkan voucher RIAFIRST untuk gratis ongkos kirim.',
      };
    }
    if (lower.includes('properti') || lower.includes('lelang') || lower.includes('villa') || lower.includes('tanah')) {
      return {
        reply: 'Lelang properti RiaMiranda berlangsung secara transparan dan aman. Pastikan Anda telah masuk ke akun untuk mengajukan penawaran atau menjadwalkan kunjungan langsung ke lokasi.',
      };
    }
    if (lower.includes('katering') || lower.includes('menu') || lower.includes('nasi box') || lower.includes('tumpeng')) {
      return {
        reply: 'RiaMiranda Katering melayani acara pernikahan, syukuran, dan kantor dengan minimal pemesanan 50 porsi. Silakan isi formulir konsultasi di halaman Katering atau hubungi tim kami langsung.',
        hasWhatsApp: true,
      };
    }
    if (lower.includes('whatsapp') || lower.includes('kontak') || lower.includes('cs') || lower.includes('bantuan')) {
      return {
        reply: `Tim konsultan RiaMiranda siap melayani Anda secara personal melalui WhatsApp resmi di nomor +${WHATSAPP_NUMBER}.`,
        hasWhatsApp: true,
      };
    }
    return {
      reply: 'Terima kasih atas pesan Anda. Silakan jelajahi lini produk kami atau hubungi tim konsultan kami untuk panduan lebih lanjut.',
      hasWhatsApp: true,
    };
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const response = getBotResponse(trimmed);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: 'Baru saja',
        hasWhatsAppCta: response.hasWhatsApp,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        toggleChat,
        sendMessage,
        quickReplies: DEFAULT_QUICK_REPLIES,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
