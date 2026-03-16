"use client";
import Link from "next/link";
import { useState, useRef, useEffect, memo } from "react";
import { signOut, useSession } from "next-auth/react";
import { ADToBS } from "bikram-sambat-js";
import Image from "next/image";
import DigitalWatch from "../digital-watch/DigitalWatch";

interface Member { name: string; image: string; }
interface FetchedUser { name: string; image?: string; }

const NAV_LINKS = [
  { href: "/about",          label: "बारेमा",       icon: "📖" },
  { href: "/all-contents",   label: "संस्मरण",      icon: "✍️" },
  { href: "/content-upload", label: "कथा अपलोड",    icon: "📝" },
  { href: "/image-upload",   label: "फोटो अपलोड",   icon: "🖼️" },
  { href: "/",               label: "फोटो एल्बम",   icon: "📸" },
  { href: "/quiz",           label: "खेल्नुहोस्",   icon: "🎮" },
];

const FALLBACK_MEMBERS: Member[] = [
  "Lalita","Januka","Didi","Thulobhai","Kanchha","Buba",
  "Thulo bhanja","Sano bhanja","Biansha","Gatte","Buka",
  "Ashwini bhanja","Kiyana","Gantte","Sudhir","Peshal",
].map(name => ({ name, image: "/images/user-heart-fill.png" }));

function matchName(a: string, b: string) {
  const c1 = a.toLowerCase().replace(/\s+/g, "");
  const c2 = b.toLowerCase().replace(/\s+/g, "");
  for (let i = 0; i <= c1.length - 4; i++) {
    if (c2.includes(c1.substring(i, i + 4))) return true;
  }
  return false;
}

// Separated so session changes don't force a full header remount
const AuthSection = memo(function AuthSection() {
  const { data } = useSession();
  return data?.user ? (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Image src={data.user.image || "/images/user-heart-fill.png"} alt="प्रयोगकर्ता"
        width={42} height={42}
        style={{ borderRadius: "50%", border: "2px solid #E8762B", objectFit: "cover", flexShrink: 0 }} />
      <button onClick={() => signOut()} className="hdr-btn">
        लगआउट
      </button>
    </div>
  ) : (
    <Link href="/login" className="hdr-login">
      🔑 लगइन
    </Link>
  );
});

