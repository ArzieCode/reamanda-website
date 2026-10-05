// ============================================================
// Panel — Customer Service Scripted Assistant
// Quick-reply chips, message history, WhatsApp handoff
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { WHATSAPP_NUMBER } from '../../services/katering';

export default function ChatPanel() {
  const { messages, isOpen, toggleChat, sendMessage, quickReplies } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div
      className="fixed bottom-20 right-4 sm:right-6 z-[60] w-[calc(100vw-32px)] sm:w-[380px] bg-bg border border-line shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4"
      style={{ height: 'min(540px, 80vh)' }}
      role="dialog"
      aria-label="Layanan Pelanggan RiaMiranda"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-cormorant text-sm">
            RM
          </div>
          <div>
            <p className="nav-label text-charcoal" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
              LAYANAN KONSULTAN
            </p>
            <p className="text-[11px] text-available font-light flex items-center gap-1.5" style={{ fontFamily: 'Jost, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-available inline-block animate-pulse" />
              Online & Siap Membantu
            </p>
          </div>
        </div>
        <button
          onClick={() => toggleChat(false)}
          className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
          aria-label="Tutup obrolan"
        >
          <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-bg">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 text-xs font-light leading-relaxed ${
                  isUser
                    ? 'bg-charcoal text-white rounded-t-lg rounded-bl-lg'
                    : 'bg-surface text-ink border border-line rounded-t-lg rounded-br-lg'
                }`}
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                {m.text}

                {m.hasWhatsAppCta && (
                  <div className="mt-3 pt-2.5 border-t border-line">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo RiaMiranda, saya ingin konsultasi mengenai layanan Anda.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 nav-label px-3 py-2 bg-charcoal text-white rounded hover:opacity-85 transition-opacity"
                      style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                    >
                      <MessageCircle size={14} />
                      HUBUNGI VIA WHATSAPP
                    </a>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted mt-1 px-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                {m.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 border-t border-line bg-surface overflow-x-auto no-scrollbar flex gap-2">
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="nav-label px-3 py-1.5 border border-line bg-bg hover:border-charcoal text-muted hover:text-charcoal whitespace-nowrap transition-colors focus-visible:outline-none flex-shrink-0"
            style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'none' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-line flex items-center gap-2 bg-bg">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan Anda..."
          className="flex-1 bg-transparent px-3 py-2 text-xs font-light outline-none text-charcoal placeholder:text-muted"
          style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 flex items-center justify-center bg-charcoal text-white hover:opacity-85 disabled:opacity-30 transition-opacity focus-visible:outline-none"
          aria-label="Kirim pesan"
        >
          <Send size={15} strokeWidth={1.25} />
        </button>
      </form>
    </div>
  );
}
