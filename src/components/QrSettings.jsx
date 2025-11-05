// src/components/QrSettings.jsx
import { useState, useEffect } from "react";
import { TwitterPicker } from "react-color";

// ฟังก์ชันตรวจสอบสีเพื่อเลือกข้อความสีขาวหรือดำ
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};

const DEFAULTS = {
  url: "https://example.com",
  color: "#000000",
  bgColor: "#ffffff",
  transparent: false,
  dotStyle: "rounded",
  logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
};

export default function QrSettings({ onChange }) {
  const [url, setUrl] = useState(DEFAULTS.url);
  const [color, setColor] = useState(DEFAULTS.color);
  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor);
  const [transparent, setTransparent] = useState(DEFAULTS.transparent);
  const [dotStyle, setDotStyle] = useState(DEFAULTS.dotStyle);
  const [showLogo, setShowLogo] = useState(true);
  const [logo, setLogo] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  // อัปเดต QR Code อัตโนมัติเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    onChange({
      data: url,
      dotsOptions: { color, type: dotStyle },
      backgroundOptions: { color: transparent ? "transparent" : bgColor },
      image: showLogo ? (logo || DEFAULTS.logo) : undefined,
    });
  }, [url, color, bgColor, transparent, dotStyle, showLogo, logo, onChange]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span>🔗</span>
          <span>URL / ข้อความ</span>
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300/50 dark:focus:ring-purple-300/50 focus:border-pink-300/50 dark:focus:border-purple-300/50 transition-all shadow-sm"
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>🎨</span>
            <span>สี QR</span>
          </label>
          <div
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowBgColorPicker(false);
            }}
            className="w-full h-12 rounded-2xl cursor-pointer border border-border-light dark:border-border-dark flex items-center justify-center transition-all hover:opacity-90 shadow-sm hover:shadow-md"
            style={{ backgroundColor: color }}
          >
            <span
              className="text-sm font-medium drop-shadow-md"
              style={{
                color: getContrastColor(color),
              }}
            >
              {color.toUpperCase()}
            </span>
          </div>
          {showColorPicker && (
            <div className="absolute z-10 mt-2">
              <div
                className="fixed inset-0"
                onClick={() => setShowColorPicker(false)}
              ></div>
              <TwitterPicker
                color={color}
                onChange={(color) => {
                  setColor(color.hex);
                }}
                onChangeComplete={(color) => {
                  setColor(color.hex);
                }}
              />
            </div>
          )}
        </div>
        <div className="relative">
          <label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>🖼️</span>
            <span>พื้นหลัง</span>
          </label>
          <div
            onClick={() => {
              if (!transparent) {
                setShowBgColorPicker(!showBgColorPicker);
                setShowColorPicker(false);
              }
            }}
            className={`w-full h-12 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-center transition-all ${
              transparent
                ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700"
                : "cursor-pointer hover:opacity-80"
            }`}
            style={{ backgroundColor: transparent ? undefined : bgColor }}
          >
            <span
              className="text-sm font-medium drop-shadow-md"
              style={{
                color: transparent
                  ? "#6b7280"
                  : getContrastColor(bgColor),
              }}
            >
              {transparent ? "โปร่งใส" : bgColor.toUpperCase()}
            </span>
          </div>
          {showBgColorPicker && !transparent && (
            <div className="absolute z-10 mt-2">
              <div
                className="fixed inset-0"
                onClick={() => setShowBgColorPicker(false)}
              ></div>
              <TwitterPicker
                color={bgColor}
                onChange={(color) => {
                  setBgColor(color.hex);
                }}
                onChangeComplete={(color) => {
                  setBgColor(color.hex);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <label className="inline-flex items-center justify-between cursor-pointer py-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">
          พื้นหลังโปร่งใส
        </span>
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            checked={transparent}
            onChange={(e) => setTransparent(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/30 dark:to-purple-300/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300/50 dark:peer-focus:ring-purple-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300/50 dark:after:border-purple-300/50 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400 dark:peer-checked:from-pink-500/50 dark:peer-checked:to-purple-500/50 shadow-inner"></div>
        </div>
      </label>

    
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          รูปแบบจุด (Dot Style):
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "rounded", label: "Rounded", emoji: "⭕" },
            { value: "dots", label: "Dots", emoji: "🔵" },
            { value: "classy", label: "Classy", emoji: "💎" },
            { value: "classy-rounded", label: "Classy", emoji: "✨" },
            { value: "square", label: "Square", emoji: "⬜" },
            { value: "extra-rounded", label: "Extra", emoji: "🔘" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDotStyle(option.value)}
              className={`px-2 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${
                dotStyle === option.value
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white shadow-md"
                  : "bg-surface-light dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              title={option.value}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>


      <label className="inline-flex items-center justify-between cursor-pointer py-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">
          แสดงโลโก้ตรงกลาง
        </span>
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            checked={showLogo}
            onChange={(e) => setShowLogo(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/30 dark:to-purple-300/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300/50 dark:peer-focus:ring-purple-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300/50 dark:after:border-purple-300/50 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400 dark:peer-checked:from-pink-500/50 dark:peer-checked:to-purple-500/50 shadow-inner"></div>
        </div>
      </label>

      {showLogo && (
        <div>
        <label className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span>🖍️</span>
          <span>โลโก้ (URL)</span>
        </label>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          className="w-full p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300/50 dark:focus:ring-purple-300/50 focus:border-pink-300/50 dark:focus:border-purple-300/50 transition-all shadow-sm"
            placeholder="https://..."
          />
        </div>
      )}


      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            setUrl(DEFAULTS.url);
            setColor(DEFAULTS.color);
            setBgColor(DEFAULTS.bgColor);
            setTransparent(DEFAULTS.transparent);
            setDotStyle(DEFAULTS.dotStyle);
            setShowLogo(true);
            setLogo("");
            setShowColorPicker(false);
            setShowBgColorPicker(false);
          }}
          className="flex-1 bg-gradient-to-r from-orange-200 to-pink-200 dark:from-orange-300/40 dark:to-pink-300/40 hover:from-orange-300 hover:to-pink-300 dark:hover:from-orange-400/50 dark:hover:to-pink-400/50 text-gray-800 dark:text-gray-100 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg border border-orange-300/50 dark:border-orange-400/30"
        >
          ↺ รีเซ็ตค่าเริ่มต้น
        </button>
      </div>

    </div>
  );
}
