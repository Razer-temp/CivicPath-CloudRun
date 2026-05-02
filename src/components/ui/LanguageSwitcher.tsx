import { Globe } from "lucide-react";
import { useTranslation } from "../../lib/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2 group relative">
      <Globe className="w-5 h-5 text-slate-500 group-hover:text-civic-blue transition-colors" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="appearance-none bg-transparent font-medium text-sm text-slate-700 outline-none cursor-pointer pr-4 hover:text-civic-blue transition-colors"
        aria-label="Select Language"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="bn">বাংলা (Bengali)</option>
        <option value="te">తెలుగు (Telugu)</option>
        <option value="mr">मराठी (Marathi)</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};