export default function Header() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [members,     setMembers]     = useState<Member[]>([]);
  const menuRef    = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  const nepaliDate = ADToBS(new Date());

  useEffect(() => {
    fetch("/api/auth/getallusers")
      .then(r => r.json())
      .then(d => {
        const fetched: FetchedUser[] = d.users || [];
        const merged = FALLBACK_MEMBERS.map(fb => {
          const m = fetched.find(u => matchName(u.name, fb.name));
          return m ? { name: m.name, image: m.image || fb.image } : fb;
        });
        setMembers(merged);
      })
      .catch(() => setMembers(FALLBACK_MEMBERS));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current    && !menuRef.current.contains(e.target as Node))    setMenuOpen(false);
      if (membersRef.current && !membersRef.current.contains(e.target as Node)) setMembersOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        .hdr-btn {
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 12px; padding: 10px 16px; color: white; cursor: pointer;
          font-size: 15px; font-weight: 600; min-height: 48px; font-family: Mukta, sans-serif;
          transition: background 0.15s;
        }
        .hdr-btn:hover { background: rgba(255,255,255,0.22); }
        .hdr-login {
          background: linear-gradient(135deg,#E8762B,#C45E1A); border-radius: 12px;
          padding: 12px 20px; color: white; font-weight: 700; font-size: 17px;
          display: flex; align-items: center; gap: 6px; min-height: 48px;
          box-shadow: 0 4px 12px rgba(232,118,43,0.4); transition: opacity 0.15s;
        }
        .hdr-login:hover { opacity: 0.9; }
        .hdr-icon-btn {
          background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 12px; padding: 10px 14px; color: white; cursor: pointer;
          display: flex; align-items: center; gap: 6px; font-size: 17px; font-weight: 600;
          min-height: 48px; font-family: Mukta, sans-serif; transition: background 0.15s;
        }
        .hdr-icon-btn:hover, .hdr-icon-btn.open { background: rgba(255,255,255,0.22); }
        .nav-item {
          display: flex; align-items: center; gap: 12px; padding: 14px 16px;
          border-radius: 12px; margin: 2px 0; color: #2C1810; font-weight: 500;
          font-size: 17px; transition: background 0.15s; cursor: pointer;
        }
        .nav-item:hover { background: #FDF0E6; }
        .member-row {
          display: flex; align-items: center; gap: 12px; padding: 10px 8px;
          border-radius: 10px; transition: background 0.15s;
        }
        .member-row:hover { background: #FDF0E6; }
        .dropdown-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: white; border-radius: 20px;
          box-shadow: 0 8px 40px rgba(44,24,16,0.22); border: 1px solid #E2C9B0; z-index: 300;
        }
      `}</style>

      <header style={{
        background: "linear-gradient(135deg, #B5192A 0%, #8B0000 40%, #2C1810 100%)",
        borderBottom: "4px solid transparent",
        borderImage: "linear-gradient(90deg, #D4A017, #E8762B, #D4A017) 1",
        position: "sticky", top: 0, zIndex: 200,
        boxShadow: "0 4px 20px rgba(44,24,16,0.4)",
      }}>
        {/* Date + time strip */}
        <div style={{ background: "rgba(0,0,0,0.22)", padding: "4px 20px", display: "flex", justifyContent: "center", gap: "20px", alignItems: "center" }}>
          <span style={{ color: "#FBF4DC", fontSize: "14px", fontWeight: 500 }}>🗓️ {nepaliDate}</span>
          <span style={{ color: "#E2C9B0", fontSize: "14px" }}>🕐 <DigitalWatch /></span>
        </div>

        {/* Main row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", gap: "12px" }}>
          {/* Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <span style={{ fontSize: "28px" }}>🏡</span>
            <div>
              <div style={{ color: "#FBF4DC", fontWeight: 700, fontSize: "20px", lineHeight: 1.1 }}>हाम्रो परिवार</div>
              <div style={{ color: "#E8762B", fontSize: "12px" }}>न्यौपाने परिवार</div>
            </div>
          </Link>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Nav menu */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button className={`hdr-icon-btn${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(p => !p)} aria-label="मेनु">
                <span style={{ fontSize: "20px" }}>{menuOpen ? "✕" : "☰"}</span>
                <span>मेनु</span>
              </button>
              {menuOpen && (
                <div className="dropdown-panel" style={{ minWidth: "200px", padding: "12px" }}>
                  {NAV_LINKS.map(l => (
                    <Link key={l.href} href={l.href} className="nav-item" onClick={() => setMenuOpen(false)}>
                      <span style={{ fontSize: "22px" }}>{l.icon}</span>{l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Family members */}
            <div ref={membersRef} style={{ position: "relative" }}>
              <button className={`hdr-icon-btn${membersOpen ? " open" : ""}`} onClick={() => setMembersOpen(p => !p)} aria-label="परिवार सदस्यहरू">
                <span style={{ fontSize: "22px" }}>👨‍👩‍👧‍👦</span>
              </button>
              {membersOpen && (
                <div className="dropdown-panel" style={{ width: "240px", maxHeight: "380px", overflowY: "auto", padding: "16px" }}>
                  <h3 style={{ textAlign: "center", color: "#B5192A", fontWeight: 700, fontSize: "17px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #E2C9B0" }}>
                    परिवार सदस्य
                  </h3>
                  {(members.length ? members : FALLBACK_MEMBERS).map((m, i) => (
                    <div key={i} className="member-row">
                      <Image
                        src={m.image}
                        alt={m.name}
                        width={36}
                        height={36}
                        unoptimized
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #E2C9B0",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "16px", fontWeight: 500 }}>{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auth — isolated component so session re-renders don't touch header state */}
            <AuthSection />
          </div>
        </div>
      </header>
    </>
  );
}
