"use client";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) router.replace("/");
  }, [data, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) toast.error("इमेल वा पासवर्ड गलत छ");
    else { toast.success("स्वागत छ! 🙏"); router.replace("/"); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "linear-gradient(160deg, #FDF6EE 0%, #F5ECD7 100%)" }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        {/* Header card */}
        <div style={{ background: "linear-gradient(135deg, #B5192A, #8B0000)", borderRadius: "24px 24px 0 0", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>🙏</div>
          <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "6px" }}>स्वागत छ</h1>
          <p style={{ color: "#E2C9B0", fontSize: "16px" }}>हाम्रो परिवारको डिजिटल घरमा</p>
        </div>

        {/* Form card */}
        <div style={{ background: "white", borderRadius: "0 0 24px 24px", padding: "32px 24px", boxShadow: "0 8px 32px rgba(44,24,16,0.15)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "17px", color: "#2C1810", marginBottom: "8px" }}>📧 इमेल ठेगाना</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="तपाईंको इमेल" className="input-field" />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, fontSize: "17px", color: "#2C1810", marginBottom: "8px" }}>🔒 पासवर्ड</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="तपाईंको पासवर्ड" className="input-field" style={{ paddingRight: "56px" }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#8B6553" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? "#ccc" : "linear-gradient(135deg, #B5192A, #8B0000)",
              color: "white", border: "none", borderRadius: "16px", padding: "16px",
              fontSize: "19px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(181,25,42,0.4)", transition: "all 0.2s", minHeight: "56px",
            }}>
              {loading ? "लगइन हुँदैछ..." : "🔑 लगइन गर्नुहोस्"}
            </button>

            <div style={{ textAlign: "center", borderTop: "1px solid #E2C9B0", paddingTop: "20px" }}>
              <p style={{ color: "#8B6553", marginBottom: "12px", fontSize: "16px" }}>वा Google बाट लगइन गर्नुहोस्</p>
              <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} style={{
                background: "white", border: "2px solid #E2C9B0", borderRadius: "14px",
                padding: "14px 24px", cursor: "pointer", fontSize: "17px", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "10px", margin: "0 auto",
                color: "#2C1810", transition: "all 0.2s", minHeight: "52px",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F5ECD7")}
                onMouseLeave={e => (e.currentTarget.style.background = "white")}>
                <Image
                  src="https://www.google.com/favicon.ico"
                  width={20}
                  height={20}
                  alt="Google"
                  unoptimized
                />
                Google लगइन
              </button>
            </div>

            <p style={{ textAlign: "center", color: "#8B6553", fontSize: "16px" }}>
              खाता छैन?{" "}
              <Link href="/register" style={{ color: "#B5192A", fontWeight: 700 }}>यहाँ दर्ता गर्नुहोस्</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
