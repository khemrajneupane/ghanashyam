"use client";
import { useEffect, useState } from "react";
import { ADToBS } from "bikram-sambat-js";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import type { DefaultSession } from "next-auth";
import { FiX, FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-hot-toast";

import Link from "next/link";
import { Content } from "@/types/content";
import ContentUploadForm from "../contents/ContentEditor";

const CARD_COLORS = [
  { bg: "#FDF0E6", accent: "#E8762B", badge: "#FFF7F0" },
  { bg: "#E8F5EE", accent: "#2D6A4F", badge: "#F0FFF5" },
  { bg: "#E6F2FA", accent: "#1A6FA6", badge: "#F0F8FF" },
  { bg: "#FBF4DC", accent: "#D4A017", badge: "#FFFBEC" },
];

export default function ListAllContents() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Content | null>(null);
  const [editing, setEditing] = useState<Content | null>(null);
  const { data } = useSession();
  const sessionUser = data?.user as
    | (DefaultSession["user"] & { role?: string })
    | undefined;
  const isAdmin = sessionUser?.role === "admin";
  const modalOpen = Boolean(selected || editing);

  useEffect(() => {
    fetch("/api/contents")
      .then((r) => r.json())
      .then((d) => setContents(d?.contents?.reverse() || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (modalOpen) {
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [modalOpen]);

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`"${title || "यो कथा"}" मेटाउनुहुन्छ?`)) return;
    const res = await fetch(`/api/contents/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContents((p) => p.filter((c) => c._id !== id));
      setSelected(null);
      toast.success("मेटियो");
    } else toast.error("अनधिकृत पहुँच");
  };

  const handleUpdateSuccess = (updated: Content) => {
    setContents((p) => p.map((c) => (c._id === updated._id ? updated : c)));
    setEditing(null);
    setSelected(updated);
    toast.success("अद्यावधिक गरियो");
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "16px",
        }}
      >
        <div className="spinner" />
        <p style={{ color: "#8B6553", fontSize: "18px" }}>
          संस्मरणहरू लोड हुँदैछ...
        </p>
      </div>
    );

  return (
    <div
      style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px 60px" }}
    >
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #2C1810, #B5192A)",
          borderRadius: "0 0 32px 32px",
          padding: "clamp(32px,6vw,56px) 24px",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📖</div>
        <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "8px" }}>
          घनश्याम न्यौपानेका संस्मरण
        </h1>
        <p
          style={{
            color: "#E2C9B0",
            fontSize: "16px",
            maxWidth: "440px",
            margin: "0 auto 20px",
          }}
        >
          जीवनका अनुभव, विचार र कथाहरूको संग्रह
        </p>
        <Link
          href="/content-upload"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #E8762B, #C45E1A)",
            color: "white",
            borderRadius: "50px",
            padding: "14px 28px",
            fontWeight: 700,
            fontSize: "17px",
            boxShadow: "0 4px 16px rgba(232,118,43,0.45)",
          }}
        >
          ✍️ नयाँ कथा लेख्नुहोस्
        </Link>
      </div>

      {contents.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📝</div>
          <p style={{ color: "#8B6553", fontSize: "18px" }}>
            अझै कुनै कथा छैन। पहिलो कथा लेख्नुहोस्!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {contents.map((c, i) => {
            const col = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <motion.article
                key={c._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.5) }}
              >
                <div
                  onClick={() => setSelected(c)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 8px 24px rgba(44,24,16,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 12px rgba(44,24,16,0.07)";
                  }}
                  style={{
                    background: col.bg,
                    borderRadius: "20px",
                    padding: "24px",
                    border: `1px solid ${col.accent}30`,
                    boxShadow: "0 2px 12px rgba(44,24,16,0.07)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    willChange: "transform",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <h2
                      style={{
                        fontWeight: 700,
                        fontSize: "19px",
                        color: "#2C1810",
                        flex: 1,
                      }}
                    >
                      {c.title || "एउटा कथा"}
                    </h2>
                    <span
                      style={{
                        background: col.badge,
                        color: col.accent,
                        border: `1px solid ${col.accent}40`,
                        borderRadius: "50px",
                        padding: "4px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      📅{" "}
                      {ADToBS(
                        new Date(c.createdAt).toISOString().split("T")[0],
                      )}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#5C3D2E",
                      fontSize: "17px",
                      lineHeight: 1.7,
                      marginBottom: "14px",
                    }}
                  >
                    {c.description.split("\n")[0].substring(0, 120)}
                    {c.description.length > 120 ? "..." : ""}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: col.accent,
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      ✍️ {c.user.name}
                    </span>
                    <span
                      style={{
                        color: col.accent,
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      पूरा पढ्नुहोस् →
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Reading Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              background: "rgba(17,14,12,0.85)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              style={{
                width: "100%",
                maxWidth: "680px",
                maxHeight: "90vh",
                background: "white",
                borderRadius: "28px",
                boxShadow: "0 24px 64px rgba(44,24,16,0.3)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "16px 24px",
                  background: "linear-gradient(135deg, #2C1810, #B5192A)",
                }}
              >
                <h2
                  style={{
                    flex: 1,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#FBF4DC",
                    margin: 0,
                  }}
                >
                  {selected.title || "एउटा कथा"}
                </h2>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditing(selected)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "12px",
                          border: "1px solid rgba(255,255,255,0.5)",
                          background: "rgba(255,255,255,0.1)",
                          padding: "6px 12px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <FiEdit size={16} /> सम्पादन
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(selected._id, selected.title)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "12px",
                          background: "#93302e",
                          border: "none",
                          padding: "6px 12px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <FiTrash2 size={16} /> मेटाउनुहोस्
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      padding: "8px",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "16px",
                  borderBottom: "1px solid #E2C9B0",
                  background: "#FDF6EE",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#8B6553",
                }}
              >
                <span style={{ color: "#B5192A" }}>
                  ✍️ {selected.user.name}
                </span>
                <span style={{ color: "#8B6553" }}>
                  📅{" "}
                  {ADToBS(
                    new Date(selected.createdAt).toISOString().split("T")[0],
                  )}
                </span>
              </div>
              {/* Decorative */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  letterSpacing: "8px",
                  color: "#D4A017",
                  padding: "12px 0",
                }}
              >
                🌸 🙏 🌸
              </div>
              {/* Body */}
              <div
                style={{ flex: 1, overflowY: "auto", padding: "4px 24px 24px" }}
              >
                {selected.description
                  .split("\n\n")
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "18px",
                        lineHeight: 1.85,
                        color: "#2C1810",
                        marginBottom: "16px",
                      }}
                    >
                      {para.replace(/\n/g, " ")}
                    </p>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              padding: "0",
              background: "rgba(17,14,12,0.85)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(null)}
          >
            <motion.div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "900px",
                height: "100%",
                overflowY: "auto",
                borderRadius: "0",
                background: "white",
                boxShadow: "0 0 80px rgba(44,24,16,0.4)",
                padding: "0",
                display: "flex",
                flexDirection: "column",
              }}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Edit modal header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 32px",
                  background: "linear-gradient(135deg, #2C1810, #B5192A)",
                  flexShrink: 0,
                }}
              >
                <h2
                  style={{
                    color: "#FBF4DC",
                    fontWeight: 700,
                    fontSize: "22px",
                    margin: 0,
                  }}
                >
                  ✏️ कथा सम्पादन गर्नुहोस्
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "22px",
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
              {/* Form wrapper — override ContentUploadForm's own maxWidth */}
              <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
                <div style={{ width: "100%", maxWidth: "100%" }}>
                  <ContentUploadForm
                    contentId={editing._id}
                    initialData={{
                      title: editing.title || "",
                      description: editing.description,
                    }}
                    onSuccess={handleUpdateSuccess}
                    onClose={() => setEditing(null)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
