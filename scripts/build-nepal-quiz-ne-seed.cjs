const fs = require("fs");
const path = require("path");

const srcPath = path.join(__dirname, "..", "data", "nepalQuizSeed.json");
const outPath = path.join(__dirname, "..", "data", "nepalQuizSeed.ne.json");
const cachePath = path.join(__dirname, "..", "data", ".ne-translation-cache.json");

const src = JSON.parse(fs.readFileSync(srcPath, "utf8"));

const categoryNameMap = {
  "Nepal General Knowledge": "नेपाल सामान्य ज्ञान",
  "Nepal History": "नेपालको इतिहास",
  "Nepal Geography": "नेपालको भूगोल",
  "Nepal Politics & Government": "नेपाल राजनीति र सरकार",
  "Nepal Economy": "नेपालको अर्थतन्त्र",
  "Nepal Religion & Culture": "नेपाल धर्म र संस्कृति",
  "Nepal Festivals": "नेपालका चाडपर्व",
  "Nepal Languages & Ethnic Groups": "नेपालका भाषा र जातीय समूह",
  "Nepal Tourism & Heritage": "नेपाल पर्यटन र सम्पदा",
  "Nepal Mountains & Nature": "नेपाल हिमाल र प्रकृति",
  "Nepal Sports": "नेपाल खेलकुद",
  "Nepal Education & Universities": "नेपाल शिक्षा र विश्वविद्यालय",
  "Nepal Current Affairs": "नेपाल समसामयिक",
  "Nepal Constitution & Law": "नेपाल संविधान र कानून",
  "Famous Nepali Personalities": "प्रसिद्ध नेपाली व्यक्तित्व",
};

const tokenReplacement = {
  ACC: "एसीसी",
  AFC: "एएफसी",
  GDP: "जीडीपी",
  GNI: "जिएनआई",
  GLOF: "हिमताल विष्फोटजन्य बाढी",
  GBIA: "गौतम बुद्ध अन्तर्राष्ट्रिय विमानस्थल",
  HQ: "मुख्यालय",
  ICP: "एकीकृत जाँच चौकी",
  II: "दोस्रो",
  INR: "भारतीय रुपैयाँ",
  KSE: "केएसई",
  K2: "केटु",
  NCC: "एनसीसी",
  NEA: "नेपाल विद्युत प्राधिकरण",
  NEB: "राष्ट्रिय परीक्षा बोर्ड",
  NEP: "नेपाल",
  UNESCO: "युनेस्को",
  UN: "संयुक्त राष्ट्रसंघ",
  SAARC: "सार्क",
  ICC: "आईसीसी",
  ODI: "ओडीआई",
  "COVID-19": "कोभिड-१९",
  CTEVT: "सिटिइभिटी",
  NFA: "एनएफए",
  NOC: "एनओसी",
  NTA: "नेपाल दूरसञ्चार प्राधिकरण",
  NRB: "नेपाल राष्ट्र बैंक",
  NPR: "नेपाली रुपैयाँ",
  NRP: "नेपाली रुपैयाँ",
  NRS: "नेपाली रुपैयाँ",
  NRX: "नेपाली रुपैयाँ",
  NSC: "राष्ट्रिय खेलकुद परिषद्",
  NEX: "नेक्स",
  RSP: "रास्वपा",
  SAFF: "साफ",
  SEE: "एसईई",
  T20: "टी२०",
  TU: "त्रिभुवन विश्वविद्यालय",
  UGC: "विश्वविद्यालय अनुदान आयोग",
  CAN: "क्यान",
  ANFA: "एन्फा",
  NEPSE: "नेप्से",
  VAT: "भ्याट",
  MCC: "एमसीसी",
  LDC: "एलडिसी",
  CIAA: "अख्तियार",
  UTC: "युटिसी",
  km: "किलोमिटर",
  sq: "वर्ग",
  MW: "मेगावाट",
};

