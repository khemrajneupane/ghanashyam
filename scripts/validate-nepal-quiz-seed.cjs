const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "nepalQuizSeed.json");
const raw = fs.readFileSync(filePath, "utf8");
const data = JSON.parse(raw);

const errors = [];

if (!Array.isArray(data.categories) || data.categories.length !== 15) {
  errors.push(`Expected 15 categories, got ${data.categories?.length ?? "invalid"}`);
}

if (!Array.isArray(data.questions) || data.questions.length < 300) {
  errors.push(`Expected at least 300 questions, got ${data.questions?.length ?? "invalid"}`);
}

const categoryIds = new Set();
for (const category of data.categories || []) {
  if (!category.id || !category.name) {
    errors.push(`Category missing id or name: ${JSON.stringify(category)}`);
  }
  if (categoryIds.has(category.id)) {
    errors.push(`Duplicate category id: ${category.id}`);
  }
  categoryIds.add(category.id);
}

const allowedDifficulty = new Set(["easy", "medium", "hard"]);
const byCategory = new Map();
const normalizedQuestionText = new Map();

for (const q of data.questions || []) {
  const missing = [
    "id",
    "categoryId",
    "category",
    "question",
    "options",
    "correctAnswer",
    "difficulty",
    "explanation",
  ].filter((key) => q[key] === undefined || q[key] === null || q[key] === "");

  if (missing.length > 0) {
    errors.push(`Question ${q.id || "<no-id>"} missing fields: ${missing.join(", ")}`);
    continue;
  }

  if (!categoryIds.has(q.categoryId)) {
    errors.push(`Question ${q.id} has unknown categoryId: ${q.categoryId}`);
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`Question ${q.id} must have exactly 4 options`);
  } else {
    const optionSet = new Set(q.options.map((opt) => String(opt).trim().toLowerCase()));
    if (optionSet.size !== 4) {
      errors.push(`Question ${q.id} has duplicate options`);
    }
    if (!q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id} correctAnswer is not present in options`);
    }
  }

  if (!allowedDifficulty.has(q.difficulty)) {
    errors.push(`Question ${q.id} has invalid difficulty: ${q.difficulty}`);
  }

  const textKey = String(q.question).trim().toLowerCase();
  if (normalizedQuestionText.has(textKey)) {
    errors.push(
      `Duplicate question text found: ${q.id} and ${normalizedQuestionText.get(textKey)}`,
    );
  } else {
    normalizedQuestionText.set(textKey, q.id);
  }

  if (!byCategory.has(q.categoryId)) {
    byCategory.set(q.categoryId, []);
  }
  byCategory.get(q.categoryId).push(q);
}

for (const category of data.categories || []) {
  const list = byCategory.get(category.id) || [];
  if (list.length < 20) {
    errors.push(`Category ${category.id} has ${list.length} questions; expected at least 20`);
  }

  const diffCount = list.reduce(
    (acc, item) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 },
  );

  if (diffCount.easy === 0 || diffCount.medium === 0 || diffCount.hard === 0) {
    errors.push(
      `Category ${category.id} must include easy, medium, and hard questions. Found ${JSON.stringify(diffCount)}`,
    );
  }
}

if (errors.length > 0) {
  console.error("Validation failed:\n");
  errors.forEach((e, idx) => console.error(`${idx + 1}. ${e}`));
  process.exit(1);
}

console.log("Validation passed.");
console.log(`Categories: ${data.categories.length}`);
console.log(`Questions: ${data.questions.length}`);
