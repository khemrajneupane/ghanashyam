"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const FAMILY = [
  { name: "Lalita", relation: "आमा", emoji: "👩" },
  { name: "Januka", relation: "परिवार", emoji: "👧" },
  { name: "Buba", relation: "बुबा", emoji: "👴" },
  { name: "Thulobhai", relation: "दाजु", emoji: "👨" },
  { name: "Kanchha", relation: "कान्छा", emoji: "👦" },
  { name: "Didi", relation: "दिदी", emoji: "👩" },
];

const FEATURES = [
  { icon: "📸", title: "फोटो एल्बम", desc: "परिवारका सबै फोटो र भिडियोहरू एकै ठाउँमा सुरक्षित" },
  { icon: "✍️", title: "संस्मरण", desc: "घनश्याम न्यौपानेका जीवनका कथाहरू र विचारहरू" },
  { icon: "🎮", title: "खेल्नुहोस्", desc: "परिवारसँग मिलेर रमाइलो प्रश्न-उत्तर खेल" },
  { icon: "🤖", title: "AI सहायक", desc: "जुनसुकै कुरा सोध्न सकिने डिजिटल सहायक" },
];

export default function About() {
  return (
    <div style={{ background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)", paddingBottom: "60px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #2C1810 0%, #B5192A 60%, #C45E1A 100%)", padding: "clamp(40px,8vw,80px) 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 30% 70%, #D4A017 0%, transparent 50%)" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: "relative" }}>
          <div style={{ fontSize: "clamp(56px,10vw,88px)", marginBottom: "16px", display: "block" }}>👴</div>
          <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "12px" }}>घनश्याम न्यौपाने</h1>
          <p style={{ color: "#E2C9B0", fontSize: "clamp(15px,2.5vw,18px)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            ७० वर्षीय जिज्ञासु, लेखक, र हाम्रो परिवारको स्तम्भ। प्रविधिप्रतिको उहाँको उत्साह अनुकरणीय छ।
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
        {/* Story card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "white", borderRadius: "24px", padding: "32px 28px", margin: "28px 0", border: "1px solid #E2C9B0", boxShadow: "0 4px 20px rgba(44,24,16,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "32px" }}>💛</span>
            <h2 style={{ fontWeight: 700, color: "#2C1810" }}>यो प्लेटफर्मको कथा</h2>
          </div>
          <p style={{ color: "#5C3D2E", fontSize: "17px", lineHeight: 1.85, marginBottom: "16px" }}>
            हाम्रा बुबा घनश्यामजीले ७० वर्षको उमेरमा पनि प्रविधिप्रति जुन जिज्ञासा र उत्साह देखाउनुहुन्छ, त्यो साँच्चै प्रशंसनीय छ। उहाँ आफ्नो आत्मकथा लेख्नुहुन्छ, इन्टरनेट चलाउनुहुन्छ, र परिवारका फोटोहरू व्यवस्थित गर्न रुचाउनुहुन्छ।
          </p>
          <p style={{ color: "#5C3D2E", fontSize: "17px", lineHeight: 1.85 }}>
            तर उहाँसँग एउटा आफ्नै डिजिटल स्थान थिएन — जहाँ उहाँ आफ्ना लेखहरू राख्न, पारिवारिक फोटोहरू साझा गर्न, र आफ्नो जीवनको डिजिटल विरासत बनाउन सक्नुहुन्थ्यो। यो वेबसाइट उहाँलाई उपहारको रूपमा — मायाको प्रतीकको रूपमा — बनाइएको हो।
          </p>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={{ fontWeight: 700, fontSize: "22px", color: "#2C1810", textAlign: "center", marginBottom: "20px" }}>✨ के-के गर्न सकिन्छ?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                style={{ background: "white", borderRadius: "20px", padding: "24px 20px", textAlign: "center", border: "1px solid #E2C9B0", boxShadow: "0 2px 12px rgba(44,24,16,0.06)" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "17px", color: "#2C1810", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "#8B6553", fontSize: "15px", lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Family members */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: "linear-gradient(135deg, #FBF4DC, #FDF0E6)", borderRadius: "24px", padding: "28px", border: "1px solid #E2C9B0", marginBottom: "28px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "20px", color: "#2C1810", textAlign: "center", marginBottom: "20px" }}>👨‍👩‍👧‍👦 हाम्रो परिवार</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {FAMILY.map((m, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "14px 20px", textAlign: "center", border: "1px solid #E2C9B0", minWidth: "110px" }}>
                <div style={{ fontSize: "32px", marginBottom: "6px" }}>{m.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: "16px", color: "#2C1810" }}>{m.name}</div>
                <div style={{ fontSize: "13px", color: "#B5192A", fontWeight: 500 }}>{m.relation}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "linear-gradient(135deg, #B5192A, #8B0000)", color: "white",
            borderRadius: "50px", padding: "16px 32px", fontWeight: 700, fontSize: "18px",
            boxShadow: "0 4px 16px rgba(181,25,42,0.4)",
          }}>
            🏡 घर पृष्ठमा जानुहोस्
          </Link>
        </div>
      </div>
    </div>
  );
}
