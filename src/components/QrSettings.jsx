// src/components/QrSettings.jsx
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};

const isValidHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(value);

const DEFAULTS = {
  color: "#000000",
  gradientEnabled: false,
  gradientStart: "#000000",
  gradientEnd: "#7c3aed",
  gradientAngle: 0,
  bgColor: "#ffffff",
  transparent: false,
  dotStyle: "rounded",
  cornersSquareType: "square",
  cornersDotType: "square",
  logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
};

const DEFAULT_FIELDS = {
  url: "https://example.com",
  text: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiSecurity: "WPA",
  wifiHidden: false,
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  smsPhone: "",
  smsMessage: "",
  waPhone: "",
  waMessage: "",
  lineId: "",
  vcardFirstName: "",
  vcardLastName: "",
  vcardPhone: "",
  vcardEmail: "",
  vcardCompany: "",
  vcardWebsite: "",
  locationLat: "",
  locationLng: "",
};

const PRESETS = [
  { id: "business", label: "Business", emoji: "💼", color: "#000000", bgColor: "#ffffff", transparent: false, dotStyle: "square" },
  { id: "cute", label: "Cute", emoji: "🌸", color: "#ec4899", bgColor: "#fdf2f8", transparent: false, dotStyle: "dots" },
  { id: "tech", label: "Tech", emoji: "💻", color: "#06b6d4", bgColor: "#0f172a", transparent: false, dotStyle: "classy" },
  { id: "purple", label: "Purple", emoji: "✨", color: "#a855f7", bgColor: "#1e1b4b", transparent: false, dotStyle: "extra-rounded" },
];

const MODES = [
  { id: "url", label: "URL", emoji: "🔗" },
  { id: "text", label: "ข้อความ", emoji: "📝" },
  { id: "wifi", label: "WiFi", emoji: "📶" },
  { id: "email", label: "Email", emoji: "📧" },
  { id: "phone", label: "โทรศัพท์", emoji: "📞" },
  { id: "sms", label: "SMS", emoji: "💬" },
  { id: "whatsapp", label: "WhatsApp", emoji: "🟢" },
  { id: "line", label: "LINE", emoji: "🟩" },
  { id: "vcard", label: "นามบัตร", emoji: "👤" },
  { id: "location", label: "Location", emoji: "📍" },
];