const MANUAL_OVERRIDES = {
  "ECO-001": {
    question: "नेपाली रुपैयाँको प्रचलित मुद्रा कोड कुन हो ?",
    options: ["एनपीआर", "आईएनआर", "युरो", "डलर"],
    correctAnswer: "एनपीआर",
    explanation: "नेपाली रुपैयाँको प्रचलित अन्तर्राष्ट्रिय मुद्रा कोड एनपीआर हो।",
  },
  "CUR-001": {
    question:
      "नेपालमा संघीय शासन कार्यान्वयनसँग प्रत्यक्ष सम्बन्धित सरकारका तह कति छन् ?",
    options: ["एक तह", "दुई तह", "तीन तह", "चार तह"],
    correctAnswer: "तीन तह",
    explanation: "नेपालमा संघ, प्रदेश र स्थानीय गरी तीन तहको सरकार व्यवस्था लागू छ।",
  },
  "LAW-001": {
    question: "नेपालको वर्तमान संविधान कुन मितिमा जारी भएको हो ?",
    options: ["२०६५ जेठ १५", "२०६३ माघ १", "२०७२ असोज ३", "२०४७ कार्तिक २३"],
    correctAnswer: "२०७२ असोज ३",
    explanation: "नेपालको वर्तमान संविधान २०७२ असोज ३ गते जारी गरिएको हो।",
  },
  "NAT-015": {
    question: "अन्नपूर्ण संरक्षण क्षेत्र मुख्यतः कुन प्रदेशमा पर्छ ?",
    options: ["कोशी प्रदेश", "गण्डकी प्रदेश", "मधेश प्रदेश", "सुदूरपश्चिम प्रदेश"],
    correctAnswer: "गण्डकी प्रदेश",
    explanation: "अन्नपूर्ण संरक्षण क्षेत्र मुख्यतः गण्डकी प्रदेशका जिल्लाहरूमा फैलिएको छ।",
  },
};

