"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FiTrash2, FiCamera, FiMusic, FiMaximize2, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface MediaItem { _id: string; url: string; public_id: string; username?: string; }

const PER_PAGE = 4;

export default function Gallery() {
  const [images, setImages]       = useState<MediaItem[]>([]);
  const [videos, setVideos]       = useState<MediaItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<"photos" | "audio">("photos");
  const [page, setPage]           = useState(1);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { data } = useSession();

  useEffect(() => {
    fetch("/api/images")
      .then(r => r.json())
      .then(d => {
        setImages(d.images?.filter((i: MediaItem) => i.url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) || []);
        setVideos(d.images?.filter((i: MediaItem) => i.url.match(/\.(mp4|mov|avi|mkv|mp3|m4a|ogg|wav)$/i)) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deleteItem = async (id: string, isImage: boolean) => {
    if (!confirm("के यो मेटाउनुहुन्छ?")) return;
    const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (isImage) {
        setImages(p => {
          const next = p.filter(i => i._id !== id);
          // Adjust page if current page becomes empty after deletion
          const totalPages = Math.ceil(next.length / PER_PAGE);
          if (page > totalPages && totalPages > 0) setPage(totalPages);
          return next;
        });
      } else {
        setVideos(p => p.filter(i => i._id !== id));
      }
      setLightboxIdx(null);
      toast.success("सफलतापूर्वक मेटियो");
    } else {
      toast.error("मेटाउन असफल");
    }
  };

  // Lightbox nav — always based on the FULL images array
  const prevLight = useCallback(() =>
    setLightboxIdx(i => i === null ? null : (i - 1 + images.length) % images.length), [images.length]);
  const nextLight = useCallback(() =>
    setLightboxIdx(i => i === null ? null : (i + 1) % images.length), [images.length]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prevLight();
      if (e.key === "ArrowRight") nextLight();
      if (e.key === "Escape")     setLightboxIdx(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, prevLight, nextLight]);

  // Pagination
  const totalPages  = Math.ceil(images.length / PER_PAGE);
  const pageImages  = images.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
      <div className="spinner" />
      <p style={{ color: "#8B6553", fontSize: "18px" }}>फोटोहरू लोड हुँदैछ...</p>
    </div>
  );

  return (
    <>
      {/* ── hover styles via real CSS, not inline mutation ───────────── */}
      <style>{`
        .gallery-thumb { transition: transform 0.25s ease; }
        .gallery-thumb:hover { transform: scale(1.03); }
        .gallery-thumb:hover .overlay { opacity: 1 !important; }
        .page-btn { transition: background 0.15s, color 0.15s; }
        .page-btn:hover:not(:disabled) { background: #FDF0E6 !important; }
        .page-btn.active-page { background: linear-gradient(135deg,#B5192A,#8B0000) !important; color: #fff !important; border-color: transparent !important; }
        .tab-btn { transition: all 0.2s; }
        .nav-link-hero { transition: background 0.15s, border-color 0.15s; }
        .nav-link-hero:hover { background: rgba(255,255,255,0.25) !important; }
      `}</style>

      <div style={{ padding: "0 0 60px" }}>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #B5192A 0%, #8B0000 50%, #2C1810 100%)",
          padding: "clamp(32px,6vw,64px) 20px",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.05,
            backgroundImage: "radial-gradient(circle at 20% 50%, #D4A017 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8762B 0%, transparent 40%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: "clamp(40px,8vw,72px)", marginBottom: "12px" }}>🏡</div>
            <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "8px" }}>न्यौपाने परिवारको एल्बम</h1>
            <p style={{ color: "#E2C9B0", fontSize: "clamp(15px,2.5vw,18px)", maxWidth: "500px", margin: "0 auto 24px" }}>
              हाम्रा सम्झनाहरू, हाम्रा पलहरू — सदा सुरक्षित
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/image-upload" className="nav-link-hero" style={{
                background: "linear-gradient(135deg, #E8762B, #C45E1A)", color: "white",
                borderRadius: "50px", padding: "14px 28px", fontWeight: 700, fontSize: "17px",
                display: "flex", alignItems: "center", gap: "8px",
                boxShadow: "0 4px 16px rgba(232,118,43,0.45)",
              }}>📷 फोटो थप्नुहोस्</Link>
              <Link href="/all-contents" className="nav-link-hero" style={{
                background: "rgba(255,255,255,0.15)", color: "white",
                border: "1.5px solid rgba(255,255,255,0.4)",
                borderRadius: "50px", padding: "14px 28px", fontWeight: 600, fontSize: "17px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>✍️ संस्मरण पढ्नुहोस्</Link>
            </div>
          </div>
        </div>

        {/* ── Stats bar ──────────────────────────────────────────────── */}
        <div style={{ background: "white", borderBottom: "1px solid #E2C9B0", display: "flex", justifyContent: "center" }}>
          {[
            { icon: "🖼️", count: images.length, label: "फोटोहरू" },
            { icon: "🎵", count: videos.length, label: "अडियोहरू" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, maxWidth: "180px", padding: "16px 12px", textAlign: "center", borderRight: i < 1 ? "1px solid #E2C9B0" : "none" }}>
              <div style={{ fontSize: "24px" }}>{s.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#B5192A" }}>{s.count}</div>
              <div style={{ fontSize: "14px", color: "#8B6553" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 20px 0", gap: "12px" }}>
          {([
            { key: "photos" as const, icon: <FiCamera size={20} />, label: "फोटोहरू" },
            { key: "audio"  as const, icon: <FiMusic  size={20} />, label: "अडियोहरू" },
          ] as const).map(t => (
            <button key={t.key} className={`tab-btn${tab === t.key ? " active-tab" : ""}`}
              onClick={() => { setTab(t.key); setPage(1); }}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "12px 24px", borderRadius: "50px", fontSize: "17px", fontWeight: 600, cursor: "pointer",
                border: tab === t.key ? "none" : "2px solid #E2C9B0",
                background: tab === t.key ? "linear-gradient(135deg, #B5192A, #8B0000)" : "white",
                color: tab === t.key ? "white" : "#5C3D2E",
                boxShadow: tab === t.key ? "0 4px 12px rgba(181,25,42,0.35)" : "none",
                minHeight: "52px",
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Content ────────────────────────────────────────────────── */}
        <div style={{ padding: "24px 16px 0", maxWidth: "1100px", margin: "0 auto" }}>
          {tab === "photos" ? (
            images.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Image src="/images/firstimage.jpg" alt="परिवार" width={400} height={300}
                  style={{ borderRadius: "24px", boxShadow: "0 8px 32px rgba(44,24,16,0.15)", maxWidth: "100%", margin: "0 auto 24px", display: "block" }} />
                <p style={{ color: "#8B6553", fontSize: "18px" }}>अझै कुनै फोटो छैन। पहिलो फोटो थप्नुहोस्!</p>
                <Link href="/image-upload" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "20px",
                  background: "linear-gradient(135deg, #E8762B, #C45E1A)", color: "white",
                  borderRadius: "50px", padding: "14px 28px", fontWeight: 700, fontSize: "17px",
                }}>📷 पहिलो फोटो थप्नुहोस्</Link>
              </div>
            ) : (
              <>
                {/* Photo grid — 2 columns, 4 images per page */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "28px" }}>
                  {pageImages.map((img) => {
                    // globalIdx for lightbox is its position in the full images array
                    const globalIdx = images.findIndex(i => i._id === img._id);
                    return (
                      <div key={img._id} className="gallery-thumb"
                        onClick={() => setLightboxIdx(globalIdx)}
                        style={{ position: "relative", borderRadius: "18px", overflow: "hidden", cursor: "pointer", background: "#F5ECD7", aspectRatio: "1 / 1", boxShadow: "0 4px 16px rgba(44,24,16,0.12)" }}>
                        <Image
                          src={img.url}
                          alt="Family"
                          loading="lazy"
                          unoptimized
                          width={500}
                          height={500}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {/* overlay — opacity controlled by CSS .gallery-thumb:hover .overlay */}
                        <div className="overlay" style={{
                          position: "absolute", inset: 0, opacity: 0,
                          background: "linear-gradient(to top, rgba(44,24,16,0.75) 0%, transparent 55%)",
                          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                          padding: "12px", transition: "opacity 0.2s",
                        }}>
                          <span style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>
                            👤 {img.username || "परिवार"}
                          </span>
                          <FiMaximize2 color="white" size={18} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Pagination ─────────────────────────────────────── */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {/* Prev */}
                    <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "12px 20px", borderRadius: "50px", border: "2px solid #E2C9B0",
                        background: "white", color: "#5C3D2E", cursor: page === 1 ? "not-allowed" : "pointer",
                        opacity: page === 1 ? 0.4 : 1, fontSize: "16px", fontWeight: 600, minHeight: "50px",
                      }}>
                      <FiChevronLeft size={18} /> अघिल्लो
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} className={`page-btn${page === n ? " active-page" : ""}`}
                        onClick={() => setPage(n)}
                        style={{
                          width: "50px", height: "50px", borderRadius: "50%",
                          border: "2px solid #E2C9B0", background: "white",
                          color: "#5C3D2E", cursor: "pointer", fontSize: "17px", fontWeight: 700,
                        }}>
                        {n}
                      </button>
                    ))}

                    {/* Next */}
                    <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "12px 20px", borderRadius: "50px", border: "2px solid #E2C9B0",
                        background: "white", color: "#5C3D2E", cursor: page === totalPages ? "not-allowed" : "pointer",
                        opacity: page === totalPages ? 0.4 : 1, fontSize: "16px", fontWeight: 600, minHeight: "50px",
                      }}>
                      अर्को <FiChevronRight size={18} />
                    </button>
                  </div>
                )}

                {/* Page info */}
                <p style={{ textAlign: "center", color: "#8B6553", fontSize: "15px", marginBottom: "8px" }}>
                  पृष्ठ {page} / {totalPages} &nbsp;·&nbsp; जम्मा {images.length} फोटो
                </p>
              </>
            )
          ) : (
            /* ── Audio tab ─────────────────────────────────────────── */
            videos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎵</div>
                <p style={{ color: "#8B6553", fontSize: "18px" }}>अझै कुनै अडियो फाइल छैन।</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {videos.map((v, i) => (
                  <div key={v._id} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #E2C9B0", boxShadow: "0 2px 8px rgba(44,24,16,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "24px" }}>🎵</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "17px" }}>अडियो {i + 1}</div>
                          {v.username && <div style={{ fontSize: "14px", color: "#8B6553" }}>👤 {v.username}</div>}
                        </div>
                      </div>
                      {data?.user && (
                        <button onClick={() => deleteItem(v._id, false)}
                          style={{ background: "#FEF2F2", border: "none", borderRadius: "10px", padding: "8px 14px", color: "#B5192A", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FiTrash2 size={16} /> मेटाउनुहोस्
                        </button>
                      )}
                    </div>
                    <audio controls style={{ width: "100%", height: "48px" }}>
                      <source src={v.url} />
                    </audio>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* ── Lightbox ───────────────────────────────────────────────── */}
        {lightboxIdx !== null && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setLightboxIdx(null)}>
            {/* Close */}
            <button onClick={e => { e.stopPropagation(); setLightboxIdx(null); }}
              style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "52px", height: "52px", color: "white", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <FiX size={24} />
            </button>

            {/* Prev / Next */}
            {images.length > 1 && <>
              <button onClick={e => { e.stopPropagation(); prevLight(); }}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "56px", height: "56px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <FiChevronLeft size={28} />
              </button>
              <button onClick={e => { e.stopPropagation(); nextLight(); }}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "56px", height: "56px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <FiChevronRight size={28} />
              </button>
            </>}

            {/* Image */}
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: "92vw", maxHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <Image
                src={images[lightboxIdx].url}
                alt="Family photo"
                unoptimized
                width={900}
                height={600}
                sizes="90vw"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "78vh",
                  objectFit: "contain",
                  borderRadius: "14px",
                  display: "block",
                }}
              />
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                <span>👤 {images[lightboxIdx].username || "परिवार"}</span>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{lightboxIdx + 1} / {images.length}</span>
                {data?.user && (
                  <button onClick={() => deleteItem(images[lightboxIdx]._id, true)}
                    style={{ background: "rgba(181,25,42,0.85)", border: "none", borderRadius: "10px", padding: "8px 16px", color: "white", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FiTrash2 size={15} /> मेटाउनुहोस्
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
