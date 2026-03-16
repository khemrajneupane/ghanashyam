"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("पासवर्ड कम्तीमा ६ अक्षर हुनुपर्छ"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) toast.error(d.message || "दर्ता असफल");
    else { toast.success("दर्ता सफल! अब लगइन गर्नुहोस् 🎉"); router.push("/login"); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)" }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4332)", borderRadius: "24px 24px 0 0", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>🌱</div>
          <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "6px" }}>नयाँ खाता बनाउनुहोस्</h1>
          <p style={{ color: "#B7DEC9", fontSize: "16px" }}>परिवारको डिजिटल संसारमा सामेल हुनुहोस्</p>
        </div>
        <div style={{ background: "white", borderRadius: "0 0 24px 24px", padding: "32px 24px", boxShadow: "0 8px 32px rgba(44,24,16,0.15)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "👤 पूरा नाम", type: "text", val: name, set: setName, ph: "तपाईंको नाम" },
              { label: "📧 इमेल ठेगाना", type: "email", val: email, set: setEmail, ph: "तपाईंको इमेल" },
              { label: "🔒 पासवर्ड", type: "password", val: password, set: setPassword, ph: "कम्तीमा ६ अक्षर" },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: "block", fontWeight: 600, fontSize: "17px", color: "#2C1810", marginBottom: "8px" }}>{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required placeholder={f.ph} className="input-field" />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{
              background: loading ? "#ccc" : "linear-gradient(135deg, #2D6A4F, #1B4332)",
              color: "white", border: "none", borderRadius: "16px", padding: "16px",
              fontSize: "19px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(45,106,79,0.4)", minHeight: "56px",
            }}>
              {loading ? "दर्ता हुँदैछ..." : "✅ दर्ता गर्नुहोस्"}
            </button>
            <p style={{ textAlign: "center", color: "#8B6553", fontSize: "16px" }}>
              खाता छ?{" "}
              <Link href="/login" style={{ color: "#B5192A", fontWeight: 700 }}>लगइन गर्नुहोस्</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
