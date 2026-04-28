"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import quizSeed from "@/data/nepalQuizSeed.ne.json";

type Difficulty = "easy" | "medium" | "hard";

interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface QuizQuestion {
  id: string;
  categoryId: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  explanation: string;
}

interface QuizSeed {
  categories: QuizCategory[];
  questions: QuizQuestion[];
  totalCategories: number;
  totalQuestions: number;
}

const seed = quizSeed as QuizSeed;

const ICON_BY_NAME: Record<string, string> = {
  Landmark: "🏛️",
  ScrollText: "📜",
  Map: "🗺️",
  Building2: "🏢",
  LineChart: "📈",
  Temple: "🛕",
  PartyPopper: "🎉",
  Languages: "🗣️",
  Camera: "📷",
  Mountain: "🏔️",
  Trophy: "🏆",
  GraduationCap: "🎓",
  Newspaper: "📰",
  Scale: "⚖️",
  Star: "⭐",
};

const DIFFICULTY_STYLE: Record<
  Difficulty,
  { label: string; bg: string; color: string; border: string }
> = {
  easy: {
    label: "सजिलो",
    bg: "#E8F5EE",
    color: "#1B4332",
    border: "#2D6A4F",
  },
  medium: {
    label: "मध्यम",
    bg: "#FBF4DC",
    color: "#8A6600",
    border: "#D4A017",
  },
  hard: {
    label: "गाह्रो",
    bg: "#FEF2F2",
    color: "#7F1D1D",
    border: "#B5192A",
  },
};

const OPTION_LABELS = ["क", "ख", "ग", "घ"];

function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function buildCategoryQuestions(
  categories: QuizCategory[],
  questions: QuizQuestion[],
): Record<string, QuizQuestion[]> {
  const byCategory: Record<string, QuizQuestion[]> = {};

  for (const category of categories) {
    byCategory[category.id] = [];
  }

  for (const question of questions) {
    if (!byCategory[question.categoryId]) {
      byCategory[question.categoryId] = [];
    }
    byCategory[question.categoryId].push(question);
  }

  return byCategory;
}

function buildDifficultyStats(questions: QuizQuestion[]): {
  easy: number;
  medium: number;
  hard: number;
} {
  return questions.reduce(
    (acc, q) => {
      acc[q.difficulty] += 1;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 },
  );
}

