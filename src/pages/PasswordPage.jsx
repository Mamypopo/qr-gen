// src/pages/PasswordPage.jsx
import { useState, useCallback } from "react";

const CONSONANTS = "bcdfghjklmnprstvwz";
const VOWELS = "aeiou";
// leet substitutions ที่ดูเป็นธรรมชาติ
const LEET = { a: "@", e: "3", i: "1", o: "0", s: "$", t: "7" };
const SYMBOLS = "!@#$%&*";

function rand(n) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % n;
}

function randomFrom(str) {
  return str[rand(str.length)];
}

function generatePassword(length, opts) {
  if (!opts.upper && !opts.lower && !opts.numbers && !opts.symbols) return "";

  // reserve ท้าย: 2 สำหรับ number, 1 สำหรับ symbol
  const suffixLen = (opts.numbers ? 2 : 0) + (opts.symbols ? 1 : 0);
  const baseLen = Math.max(length - suffixLen, 2);

  // สร้าง base จาก syllables (CV หรือ CVC) ให้ออกเสียงได้
  let base = "";
  while (base.length < baseLen) {
    const syl = randomFrom(CONSONANTS) + randomFrom(VOWELS) + (rand(2) ? randomFrom(CONSONANTS) : "");
    base += syl;
  }
  base = base.slice(0, baseLen);

  // แปลง base → readable mix
  const leetArr = new Uint32Array(base.length);
  crypto.getRandomValues(leetArr);
  let result = "";
  for (let i = 0; i < base.length; i++) {
    let ch = base[i];
    const canLeet = opts.symbols && LEET[ch];
    const doLeet = canLeet && leetArr[i] % 4 === 0; // ~25% โอกาส
    if (doLeet) {
      result += LEET[ch];
    } else if (i === 0 && opts.upper) {
      result += ch.toUpperCase(); // ตัวแรกพิมพ์ใหญ่เสมอ
    } else if (opts.upper && !opts.lower && leetArr[i] % 3 === 0) {
      result += ch.toUpperCase();
    } else {
      result += ch;
    }
  }

  // เติม suffix: number 2 หลัก + symbol
  const sufArr = new Uint32Array(2);
  crypto.getRandomValues(sufArr);
  if (opts.numbers) result += String(10 + (sufArr[0] % 90)); // 10–99
  if (opts.symbols) result += SYMBOLS[sufArr[1] % SYMBOLS.length];

  return result;
}

function getStrength(password, opts) {
  if (!password) return { label: "", score: 0, color: "" };
  const activeCount = Object.values(opts).filter(Boolean).length;
  const len = password.length;
  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (len >= 16) score++;
  if (activeCount >= 3) score++;
  if (activeCount === 4) score++;
  if (score <= 1) return { label: "Weak", score, color: "from-red-400 to-red-500" };
  if (score <= 2) return { label: "Fair", score, color: "from-orange-400 to-yellow-400" };
  if (score <= 3) return { label: "Good", score, color: "from-yellow-400 to-green-400" };
  return { label: "Strong", score, color: "from-green-400 to-emerald-400" };
}

export default function PasswordPage() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback((len = length, o = opts) => {
    setPassword(generatePassword(len, o));
    setCopied(false);
  }, [length, opts]);

  const handleLength = (e) => {
    const val = Number(e.target.value);
    setLength(val);
    regenerate(val, opts);
  };

  const handleOpt = (key) => {
    const next = { ...opts, [key]: !opts[key] };
    setOpts(next);
    regenerate(length, next);
  };

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const strength = getStrength(password, opts);

  return (
    <>
      <header className="w-full py-6 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            สร้างรหัสผ่านที่จำง่าย แต่คาดเดายาก น้อยแต่มาก เรียบแต่โล่ง ไฮยีน่า
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="max-w-md mx-auto">
          <div className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-3xl border border-border-light dark:border-border-dark shadow-lg dark:shadow-2xl flex flex-col gap-6">

            {/* Password output */}
            <div>
              <div
                className="w-full p-4 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-center font-mono text-lg tracking-wider text-gray-900 dark:text-gray-100 break-all min-h-[60px] flex items-center justify-center cursor-pointer select-all"
                onClick={copy}
                title="คลิกเพื่อคัดลอก"
              >
                {password || <span className="text-gray-400 text-sm">เลือกอย่างน้อย 1 ตัวเลือก</span>}
              </div>

              {/* Strength */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>ความแข็งแกร่ง</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${strength.color} transition-all duration-500`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => regenerate()}
                className="py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-400/60 dark:to-indigo-400/60 hover:from-blue-400 hover:to-indigo-400 dark:hover:from-blue-500/70 dark:hover:to-indigo-500/70 text-gray-800 dark:text-gray-100 shadow-md hover:shadow-lg border border-blue-300/50 dark:border-blue-400/30 transition-all"
              >
                🔄 สร้างใหม่
              </button>
              <button
                onClick={copy}
                className={`py-3 rounded-2xl text-sm font-medium shadow-md hover:shadow-lg border transition-all ${
                  copied
                    ? "bg-gradient-to-r from-green-300 to-emerald-300 dark:from-green-400/60 dark:to-emerald-400/60 border-green-400/50 text-gray-800 dark:text-gray-100"
                    : "bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-400/40 dark:to-purple-400/40 hover:from-pink-300 hover:to-purple-300 dark:hover:from-pink-500/50 dark:hover:to-purple-500/50 border-pink-300/50 dark:border-pink-400/30 text-gray-800 dark:text-gray-100"
                }`}
              >
                {copied ? "✓ คัดลอกแล้ว!" : "📋 คัดลอก"}
              </button>
            </div>

            {/* Length slider */}
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <span>ความยาว</span>
                <span>{length} ตัวอักษร</span>
              </div>
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                onChange={handleLength}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-400 [&::-webkit-slider-thumb]:to-purple-400 [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>6</span>
                <span>64</span>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ประกอบด้วย</p>
              {[
                { key: "upper", label: "ตัวพิมพ์ใหญ่", example: "A–Z" },
                { key: "lower", label: "ตัวพิมพ์เล็ก", example: "a–z" },
                { key: "numbers", label: "ตัวเลข", example: "0–9" },
                { key: "symbols", label: "สัญลักษณ์", example: "!@#$..." },
              ].map(({ key, label, example }) => (
                <label
                  key={key}
                  className="flex items-center justify-between cursor-pointer py-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={opts[key]}
                        onChange={() => handleOpt(key)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{example}</span>
                </label>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
