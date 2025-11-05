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
          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-border-light dark:border-border-dark text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
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
            className="w-full h-10 rounded-lg cursor-pointer border border-border-light dark:border-border-dark flex items-center justify-center transition hover:opacity-80 shadow-sm"
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
            className={`w-full h-10 rounded-lg border border-border-light dark:border-border-dark flex items-center justify-center transition ${
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
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
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
                  ? "bg-blue-600 text-white dark:bg-blue-500 shadow-sm"
                  : "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-[#262626]"
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
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
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
          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-border-light dark:border-border-dark text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
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
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          ↺ รีเซ็ตค่าเริ่มต้น
        </button>
      </div>

    </div>
  );
}
