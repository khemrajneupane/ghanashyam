"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Msg { role: "user" | "bot"; text: string; }

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: "नमस्ते! 🙏 म तपाईंको सहायक हुँ। कुनै कुरा सोध्नुहोस्।" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { data } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(p => [...p, { role: "user", text }]);
    setInput("");

    if (!data?.user?.email) {
      setMessages(p => [...p, { role: "bot", text: "कृपया पहिले लगइन गर्नुहोस्।" }]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://chatbot-flask-gr15.onrender.com/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const d = await res.json();
      setMessages(p => [...p, { role: "bot", text: d.response || "माफ गर्नुहोस्, जवाफ आएन।" }]);
    } catch {
      setMessages(p => [...p, { role: "bot", text: "सम्पर्क असफल। पछि पुनः प्रयास गर्नुहोस्।" }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="च्याट खोल्नुहोस्" style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 500,
          width: "64px", height: "64px", borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #B5192A, #8B0000)",
          color: "white", cursor: "pointer", fontSize: "28px",
          boxShadow: "0 6px 24px rgba(181,25,42,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
          💬
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "24px", right: "16px", zIndex: 500,
          width: "min(380px, calc(100vw - 32px))",
          borderRadius: "24px", overflow: "hidden",
          boxShadow: "0 12px 48px rgba(44,24,16,0.3)",
          display: "flex", flexDirection: "column",
          border: "1px solid #E2C9B0",
        }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #B5192A, #8B0000)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>🤖</span>
              <div>
                <div style={{ color: "#FBF4DC", fontWeight: 700, fontSize: "16px" }}>सहायक</div>
                <div style={{ color: "#E8762B", fontSize: "12px" }}>
                  {data?.user ? "● अनलाइन" : "○ लगइन आवश्यक"}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "36px", height: "36px", color: "white", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ background: "#FDF6EE", height: "320px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "8px", alignItems: "flex-end" }}>
                {m.role === "bot" && <span style={{ fontSize: "22px", flexShrink: 0 }}>🤖</span>}
                <div style={{
                  maxWidth: "78%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.role === "user" ? "linear-gradient(135deg, #B5192A, #8B0000)" : "white",
                  color: m.role === "user" ? "white" : "#2C1810",
                  fontSize: "16px", lineHeight: 1.6,
                  boxShadow: "0 2px 8px rgba(44,24,16,0.08)",
                  border: m.role === "bot" ? "1px solid #E2C9B0" : "none",
                }}>
                  {m.text}
                </div>
                {m.role === "user" && <span style={{ fontSize: "22px", flexShrink: 0 }}>👤</span>}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "22px" }}>🤖</span>
                <div style={{ background: "white", border: "1px solid #E2C9B0", borderRadius: "18px", padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: "8px", height: "8px", background: "#B5192A", borderRadius: "50%", display: "inline-block", animation: `bounce 1s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ background: "white", padding: "14px", borderTop: "1px solid #E2C9B0", display: "flex", gap: "10px" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="यहाँ लेख्नुहोस्..." style={{
                flex: 1, border: "2px solid #E2C9B0", borderRadius: "14px", padding: "12px 16px",
                fontSize: "16px", fontFamily: "Mukta, sans-serif", outline: "none", color: "#2C1810", background: "#FDF6EE",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#B5192A")}
              onBlur={e => (e.currentTarget.style.borderColor = "#E2C9B0")}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: loading || !input.trim() ? "#ccc" : "linear-gradient(135deg, #B5192A, #8B0000)",
              border: "none", borderRadius: "14px", padding: "12px 16px",
              color: "white", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "20px",
              display: "flex", alignItems: "center", justifyContent: "center", minWidth: "52px",
            }}>
              ➤
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </>
  );
}
