"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Content } from "@/types/content";

type ContentResponse = {
  success: boolean;
  contents?: Content;
  error?: string;
};

interface Props {
  contentId?: string;
  initialData?: { title: string; description: string };
  onSuccess?: (c: Content) => void;
  onClose?: () => void;
}

export default function ContentUploadForm({
  contentId,
  initialData,
  onSuccess,
  onClose,
}: Props) {
  const router = useRouter();
  const { data } = useSession();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [saving, setSaving] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (snippet: string) => {
    setDescription((prev) => {
      const textarea = descriptionRef.current;
      const start = textarea?.selectionStart ?? prev.length;
      const end = textarea?.selectionEnd ?? start;
      const updated = prev.slice(0, start) + snippet + prev.slice(end);
      requestAnimationFrame(() => {
        if (!textarea) return;
        const cursorPos = start + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("शीर्षक आवश्यक छ"); return; }
    if (!description.trim()) { toast.error("कथा लेख्नुहोस्"); return; }
    if (!data) { toast.error("पहिले लगइन गर्नुहोस्"); return; }
    setSaving(true);
    const res = await fetch(
      contentId ? `/api/contents/${contentId}` : "/api/contents",
      {
        method: contentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      },
    );
    const result = (await res.json()) as ContentResponse;
    setSaving(false);
    if (!res.ok || !result.success) { toast.error(result?.error || "असफल"); return; }
    toast.success(contentId ? "अद्यावधिक गरियो!" : "कथा सुरक्षित गरियो! 🎉");
    if (onSuccess) {
      const fallbackContent: Content = {
        _id: contentId || `temp-${Date.now()}`,
        title,
        description,
        user: { name: data?.user?.name || "अज्ञात", email: data?.user?.email || "" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSuccess(result.contents || fallbackContent);
    } else {
      setTitle("");
      setDescription("");
      router.push("/all-contents");
    }
    if (onClose) onClose();
  };

  const isEditMode = Boolean(contentId);

  return (
    <div style={{ width: "100%", padding: isEditMode ? "0" : "0 0 40px" }}>

      {/* Hero banner — only on standalone create page */}
      {!isEditMode && (
        <div style={{ background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)", borderRadius: "0 0 28px 28px", padding: "clamp(28px,5vw,48px) 24px", textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>✍️</div>
          <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "8px" }}>तपाईंको कथा साझा गर्नुहोस्</h1>
          <p style={{ color: "#B5D4E8", fontSize: "16px" }}>आफ्ना सम्झनाहरू परिवारसँग साझा गर्नुहोस्</p>
        </div>
      )}

      {/* Card wrapper — no chrome in edit mode */}
      <div style={isEditMode
        ? { width: "100%" }
        : { background: "white", borderRadius: "24px", padding: "28px 24px", boxShadow: "0 4px 20px rgba(44,24,16,0.1)", border: "1px solid #E2C9B0", margin: "0 16px" }
      }>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>

          {/* Title */}
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: isEditMode ? "22px" : "17px", color: "#2C1810", marginBottom: "10px" }}>
              📌 कथाको शीर्षक
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदाहरण: बचपनको एक दिन"
              className="input-field"
              style={{
                width: "100%",
                boxSizing: "border-box",
                fontSize: isEditMode ? "22px" : "18px",
                padding: isEditMode ? "18px 20px" : "14px 16px",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", fontSize: isEditMode ? "22px" : "17px", fontWeight: 600, color: "#2C1810", marginBottom: "10px" }}>
              📝 कथा लेख्नुहोस् *
            </label>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderRadius: "16px",
              border: "2px solid #E2C9B0",
              background: "#fffdf8",
              padding: "12px",
              width: "100%",
              boxSizing: "border-box",
            }}>
              {/* Toolbar */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }} role="toolbar" aria-label="Nepali typing shortcuts">
                {[
                  { label: "नयाँ परिच्छेद", value: "\n\n" },
                  { label: "शिर्षक", value: "\n\n★ " },
                  { label: "विभाजन", value: "\n\n🌸 🙏 🌸\n\n" },
                  { label: "\u201cउद्धरण\u201d", value: "\u201c\u201d" },
                  { label: "सूचीबद्ध", value: "• " },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => insertAtCursor(item.value)}
                    style={{
                      borderRadius: "50px",
                      border: "1px solid #E2C9B0",
                      padding: isEditMode ? "10px 18px" : "6px 12px",
                      fontSize: isEditMode ? "16px" : "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      background: "white",
                      cursor: "pointer",
                      fontFamily: "Mukta, sans-serif",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Textarea — explicit full width via inline styles only, no Tailwind */}
              <textarea
                ref={descriptionRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="यहाँ तपाईंका सम्झनाहरू, विचारहरू, कथाहरू लेख्नुहोस्..."
                rows={isEditMode ? 20 : 10}
                lang="ne"
                dir="auto"
                spellCheck={false}
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  minHeight: isEditMode ? "460px" : "220px",
                  resize: "vertical",
                  background: "transparent",
                  fontSize: isEditMode ? "22px" : "18px",
                  lineHeight: "2",
                  color: "#2C1810",
                  outline: "none",
                  border: "none",
                  fontFamily: "Mukta, sans-serif",
                  padding: "8px 4px",
                }}
              />
            </div>

            <div style={{ marginTop: "6px", textAlign: "right", fontSize: "15px", color: "#8B6553" }}>
              {description.length} अक्षर
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  background: "#F5ECD7",
                  border: "none",
                  borderRadius: "16px",
                  padding: isEditMode ? "18px" : "16px",
                  fontSize: isEditMode ? "20px" : "17px",
                  fontWeight: 600,
                  color: "#5C3D2E",
                  cursor: "pointer",
                  minHeight: isEditMode ? "64px" : "54px",
                  fontFamily: "Mukta, sans-serif",
                }}
              >
                रद्द गर्नुहोस्
              </button>
            )}
            <button
              type="submit"
              disabled={saving || !description.trim()}
              style={{
                flex: 2,
                minWidth: "160px",
                background: saving || !description.trim() ? "#ccc" : "linear-gradient(135deg, #1A6FA6, #0D4F7A)",
                border: "none",
                borderRadius: "16px",
                padding: isEditMode ? "18px" : "16px",
                fontSize: isEditMode ? "21px" : "18px",
                fontWeight: 700,
                color: "white",
                cursor: saving || !description.trim() ? "not-allowed" : "pointer",
                minHeight: isEditMode ? "64px" : "54px",
                boxShadow: "0 4px 16px rgba(26,111,166,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Mukta, sans-serif",
              }}
            >
              {saving ? "सेभ हुँदैछ..." : contentId ? "✅ अद्यावधिक गर्नुहोस्" : "💾 कथा सेभ गर्नुहोस्"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