export default function Quiz() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answered, setAnswered] = useState(false);

  const questionsByCategory = useMemo(
    () => buildCategoryQuestions(seed.categories, seed.questions),
    [],
  );

  const currentCategory = useMemo(
    () =>
      seed.categories.find((category) => category.id === selectedCategoryId) ??
      null,
    [selectedCategoryId],
  );

  const currentQuestion = questions[idx] ?? null;
  const correctIndex =
    currentQuestion?.options.findIndex(
      (option) => option === currentQuestion.correctAnswer,
    ) ?? -1;

  const scorePct =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const timerPct = (timeLeft / 20) * 100;
  const timerColor =
    timeLeft > 10 ? "#2D6A4F" : timeLeft > 5 ? "#D4A017" : "#B5192A";

  const resetRoundState = () => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswered(false);
    setTimeLeft(20);
  };

  const startCategory = (categoryId: string) => {
    const pool = questionsByCategory[categoryId] ?? [];
    if (pool.length === 0) return;

    setSelectedCategoryId(categoryId);
    setQuestions(shuffle(pool));
    resetRoundState();
  };

  const replayCurrentCategory = () => {
    if (!selectedCategoryId) return;
    const pool = questionsByCategory[selectedCategoryId] ?? [];
    if (pool.length === 0) return;

    setQuestions(shuffle(pool));
    resetRoundState();
  };

  const backToCategories = () => {
    setSelectedCategoryId(null);
    setQuestions([]);
    resetRoundState();
  };

  const handleTimeUp = useCallback(() => {
    if (!answered && currentQuestion) {
      setAnswered(true);
      setSelected(-1);
    }
  }, [answered, currentQuestion]);

  useEffect(() => {
    if (!selectedCategoryId || done || answered || !currentQuestion) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [
    answered,
    currentQuestion,
    done,
    handleTimeUp,
    selectedCategoryId,
    timeLeft,
  ]);

  const pick = (optionIndex: number) => {
    if (answered || !currentQuestion) return;

    setSelected(optionIndex);
    setAnswered(true);

    if (optionIndex === correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }

    setIdx((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(20);
  };

  if (!selectedCategoryId) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)",
          paddingBottom: "50px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)",
            padding: "30px 20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "8px" }}>
            नेपाल प्रश्नोत्तरी चुनौती
          </h1>
          <p style={{ color: "#B5D4E8", fontSize: "16px" }}>
            श्रेणी छान्नुहोस् र सिधै प्रश्नोत्तरी खेल्नुहोस्।
          </p>
          <p style={{ color: "#E6F2FA", fontSize: "14px", marginTop: "10px" }}>
            {seed.totalCategories} श्रेणी • {seed.totalQuestions} प्रश्न
          </p>
        </div>

        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "24px 16px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
            }}
          >
            {seed.categories.map((category) => {
              const categoryQuestions = questionsByCategory[category.id] ?? [];
              const stats = buildDifficultyStats(categoryQuestions);
              const categoryIcon = ICON_BY_NAME[category.icon] ?? "🎯";

              return (
                <button
                  key={category.id}
                  onClick={() => startCategory(category.id)}
                  style={{
                    textAlign: "left",
                    background: "white",
                    borderRadius: "20px",
                    border: `2px solid ${category.color}35`,
                    padding: "18px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(44,24,16,0.07)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        background: `${category.color}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      {categoryIcon}
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: category.color,
                        background: `${category.color}18`,
                        borderRadius: "999px",
                        padding: "4px 10px",
                      }}
                    >
                      {categoryQuestions.length} प्रश्न
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: "#2C1810",
                      fontSize: "18px",
                      lineHeight: 1.3,
                      minHeight: "46px",
                    }}
                  >
                    {category.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "7px",
                      marginTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: DIFFICULTY_STYLE.easy.color,
                        background: DIFFICULTY_STYLE.easy.bg,
                        border: `1px solid ${DIFFICULTY_STYLE.easy.border}60`,
                        borderRadius: "999px",
                        padding: "4px 8px",
                      }}
                    >
                      सजिलो {stats.easy}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: DIFFICULTY_STYLE.medium.color,
                        background: DIFFICULTY_STYLE.medium.bg,
                        border: `1px solid ${DIFFICULTY_STYLE.medium.border}60`,
                        borderRadius: "999px",
                        padding: "4px 8px",
                      }}
                    >
                      मध्यम {stats.medium}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: DIFFICULTY_STYLE.hard.color,
                        background: DIFFICULTY_STYLE.hard.bg,
                        border: `1px solid ${DIFFICULTY_STYLE.hard.border}60`,
                        borderRadius: "999px",
                        padding: "4px 8px",
                      }}
                    >
                      गाह्रो {stats.hard}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)",
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "34px 24px",
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #E2C9B0",
            boxShadow: "0 12px 40px rgba(44,24,16,0.15)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "12px" }}>
            {scorePct >= 80 ? "🏆" : scorePct >= 50 ? "👏" : "💪"}
          </div>

          <h2 style={{ margin: 0, color: "#2C1810" }}>
            {scorePct >= 80
              ? "उत्कृष्ट प्रदर्शन"
              : scorePct >= 50
                ? "राम्रो प्रयास"
                : "अझ अभ्यास गर्नुहोस्"}
          </h2>

          <p style={{ margin: "8px 0 0", color: "#5C3D2E", fontSize: "15px" }}>
            {currentCategory?.name}
          </p>

          <div
            style={{
              borderRadius: "18px",
              margin: "18px 0",
              padding: "18px",
              background:
                scorePct >= 80
                  ? "#E8F5EE"
                  : scorePct >= 50
                    ? "#FBF4DC"
                    : "#FEF2F2",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color:
                  scorePct >= 80
                    ? "#2D6A4F"
                    : scorePct >= 50
                      ? "#D4A017"
                      : "#B5192A",
              }}
            >
              {score}/{questions.length}
            </div>
            <p style={{ margin: "6px 0 0", color: "#5C3D2E" }}>{scorePct}% सही</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <button
              onClick={replayCurrentCategory}
              style={{
                flex: 1,
                minWidth: "130px",
                minHeight: "48px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)",
              }}
            >
              फेरि खेल्नुहोस्
            </button>

            <button
              onClick={backToCategories}
              style={{
                flex: 1,
                minWidth: "130px",
                minHeight: "48px",
                borderRadius: "14px",
                border: "1px solid #E2C9B0",
                cursor: "pointer",
                fontWeight: 700,
                color: "#5C3D2E",
                background: "#FFF7EE",
              }}
            >
              श्रेणी छान्नुहोस्
            </button>

            <Link
              href="/"
              style={{
                flexBasis: "100%",
                minHeight: "46px",
                borderRadius: "14px",
                border: "1px solid #E2C9B0",
                color: "#5C3D2E",
                background: "#F5ECD7",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              गृहपृष्ठ जानुहोस्
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion || !currentCategory) {
    return null;
  }

  const questionDifficulty = DIFFICULTY_STYLE[currentQuestion.difficulty];

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(160deg, #FDF6EE, #F5ECD7)",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)",
          padding: "22px 18px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#FBF4DC", fontWeight: 700, marginBottom: "6px" }}>
          {currentCategory.name}
        </h1>
        <button
          onClick={backToCategories}
          style={{
            border: "1px solid #7CB6D7",
            borderRadius: "999px",
            fontSize: "13px",
            color: "#D8EEFA",
            padding: "5px 10px",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          ← श्रेणी बदल्नुहोस्
        </button>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "20px 16px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "#E6F2FA",
              color: "#1A6FA6",
              borderRadius: "50px",
              padding: "6px 14px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            प्रश्न {idx + 1}/{questions.length}
          </span>

          <span
            style={{
              background: "#E8F5EE",
              color: "#2D6A4F",
              borderRadius: "50px",
              padding: "6px 14px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            अंक {score}
          </span>

          <span
            style={{
              background: timeLeft <= 5 ? "#FEF2F2" : "#FBF4DC",
              color: timerColor,
              borderRadius: "50px",
              padding: "6px 14px",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            ⏱ {timeLeft} सेकेन्ड
          </span>
        </div>

        <div
          style={{
            height: "8px",
            background: "#E2C9B0",
            borderRadius: "4px",
            marginBottom: "18px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${timerPct}%`,
              background: timerColor,
              borderRadius: "4px",
              transition: "width 1s linear, background 0.3s",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "22px" }}>
          {questions.map((question, dotIndex) => {
            const dotColor =
              dotIndex < idx
                ? "#2D6A4F"
                : dotIndex === idx
                  ? "#1A6FA6"
                  : "#E2C9B0";
            return (
              <div
                key={question.id}
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: dotColor,
                }}
              />
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.25 }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "22px 18px",
                marginBottom: "14px",
                border: "1px solid #E2C9B0",
                boxShadow: "0 4px 16px rgba(44,24,16,0.07)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  padding: "4px 10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: questionDifficulty.color,
                  background: questionDifficulty.bg,
                  border: `1px solid ${questionDifficulty.border}50`,
                  marginBottom: "10px",
                }}
              >
                {questionDifficulty.label}
              </span>
              <p
                style={{
                  fontSize: "clamp(18px,3vw,22px)",
                  fontWeight: 600,
                  color: "#2C1810",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {currentQuestion.question}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              {currentQuestion.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === correctIndex;
                const isSelected = optionIndex === selected;
                const showResult = answered;

                let bg = "white";
                let border = "#E2C9B0";
                let color = "#2C1810";

                if (showResult && isCorrect) {
                  bg = "#E8F5EE";
                  border = "#2D6A4F";
                  color = "#1B4332";
                } else if (showResult && isSelected && !isCorrect) {
                  bg = "#FEF2F2";
                  border = "#B5192A";
                  color = "#7F1D1D";
                }

                return (
                  <button
                    key={`${currentQuestion.id}-${optionIndex}`}
                    onClick={() => pick(optionIndex)}
                    disabled={answered}
                    style={{
                      background: bg,
                      border: `2px solid ${border}`,
                      borderRadius: "16px",
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "16px",
                      fontWeight: 500,
                      color,
                      cursor: answered ? "default" : "pointer",
                      minHeight: "54px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: isCorrect && showResult ? "#2D6A4F" : "#F5ECD7",
                        color: isCorrect && showResult ? "white" : "#8B6553",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {OPTION_LABELS[optionIndex] ?? `${optionIndex + 1}`}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: "14px" }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #E2C9B0",
                padding: "14px 14px",
                marginBottom: "12px",
              }}
            >
              <p style={{ margin: 0, color: "#2C1810", fontWeight: 700 }}>
                सही उत्तर: {currentQuestion.correctAnswer}
              </p>
              <p style={{ margin: "8px 0 0", color: "#5C3D2E", lineHeight: 1.5 }}>
                {currentQuestion.explanation}
              </p>
            </div>

            <button
              onClick={next}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1A6FA6, #0D4F7A)",
                color: "white",
                border: "none",
                borderRadius: "18px",
                padding: "15px",
                fontSize: "17px",
                fontWeight: 700,
                cursor: "pointer",
                minHeight: "56px",
                boxShadow: "0 4px 16px rgba(26,111,166,0.35)",
              }}
            >
              {idx + 1 >= questions.length ? "🏁 नतिजा हेर्नुहोस्" : "अर्को प्रश्न →"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