function loadCache() {
  try {
    const raw = fs.readFileSync(cachePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fallbackShortToken(token) {
  const short = token.replace(/\./g, "");
  if (!/^[A-Za-z0-9]+$/.test(short) || short.length > 4) {
    return "";
  }

  const letter = {
    A: "ए",
    B: "बी",
    C: "सी",
    D: "डी",
    E: "ई",
    F: "एफ",
    G: "जी",
    H: "एच",
    I: "आई",
    J: "जे",
    K: "के",
    L: "एल",
    M: "एम",
    N: "एन",
    O: "ओ",
    P: "पी",
    Q: "क्यू",
    R: "आर",
    S: "एस",
    T: "टी",
    U: "यू",
    V: "भी",
    W: "डब्लु",
    X: "एक्स",
    Y: "वाई",
    Z: "जेड",
  };

  return short
    .toUpperCase()
    .split("")
    .map((ch) => letter[ch] || ch)
    .join("");
}

async function translateText(raw, cache) {
  const text = String(raw || "").trim();
  if (!text) return "";

  if (cache[text]) {
    return cache[text];
  }

  const q = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ne&dt=t&q=${q}`;

  let lastErr = null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!res.ok) {
        throw new Error(`अनुवाद सेवा त्रुटि: ${res.status}`);
      }

      const data = await res.json();
      const translated = (data?.[0] || []).map((item) => item?.[0] || "").join("").trim();
      if (!translated) {
        throw new Error("खाली अनुवाद नतिजा आयो");
      }

      cache[text] = translated;
      await wait(60);
      return translated;
    } catch (err) {
      lastErr = err;
      await wait(200 + attempt * 250);
    }
  }

  throw lastErr || new Error("अनुवाद असफल भयो");
}

async function ensureNoLatin(text, cache) {
  if (!/[A-Za-z]/.test(text)) {
    return text;
  }

  const tokens = Array.from(new Set(text.match(/[A-Za-z][A-Za-z0-9.-]*/g) || []));
  let out = text;

  for (const token of tokens) {
    let replacement = "";
    const upper = token.toUpperCase();

    if (tokenReplacement[token]) {
      replacement = tokenReplacement[token];
    } else if (tokenReplacement[upper]) {
      replacement = tokenReplacement[upper];
    } else {
      try {
        replacement = await translateText(token, cache);
      } catch {
        replacement = "";
      }
    }

    if (!replacement || /[A-Za-z]/.test(replacement)) {
      replacement = fallbackShortToken(token);
    }

    if (!replacement || /[A-Za-z]/.test(replacement)) {
      throw new Error(`ल्याटिन पाठ स्वतः हटाउन सकेन: "${token}"`);
    }

    const pattern = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    out = out.replace(pattern, replacement);
  }

  return out;
}

async function main() {
  const cache = loadCache();

  const translatedCategories = src.categories.map((category) => ({
    ...category,
    name: categoryNameMap[category.name] || category.name,
  }));

  const translatedQuestions = [];

  for (let i = 0; i < src.questions.length; i += 1) {
    const q = src.questions[i];

    const translatedQuestion = await ensureNoLatin(await translateText(q.question, cache), cache);
    const translatedOptions = [];

    for (const option of q.options) {
      const t = await ensureNoLatin(await translateText(option, cache), cache);
      translatedOptions.push(t);
    }

    const correctIndex = q.options.findIndex((opt) => opt === q.correctAnswer);
    const translatedCorrect = translatedOptions[correctIndex];

    const translatedExplanation = await ensureNoLatin(
      await translateText(q.explanation, cache),
      cache,
    );

    const baseQuestion = {
      ...q,
      category: categoryNameMap[q.category] || q.category,
      question: translatedQuestion,
      options: translatedOptions,
      correctAnswer: translatedCorrect,
      explanation: translatedExplanation,
    };

    translatedQuestions.push({
      ...baseQuestion,
      ...(MANUAL_OVERRIDES[q.id] || {}),
    });

    if ((i + 1) % 25 === 0) {
      console.log(`प्रश्न अनुवाद: ${i + 1}/${src.questions.length}`);
      saveCache(cache);
    }
  }

  const seed = {
    ...src,
    generatedOn: "2026-04-28",
    difficultyBalancingGuideline: {
      objective: "हरेक श्रेणीलाई सुरुवाती प्रयोगकर्तामैत्री राख्दै क्रमशः चुनौतीपूर्ण बनाउनु।",
      recommendedSplitPercent: {
        easy: 40,
        medium: 40,
        hard: 20,
      },
      operationalRule: "हरेक २० प्रश्नमा करिब ८ सजिलो, ८ मध्यम र ४ गाह्रो प्रश्न राख्ने।",
    },
    futureExpansionStrategy: [
      "हरेक वर्ष समसामयिक विषयको छुट्टै संस्करण थप्ने।",
      "प्रदेश, कालखण्ड, विषय र स्रोत ट्याग राखेर खोज तथा छनोट सजिलो बनाउने।",
      "बहुभाषिक विस्तारका लागि प्रश्न र व्याख्याका छुट्टै भाषा क्षेत्र कायम राख्ने।",
      "स्वचालित प्रमाणीकरण चलाएर दोहोरिएका वा त्रुटिपूर्ण प्रश्न रोकिने व्यवस्था गर्ने।",
      "प्रयोगकर्ता उत्तर विश्लेषणका आधारमा कमजोर प्रश्नलाई प्राथमिकताका साथ अद्यावधिक गर्ने।",
    ],
    categories: translatedCategories,
    questions: translatedQuestions,
  };

  saveCache(cache);
  fs.writeFileSync(outPath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");

  console.log(`नेपाली बीउ फाइल तयार भयो: ${outPath}`);
  console.log(`कुल श्रेणी: ${seed.totalCategories}`);
  console.log(`कुल प्रश्न: ${seed.totalQuestions}`);
}

main().catch((err) => {
  console.error("नेपाली बीउ फाइल बनाउँदा त्रुटि:", err);
  process.exit(1);
});
