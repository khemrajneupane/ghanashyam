"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Question { q: string; options: string[]; answer: number; }

const QUESTIONS: Question[] = [
  { q: "नेपालको राजधानी सहर कुन हो?", options: ["पोखरा", "काठमाडौं", "भरतपुर", "बिराटनगर"], answer: 1 },
  { q: "नेपालको राष्ट्रिय फूल कुन हो?", options: ["गुलाब", "सूर्यमुखी", "लालीगुराँस", "कमल"], answer: 2 },
  { q: "नेपालको सबैभन्दा अग्लो हिमाल कुन हो?", options: ["कञ्चनजङ्घा", "अन्नपूर्ण", "सगरमाथा", "मनासलु"], answer: 2 },
  { q: "नेपालको राष्ट्रिय जनावर कुन हो?", options: ["हात्ती", "गाई", "सिंह", "बाघ"], answer: 1 },
  { q: "नेपाली पात्रो अनुसार नयाँ वर्ष कुन महिनामा मनाइन्छ?", options: ["फागुन", "चैत", "बैशाख", "असार"], answer: 2 },
  { q: "नेपालको राष्ट्रिय खेल कुन हो?", options: ["क्रिकेट", "फुटबल", "भलिबल", "दोंगो"], answer: 2 },
  { q: "सगरमाथाको उचाइ कति मिटर हो?", options: ["8,611", "8,848", "8,516", "8,163"], answer: 1 },
  { q: "नेपालमा कुल कति प्रदेश छन्?", options: ["५", "६", "७", "८"], answer: 2 },
];

