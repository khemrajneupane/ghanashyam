"use client";
import Link from "next/link";
import { ADToBS } from "bikram-sambat-js";

const LINKS = [
  { href: "/", label: "🏡 फोटो एल्बम" },
  { href: "/all-contents", label: "📖 संस्मरण" },
  { href: "/about", label: "ℹ️ बारेमा" },
  { href: "/quiz", label: "🎮 खेल्नुहोस्" },
];

export default function Footer() {
  const year = ADToBS(new Date().getFullYear().toString());

  return (
    <footer style={{
      background: "linear-gradient(135deg, #2C1810 0%, #1A0D08 100%)",
      color: "#E2C9B0",
      borderTop: "4px solid transparent",
      borderImage: "linear-gradient(90deg, #D4A017, #E8762B, #B5192A, #E8762B, #D4A017) 1",
      paddingTop: "40px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
        {/* Top section */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", marginBottom: "32px" }}>
          {/* Brand */}
          <div style={{ minWidth: "220px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "32px" }}>🏡</span>
              <div>
                <div style={{ color: "#FBF4DC", fontWeight: 700, fontSize: "20px" }}>हाम्रो परिवार</div>
                <div style={{ color: "#E8762B", fontSize: "13px" }}>न्यौपाने परिवार</div>
              </div>
            </div>
            <p style={{ color: "#8B6553", fontSize: "15px", lineHeight: 1.7, maxWidth: "260px" }}>
              घनश्याम न्यौपानेको डिजिटल स्मृति संग्रह — परिवारका लागि, परिवारद्वारा।
            </p>
          </div>

          {/* Quick links */}
          <div style={{ minWidth: "160px" }}>
            <h4 style={{ color: "#D4A017", fontWeight: 700, fontSize: "16px", marginBottom: "14px", letterSpacing: "0.05em" }}>
              पृष्ठहरू
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {LINKS.map(l => (
                <Link key={l.href} href={l.href} style={{ color: "#B0917A", fontSize: "16px", transition: "color 0.15s", display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#FBF4DC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#B0917A")}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div style={{ minWidth: "200px", flex: 1, maxWidth: "280px" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(212,160,23,0.2)" }}>
              <div style={{ color: "#D4A017", fontSize: "28px", marginBottom: "8px", lineHeight: 1 }}>&ldquo;</div>
              <p style={{ color: "#C4A882", fontSize: "15px", lineHeight: 1.7, fontStyle: "italic" }}>
                परिवार भनेको जीवनको सबैभन्दा ठूलो सम्पत्ति हो।
              </p>
              <div style={{ color: "#D4A017", fontSize: "28px", textAlign: "right", lineHeight: 1 }}>&rdquo;</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", paddingBottom: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <p style={{ color: "#6B5040", fontSize: "15px" }}>
            © {year} घनश्याम न्यौपाने · सर्वाधिकार सुरक्षित
          </p>
          <p style={{ color: "#6B5040", fontSize: "14px" }}>
            ❤️ प्रेम र सम्मानसहित तपाईंको छोराले बनाएको
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
            background: "rgba(232,118,43,0.15)", border: "1px solid rgba(232,118,43,0.3)",
            borderRadius: "50px", padding: "8px 20px", color: "#E8762B",
            cursor: "pointer", fontSize: "15px", fontWeight: 600,
            display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,118,43,0.25)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(232,118,43,0.15)")}>
            ↑ माथि जानुहोस्
          </button>
        </div>
      </div>
    </footer>
  );
}