function buildQrData(mode, fields) {
  switch (mode) {
    case "url":
      return fields.url || "https://example.com";
    case "text":
      return fields.text || " ";
    case "wifi": {
      const sec = fields.wifiSecurity || "WPA";
      const ssid = (fields.wifiSsid || "").replace(/([;,:"\\])/g, "\\$1");
      const pass = (fields.wifiPassword || "").replace(/([;,:"\\])/g, "\\$1");
      const hidden = fields.wifiHidden ? "true" : "false";
      return `WIFI:T:${sec};S:${ssid};P:${sec === "nopass" ? "" : pass};H:${hidden};;`;
    }
    case "email": {
      const params = [];
      if (fields.emailSubject) params.push(`subject=${encodeURIComponent(fields.emailSubject)}`);
      if (fields.emailBody) params.push(`body=${encodeURIComponent(fields.emailBody)}`);
      return `mailto:${fields.emailTo || ""}${params.length ? "?" + params.join("&") : ""}`;
    }
    case "phone":
      return `tel:${fields.phone || ""}`;
    case "sms":
      return `smsto:${fields.smsPhone || ""}${fields.smsMessage ? ":" + fields.smsMessage : ""}`;
    case "whatsapp": {
      const phone = (fields.waPhone || "").replace(/\D/g, "");
      return `https://wa.me/${phone}${fields.waMessage ? "?text=" + encodeURIComponent(fields.waMessage) : ""}`;
    }
    case "line":
      return `line://ti/p/~${fields.lineId || ""}`;
    case "vcard": {
      const fn = [fields.vcardFirstName, fields.vcardLastName].filter(Boolean).join(" ");
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${fn || ""}`,
        `N:${fields.vcardLastName || ""};${fields.vcardFirstName || ""};;;`,
        fields.vcardPhone ? `TEL:${fields.vcardPhone}` : null,
        fields.vcardEmail ? `EMAIL:${fields.vcardEmail}` : null,
        fields.vcardCompany ? `ORG:${fields.vcardCompany}` : null,
        fields.vcardWebsite ? `URL:${fields.vcardWebsite}` : null,
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }
    case "location":
      return `geo:${fields.locationLat || "0"},${fields.locationLng || "0"}`;
    default:
      return "";
  }
}

const inputClass =
  "w-full p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300/50 dark:focus:ring-purple-300/50 transition-all shadow-sm";
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block";

function ModeFields({ mode, fields, setField }) {
  const inp = (name, placeholder, type = "text", label) => (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <input
        type={type}
        value={fields[name] || ""}
        onChange={(e) => setField(name, e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  switch (mode) {
    case "url":
      return inp("url", "https://example.com");

    case "text":
      return (
        <textarea
          value={fields.text || ""}
          onChange={(e) => setField("text", e.target.value)}
          placeholder="พิมพ์ข้อความที่ต้องการ..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      );

    case "wifi":
      return (
        <div className="flex flex-col gap-3">
          {inp("wifiSsid", "ชื่อ WiFi (SSID)", "text", "ชื่อ WiFi")}
          <div>
            <label className={labelClass}>ประเภทความปลอดภัย</label>
            <select
              value={fields.wifiSecurity || "WPA"}
              onChange={(e) => setField("wifiSecurity", e.target.value)}
              className={inputClass}
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">ไม่มีรหัสผ่าน (Open)</option>
            </select>
          </div>
          {(fields.wifiSecurity || "WPA") !== "nopass" &&
            inp("wifiPassword", "รหัสผ่าน WiFi", "text", "รหัสผ่าน")}
          <label className="inline-flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hidden Network</span>
            <input
              type="checkbox"
              checked={fields.wifiHidden || false}
              onChange={(e) => setField("wifiHidden", e.target.checked)}
              className="w-4 h-4 accent-purple-500"
            />
          </label>
        </div>
      );

    case "email":
      return (
        <div className="flex flex-col gap-3">
          {inp("emailTo", "email@example.com", "email", "ถึง (To)")}
          {inp("emailSubject", "หัวเรื่อง...", "text", "Subject")}
          <div>
            <label className={labelClass}>Body (ไม่บังคับ)</label>
            <textarea
              value={fields.emailBody || ""}
              onChange={(e) => setField("emailBody", e.target.value)}
              placeholder="ข้อความในอีเมล..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      );

    case "phone":
      return inp("phone", "+66812345678", "tel");

    case "sms":
      return (
        <div className="flex flex-col gap-3">
          {inp("smsPhone", "+66812345678", "tel", "เบอร์โทร")}
          <div>
            <label className={labelClass}>ข้อความล่วงหน้า (ไม่บังคับ)</label>
            <textarea
              value={fields.smsMessage || ""}
              onChange={(e) => setField("smsMessage", e.target.value)}
              placeholder="ข้อความ SMS..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      );

    case "whatsapp":
      return (
        <div className="flex flex-col gap-3">
          {inp("waPhone", "66812345678 (ไม่ต้องมี +)", "tel", "เบอร์ WhatsApp (รหัสประเทศ+เบอร์)")}
          <div>
            <label className={labelClass}>ข้อความล่วงหน้า (ไม่บังคับ)</label>
            <textarea
              value={fields.waMessage || ""}
              onChange={(e) => setField("waMessage", e.target.value)}
              placeholder="สวัสดีครับ..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      );

    case "line":
      return inp("lineId", "your_line_id", "text", "LINE ID");

    case "vcard":
      return (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {inp("vcardFirstName", "ชื่อ", "text", "ชื่อ")}
            {inp("vcardLastName", "นามสกุล", "text", "นามสกุล")}
          </div>
          {inp("vcardPhone", "+66812345678", "tel", "เบอร์โทร")}
          {inp("vcardEmail", "email@example.com", "email", "Email")}
          {inp("vcardCompany", "บริษัท / องค์กร", "text", "บริษัท")}
          {inp("vcardWebsite", "https://example.com", "url", "เว็บไซต์")}
        </div>
      );

    case "location":
      return (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {inp("locationLat", "13.7563", "text", "Latitude")}
            {inp("locationLng", "100.5018", "text", "Longitude")}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            เปิด Google Maps → แตะค้างที่ตำแหน่ง → คัดลอก coordinates
          </p>
        </div>
      );

    default:
      return null;
  }
}

export default function QrSettings({ onChange }) {
  const [mode, setMode] = useState("url");
  const [fields, setFields] = useState(DEFAULT_FIELDS);

  const [color, setColor] = useState(DEFAULTS.color);
  const [gradientEnabled, setGradientEnabled] = useState(DEFAULTS.gradientEnabled);
  const [gradientStart, setGradientStart] = useState(DEFAULTS.gradientStart);
  const [gradientEnd, setGradientEnd] = useState(DEFAULTS.gradientEnd);
  const [gradientAngle, setGradientAngle] = useState(DEFAULTS.gradientAngle);
  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor);
  const [transparent, setTransparent] = useState(DEFAULTS.transparent);
  const [dotStyle, setDotStyle] = useState(DEFAULTS.dotStyle);
  const [cornersSquareType, setCornersSquareType] = useState(DEFAULTS.cornersSquareType);
  const [cornersDotType, setCornersDotType] = useState(DEFAULTS.cornersDotType);
  const [activePreset, setActivePreset] = useState(null);
  const [showLogo, setShowLogo] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showGradientStartPicker, setShowGradientStartPicker] = useState(false);
  const [showGradientEndPicker, setShowGradientEndPicker] = useState(false);

  const setField = (name, value) => setFields((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoDataUrl(reader.result);
      reader.readAsDataURL(logoFile);
    } else {
      setLogoDataUrl("");
    }
  }, [logoFile]);

  useEffect(() => {
    const dotsOptions = gradientEnabled
      ? {
          type: dotStyle,
          gradient: {
            type: "linear",
            rotation: (Number(gradientAngle) * Math.PI) / 180,
            colorStops: [
              { offset: 0, color: gradientStart },
              { offset: 1, color: gradientEnd },
            ],
          },
        }
      : { color, type: dotStyle, gradient: null };

    onChange({
      data: buildQrData(mode, fields),
      dotsOptions,
      cornersSquareOptions: { type: cornersSquareType },
      cornersDotOptions: { type: cornersDotType },
      backgroundOptions: { color: transparent ? "transparent" : bgColor },
      image: showLogo ? (logoDataUrl || logo || DEFAULTS.logo) : undefined,
    });
  }, [
    mode,
    fields,
    color,
    gradientEnabled,
    gradientStart,
    gradientEnd,
    gradientAngle,
    bgColor,
    transparent,
    dotStyle,
    cornersSquareType,
    cornersDotType,
    showLogo,
    logo,
    logoDataUrl,
    onChange,
  ]);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setColor(preset.color);
    setGradientEnabled(false);
    setGradientStart(preset.color);
    setGradientEnd(DEFAULTS.gradientEnd);
    setGradientAngle(DEFAULTS.gradientAngle);
    setBgColor(preset.bgColor);
    setTransparent(preset.transparent);
    setDotStyle(preset.dotStyle);
    setCornersSquareType(DEFAULTS.cornersSquareType);
    setCornersDotType(DEFAULTS.cornersDotType);
    setShowColorPicker(false);
    setShowBgColorPicker(false);
  };

  const handleReset = () => {
    setMode("url");
    setFields(DEFAULT_FIELDS);
    setColor(DEFAULTS.color);
    setGradientEnabled(DEFAULTS.gradientEnabled);
    setGradientStart(DEFAULTS.gradientStart);
    setGradientEnd(DEFAULTS.gradientEnd);
    setGradientAngle(DEFAULTS.gradientAngle);
    setBgColor(DEFAULTS.bgColor);
    setTransparent(DEFAULTS.transparent);
    setDotStyle(DEFAULTS.dotStyle);
    setCornersSquareType(DEFAULTS.cornersSquareType);
    setCornersDotType(DEFAULTS.cornersDotType);
    setActivePreset(null);
    setShowLogo(false);
    setLogo("");
    setLogoFile(null);
    setLogoDataUrl("");
    setShowColorPicker(false);
    setShowBgColorPicker(false);
    setShowGradientStartPicker(false);
    setShowGradientEndPicker(false);
  };

  const modeLabel = MODES.find((m) => m.id === mode)?.label || "";

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Selector */}
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          📋 ประเภท QR Code
        </label>
        <div className="grid grid-cols-5 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center gap-1 px-1 py-2 rounded-2xl text-xs font-medium transition-all border ${
                mode === m.id
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white border-transparent shadow-md"
                  : "bg-surface-light dark:bg-surface-dark text-gray-700 dark:text-gray-300 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <span className="text-base">{m.emoji}</span>
              <span className="leading-tight text-center">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode-specific fields */}
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          {MODES.find((m) => m.id === mode)?.emoji} {modeLabel}
        </label>
        <ModeFields mode={mode} fields={fields} setField={setField} />
      </div>

      {/* Presets */}
      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          ✨ Style Presets
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-2xl text-xs font-medium transition-all border ${
                activePreset === preset.id
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white border-transparent shadow-md"
                  : "bg-surface-light dark:bg-surface-dark text-gray-700 dark:text-gray-300 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center"
                style={{ backgroundColor: preset.transparent ? "transparent" : preset.bgColor }}
              >
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.color, opacity: 0.9 }} />
              </div>
              <span>{preset.emoji}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            🎨 สี QR
          </label>
          <div
            onClick={() => {
              if (!gradientEnabled) {
                setShowColorPicker(!showColorPicker);
              }
              setShowBgColorPicker(false);
              setShowGradientStartPicker(false);
              setShowGradientEndPicker(false);
            }}
            className={`w-full h-12 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-center transition-all shadow-sm ${
              gradientEnabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:opacity-90 hover:shadow-md"
            }`}
            style={{ backgroundColor: color }}
          >
            <span className="text-sm font-medium drop-shadow-md" style={{ color: getContrastColor(color) }}>
              {color.toUpperCase()}
            </span>
          </div>
          {showColorPicker && (
            <div className="absolute z-30 mt-2">
              <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)}></div>
              <div
                className="relative z-20 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 shadow-lg dark:shadow-2xl w-[240px]"
                onClick={(e) => e.stopPropagation()}
              >
                <HexColorPicker color={color} onChange={setColor} />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => { if (isValidHexColor(e.target.value)) setColor(e.target.value); }}
                  onBlur={(e) => { if (!isValidHexColor(e.target.value)) setColor(DEFAULTS.color); }}
                  className="mt-3 w-full p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            🖼️ พื้นหลัง
          </label>
          <div
            onClick={() => {
              if (!transparent) {
                setShowBgColorPicker(!showBgColorPicker);
                setShowColorPicker(false);
                setShowGradientStartPicker(false);
                setShowGradientEndPicker(false);
              }
            }}
            className={`w-full h-12 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-center transition-all ${
              transparent ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700" : "cursor-pointer hover:opacity-80"
            }`}
            style={{ backgroundColor: transparent ? undefined : bgColor }}
          >
            <span
              className="text-sm font-medium drop-shadow-md"
              style={{ color: transparent ? "#6b7280" : getContrastColor(bgColor) }}
            >
              {transparent ? "โปร่งใส" : bgColor.toUpperCase()}
            </span>
          </div>
          {showBgColorPicker && !transparent && (
            <div className="absolute z-30 mt-2">
              <div className="fixed inset-0 z-10" onClick={() => setShowBgColorPicker(false)}></div>
              <div
                className="relative z-20 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 shadow-lg dark:shadow-2xl w-[240px]"
                onClick={(e) => e.stopPropagation()}
              >
                <HexColorPicker color={bgColor} onChange={setBgColor} />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => { if (isValidHexColor(e.target.value)) setBgColor(e.target.value); }}
                  onBlur={(e) => { if (!isValidHexColor(e.target.value)) setBgColor(DEFAULTS.bgColor); }}
                  className="mt-3 w-full p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <label className="inline-flex items-center justify-between cursor-pointer py-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">ไล่สี Gradient</span>
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            checked={gradientEnabled}
            onChange={(e) => {
              const enabled = e.target.checked;
              setGradientEnabled(enabled);
              if (enabled) setGradientStart(color);
              else setColor(gradientStart);
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/30 dark:to-purple-300/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300/50 dark:peer-focus:ring-purple-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300/50 dark:after:border-purple-300/50 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400 dark:peer-checked:from-pink-500/50 dark:peer-checked:to-purple-500/50 shadow-inner"></div>
        </div>
      </label>

      {gradientEnabled && (
        <div className="rounded-2xl border border-border-light dark:border-border-dark p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">สีเริ่มต้น</label>
              <div
                onClick={() => { setShowGradientStartPicker(!showGradientStartPicker); setShowGradientEndPicker(false); setShowColorPicker(false); setShowBgColorPicker(false); }}
                className="w-full h-11 rounded-xl border border-border-light dark:border-border-dark cursor-pointer flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: gradientStart, color: getContrastColor(gradientStart) }}
              >
                {gradientStart.toUpperCase()}
              </div>
              {showGradientStartPicker && (
                <div className="absolute z-30 mt-2">
                  <div className="fixed inset-0 z-10" onClick={() => setShowGradientStartPicker(false)}></div>
                  <div className="relative z-20 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 shadow-lg dark:shadow-2xl w-[240px]" onClick={(e) => e.stopPropagation()}>
                    <HexColorPicker color={gradientStart} onChange={setGradientStart} />
                    <input
                      type="text"
                      value={gradientStart}
                      onChange={(e) => { if (isValidHexColor(e.target.value)) setGradientStart(e.target.value); }}
                      onBlur={(e) => { if (!isValidHexColor(e.target.value)) setGradientStart(DEFAULTS.gradientStart); }}
                      className="mt-3 w-full p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">สีปลายทาง</label>
              <div
                onClick={() => { setShowGradientEndPicker(!showGradientEndPicker); setShowGradientStartPicker(false); setShowColorPicker(false); setShowBgColorPicker(false); }}
                className="w-full h-11 rounded-xl border border-border-light dark:border-border-dark cursor-pointer flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: gradientEnd, color: getContrastColor(gradientEnd) }}
              >
                {gradientEnd.toUpperCase()}
              </div>
              {showGradientEndPicker && (
                <div className="absolute z-30 mt-2">
                  <div className="fixed inset-0 z-10" onClick={() => setShowGradientEndPicker(false)}></div>
                  <div className="relative z-20 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark p-3 shadow-lg dark:shadow-2xl w-[240px]" onClick={(e) => e.stopPropagation()}>
                    <HexColorPicker color={gradientEnd} onChange={setGradientEnd} />
                    <input
                      type="text"
                      value={gradientEnd}
                      onChange={(e) => { if (isValidHexColor(e.target.value)) setGradientEnd(e.target.value); }}
                      onBlur={(e) => { if (!isValidHexColor(e.target.value)) setGradientEnd(DEFAULTS.gradientEnd); }}
                      className="mt-3 w-full p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              มุมไล่สี ({gradientAngle}deg)
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={gradientAngle}
              onChange={(e) => setGradientAngle(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
          <div
            className="h-10 rounded-xl border border-border-light dark:border-border-dark"
            style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})` }}
          />
        </div>
      )}

      <label className="inline-flex items-center justify-between cursor-pointer py-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">พื้นหลังโปร่งใส</span>
        <div className="relative inline-flex items-center">
          <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/30 dark:to-purple-300/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300/50 dark:peer-focus:ring-purple-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300/50 dark:after:border-purple-300/50 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400 dark:peer-checked:from-pink-500/50 dark:peer-checked:to-purple-500/50 shadow-inner"></div>
        </div>
      </label>

      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">⬤ รูปแบบจุด</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "rounded", label: "Rounded", emoji: "⭕" },
            { value: "dots", label: "Dots", emoji: "🔵" },
            { value: "classy", label: "Classy", emoji: "💎" },
            { value: "classy-rounded", label: "Classy+", emoji: "✨" },
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
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">◼ กรอบมุม</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "square", label: "Square", emoji: "⬜" },
            { value: "dot", label: "Circle", emoji: "⭕" },
            { value: "extra-rounded", label: "Rounded", emoji: "🔘" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCornersSquareType(option.value)}
              className={`px-2 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                cornersSquareType === option.value
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white shadow-md"
                  : "bg-surface-light dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">• จุดในมุม</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "square", label: "Square", emoji: "⬜" },
            { value: "dot", label: "Circle", emoji: "⭕" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCornersDotType(option.value)}
              className={`px-2 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                cornersDotType === option.value
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white shadow-md"
                  : "bg-surface-light dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="inline-flex items-center justify-between cursor-pointer py-1">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">แสดงโลโก้ตรงกลาง</span>
        <div className="relative inline-flex items-center">
          <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/30 dark:to-purple-300/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300/50 dark:peer-focus:ring-purple-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300/50 dark:after:border-purple-300/50 after:border-2 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400 dark:peer-checked:from-pink-500/50 dark:peer-checked:to-purple-500/50 shadow-inner"></div>
        </div>
      </label>

      {showLogo && (
        <div>
          <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">🖍️ โลโก้</label>
          <div className="flex flex-col gap-2">
            <label className="w-full p-3 rounded-2xl bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/40 dark:to-purple-300/40 hover:from-pink-300 hover:to-purple-300 dark:hover:from-pink-400/50 dark:hover:to-purple-400/50 border border-pink-300/50 dark:border-purple-300/50 text-center text-gray-800 dark:text-gray-100 cursor-pointer transition-all shadow-sm hover:shadow-md">
              <input
                type="file"
                accept="image/png,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setLogoFile(file); setLogo(""); }
                }}
                className="hidden"
              />
              <span className="text-sm font-medium">
                {logoFile ? `📎 ${logoFile.name}` : "📁 เลือกไฟล์"}
              </span>
            </label>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">หรือ</div>
            <input
              type="text"
              value={logo}
              onChange={(e) => { setLogo(e.target.value); setLogoFile(null); setLogoDataUrl(""); }}
              className="w-full p-3 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300/50 dark:focus:ring-purple-300/50 transition-all shadow-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 bg-gradient-to-r from-orange-200 to-pink-200 dark:from-orange-300/40 dark:to-pink-300/40 hover:from-orange-300 hover:to-pink-300 dark:hover:from-orange-400/50 dark:hover:to-pink-400/50 text-gray-800 dark:text-gray-100 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg border border-orange-300/50 dark:border-orange-400/30"
        >
          ↺ รีเซ็ตค่าเริ่มต้น
        </button>
      </div>
    </div>
  );
}
