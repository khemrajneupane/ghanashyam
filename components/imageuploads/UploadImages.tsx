"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiUploadCloud, FiX, FiImage, FiMusic } from "react-icons/fi";

export default function UploadImages() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAudio = file?.type.startsWith("audio/");

  const handleFile = (selected: File) => {
    if (!selected.type.match(/^image\//) && !selected.type.match(/^audio\//)) {
      toast.error("फोटो वा अडियो फाइल मात्र छान्नुहोस्"); return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error("फाइल साइज १०MB भन्दा कम हुनुपर्छ"); return;
    }
    setFile(selected);
    if (selected.type.startsWith("image/")) setPreview(URL.createObjectURL(selected));
    else setPreview(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("पहिले फाइल छान्नुहोस्"); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/images", { method: "POST", body: formData });
    const d = await res.json();
    setUploading(false);
    if (!res.ok) { toast.error(d.error || "अपलोड असफल"); return; }
    toast.success("सफलतापूर्वक अपलोड भयो! 🎉");
    setTimeout(() => router.push("/"), 1500);
  };

  const clear = () => { setFile(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  return (
    <div style={{ minHeight: "80vh", background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)", padding: "0 0 60px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #2D6A4F, #1B4332)", borderRadius: "0 0 32px 32px", padding: "clamp(32px,6vw,56px) 24px", textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>📸</div>
        <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "8px" }}>फोटो / अडियो अपलोड</h1>
        <p style={{ color: "#B7DEC9", fontSize: "16px", maxWidth: "400px", margin: "0 auto" }}>
          परिवारका सम्झनाहरू सुरक्षित राख्नुहोस्
        </p>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 16px" }}>
        {/* Tips card */}
        <div style={{ background: "white", borderRadius: "20px", padding: "20px 24px", border: "1px solid #E2C9B0", marginBottom: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "28px", flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "17px", color: "#2C1810", marginBottom: "6px" }}>सुझाव</p>
            <ul style={{ paddingLeft: "20px", color: "#5C3D2E", fontSize: "16px", lineHeight: 1.8 }}>
              <li>JPEG, PNG, WebP फोटो समर्थित छन्</li>
              <li>MP3, M4A, OGG अडियो समर्थित छन्</li>
              <li>अधिकतम साइज: १०MB</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            style={{
              border: `3px dashed ${dragOver ? "#2D6A4F" : file ? "#2D6A4F" : "#E2C9B0"}`,
              borderRadius: "24px", padding: "32px 20px",
              background: dragOver ? "#E8F5EE" : file ? "#F0FFF5" : "white",
              cursor: file ? "default" : "pointer", textAlign: "center",
              transition: "all 0.2s", marginBottom: "20px",
              minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {!file ? (
              <div>
                <FiUploadCloud size={56} color="#8B6553" style={{ marginBottom: "16px" }} />
                <p style={{ fontSize: "18px", fontWeight: 600, color: "#2C1810", marginBottom: "8px" }}>
                  यहाँ तान्नुहोस् र छोड्नुहोस्
                </p>
                <p style={{ fontSize: "16px", color: "#8B6553", marginBottom: "16px" }}>वा क्लिक गरी फाइल छान्नुहोस्</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    { icon: <FiImage size={16}/>, label: "फोटो" },
                    { icon: <FiMusic size={16}/>, label: "अडियो" },
                  ].map(b => (
                    <span key={b.label} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F5ECD7", color: "#5C3D2E", borderRadius: "50px", padding: "6px 14px", fontSize: "15px", fontWeight: 500 }}>
                      {b.icon} {b.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ width: "100%", position: "relative" }}>
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    unoptimized
                    width={640}
                    height={360}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    style={{
                      maxHeight: "280px",
                      maxWidth: "100%",
                      borderRadius: "16px",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                ) : (
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <FiMusic size={52} color="#2D6A4F" />
                    <p style={{ fontSize: "17px", fontWeight: 600, color: "#2D6A4F" }}>{file.name}</p>
                    <p style={{ fontSize: "15px", color: "#8B6553" }}>अडियो फाइल चयन भयो</p>
                  </div>
                )}
                <button type="button" onClick={e => { e.stopPropagation(); clear(); }} style={{
                  position: "absolute", top: "-8px", right: "-8px",
                  background: "#B5192A", border: "none", borderRadius: "50%",
                  width: "36px", height: "36px", color: "white", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(181,25,42,0.4)",
                }}>
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>

          <input type="file" accept="image/*,audio/*" ref={fileInputRef}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            style={{ display: "none" }} />

          {/* File info */}
          {file && (
            <div style={{ background: "white", borderRadius: "16px", padding: "16px 20px", border: "1px solid #E2C9B0", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "28px" }}>{isAudio ? "🎵" : "🖼️"}</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{ fontWeight: 600, fontSize: "16px", color: "#2C1810", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                <p style={{ fontSize: "14px", color: "#8B6553" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <span style={{ background: "#E8F5EE", color: "#2D6A4F", borderRadius: "50px", padding: "4px 12px", fontSize: "13px", fontWeight: 600 }}>
                ✓ तैयार
              </span>
            </div>
          )}

          <button type="submit" disabled={uploading || !file} style={{
            width: "100%", minHeight: "60px",
            background: uploading || !file ? "#ccc" : "linear-gradient(135deg, #2D6A4F, #1B4332)",
            border: "none", borderRadius: "20px", padding: "16px",
            fontSize: "19px", fontWeight: 700, color: "white",
            cursor: uploading || !file ? "not-allowed" : "pointer",
            boxShadow: uploading || !file ? "none" : "0 4px 16px rgba(45,106,79,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            transition: "all 0.2s",
          }}>
            {uploading ? (
              <><span className="spinner" style={{ width: "24px", height: "24px", borderWidth: "3px" }} />अपलोड हुँदैछ...</>
            ) : (
              <><FiUploadCloud size={22} />अपलोड गर्नुहोस्</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