export default function Quiz() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [questions] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 6));

  const handleTimeUp = useCallback(() => {
    if (!answered) { setAnswered(true); setSelected(-1); }
  }, [answered]);

  useEffect(() => {
    if (done || answered) return;
    if (timeLeft <= 0) { handleTimeUp(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done, answered, handleTimeUp]);

  const pick = (i: number) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    if (i === questions[idx].answer) setScore(p => p + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setDone(true); return; }
    setIdx(p => p + 1); setSelected(null); setAnswered(false); setTimeLeft(20);
  };

  const restart = () => { setIdx(0); setSelected(null); setScore(0); setDone(false); setAnswered(false); setTimeLeft(20); };

  const q = questions[idx];
  const pct = Math.round((score / questions.length) * 100);
  const timerPct = (timeLeft / 20) * 100;
  const timerColor = timeLeft > 10 ? "#2D6A4F" : timeLeft > 5 ? "#D4A017" : "#B5192A";

  if (done) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)" }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15 }}
        style={{ background: "white", borderRadius: "28px", padding: "40px 28px", maxWidth: "460px", width: "100%", textAlign: "center", boxShadow: "0 12px 40px rgba(44,24,16,0.15)", border: "1px solid #E2C9B0" }}>
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>
          {pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}
        </div>
        <h1 style={{ fontWeight: 700, marginBottom: "8px", color: "#2C1810" }}>
          {pct >= 80 ? "शाबास!" : pct >= 50 ? "राम्रो!" : "फेरि प्रयास गर्नुहोस्!"}
        </h1>
        <div style={{ background: pct >= 80 ? "#E8F5EE" : pct >= 50 ? "#FBF4DC" : "#FEF2F2", borderRadius: "20px", padding: "24px", margin: "20px 0", border: `1px solid ${pct >= 80 ? "#2D6A4F" : pct >= 50 ? "#D4A017" : "#B5192A"}30` }}>
          <div style={{ fontSize: "clamp(40px,8vw,60px)", fontWeight: 700, color: pct >= 80 ? "#2D6A4F" : pct >= 50 ? "#D4A017" : "#B5192A" }}>
            {score}/{questions.length}
          </div>
          <p style={{ color: "#5C3D2E", fontSize: "17px" }}>{pct}% सही उत्तर</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={restart} style={{ background: "linear-gradient(135deg, #B5192A, #8B0000)", color: "white", border: "none", borderRadius: "16px", padding: "14px 24px", fontSize: "17px", fontWeight: 700, cursor: "pointer", flex: 1, minWidth: "140px", minHeight: "52px" }}>
            🔄 फेरि खेल्नुहोस्
          </button>
          <Link href="/" style={{ background: "#F5ECD7", color: "#5C3D2E", borderRadius: "16px", padding: "14px 24px", fontSize: "17px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minWidth: "140px" }}>
            🏡 घर जानुहोस्
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)", padding: "28px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "8px" }}>🎮 परिवार प्रश्नोत्तरी</h1>
        <p style={{ color: "#B5D4E8", fontSize: "16px" }}>नेपाल र परिवारबारे कति जान्नुहुन्छ?</p>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px 0" }}>
        {/* Progress & Score */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <span style={{ background: "#E6F2FA", color: "#1A6FA6", borderRadius: "50px", padding: "6px 16px", fontSize: "15px", fontWeight: 600 }}>
            प्रश्न {idx + 1}/{questions.length}
          </span>
          <span style={{ background: "#E8F5EE", color: "#2D6A4F", borderRadius: "50px", padding: "6px 16px", fontSize: "15px", fontWeight: 600 }}>
            🏆 {score} अङ्क
          </span>
          <span style={{ background: timeLeft <= 5 ? "#FEF2F2" : "#FBF4DC", color: timerColor, borderRadius: "50px", padding: "6px 16px", fontSize: "16px", fontWeight: 700 }}>
            ⏱️ {timeLeft}s
          </span>
        </div>

        {/* Timer bar */}
        <div style={{ height: "8px", background: "#E2C9B0", borderRadius: "4px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, borderRadius: "4px", transition: "width 1s linear, background 0.3s" }} />
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i < idx ? "#2D6A4F" : i === idx ? "#1A6FA6" : "#E2C9B0", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <div style={{ background: "white", borderRadius: "24px", padding: "28px 24px", marginBottom: "20px", border: "1px solid #E2C9B0", boxShadow: "0 4px 16px rgba(44,24,16,0.07)" }}>
              <p style={{ fontSize: "clamp(18px,3vw,21px)", fontWeight: 600, color: "#2C1810", lineHeight: 1.6, textAlign: "center" }}>
                {q.q}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.answer;
                const isChosen = i === selected;
                const showResult = answered;
                let bg = "white", border = "#E2C9B0", color = "#2C1810", icon = "";
                if (showResult && isCorrect) { bg = "#E8F5EE"; border = "#2D6A4F"; color = "#1B4332"; icon = " ✅"; }
                else if (showResult && isChosen && !isCorrect) { bg = "#FEF2F2"; border = "#B5192A"; color = "#7F1D1D"; icon = " ❌"; }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={answered} style={{
                    background: bg, border: `2px solid ${border}`, borderRadius: "18px",
                    padding: "18px 20px", textAlign: "left", fontSize: "17px", fontWeight: 500,
                    color, cursor: answered ? "default" : "pointer",
                    transition: "all 0.2s", minHeight: "60px",
                    boxShadow: showResult && isCorrect ? "0 4px 12px rgba(45,106,79,0.2)" : "none",
                    display: "flex", alignItems: "center", gap: "12px",
                  }}
                    onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = "#FDF0E6"; e.currentTarget.style.borderColor = "#E8762B"; } }}
                    onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; } }}>
                    <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: showResult && isCorrect ? "#2D6A4F" : "#F5ECD7", color: showResult && isCorrect ? "white" : "#8B6553", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}{icon}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {answered && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "20px" }}>
            <button onClick={next} style={{
              width: "100%", background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)", color: "white",
              border: "none", borderRadius: "20px", padding: "18px", fontSize: "19px",
              fontWeight: 700, cursor: "pointer", minHeight: "60px",
              boxShadow: "0 4px 16px rgba(26,111,166,0.4)",
            }}>
              {idx + 1 >= questions.length ? "🏁 नतिजा हेर्नुहोस्" : "अर्को प्रश्न →"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
