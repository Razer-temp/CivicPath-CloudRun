import { logger } from "../utils/logger";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translateTextBatch } from '../services/translationService';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => string;
  t: (text: string) => string;
  registerTexts: (texts: string[]) => void;
  dictionary: Record<string, string>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('civicpath_lang') || 'en');
  const [dictionary, setDictionary] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`civicpath_dict_${language}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [pendingTexts, setPendingTexts] = useState<Set<string>>(new Set());

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('civicpath_lang', lang);
    // Update the HTML lang attribute for accessibility (WCAG 3.1.1)
    document.documentElement.setAttribute('lang', lang);
    const saved = localStorage.getItem(`civicpath_dict_${lang}`);
    setDictionary(saved ? JSON.parse(saved) : {});
  };

  // Debounced translation fetcher
  useEffect(() => {
    if (language === 'en') return;
    
    const list = Array.from(pendingTexts).filter(t => !dictionary[t]);
    if (list.length === 0) return;

    const fetchTranslation = async () => {
      try {
        const results = await translateTextBatch(list, language);
        const newDict: Record<string, string> = {};
        list.forEach((text, i) => {
          newDict[text] = results[i] || text;
        });
        
        setDictionary(prev => {
          const updated = { ...prev, ...newDict };
          localStorage.setItem(`civicpath_dict_${language}`, JSON.stringify(updated));
          return updated;
        });
        
        setPendingTexts(prev => {
          const next = new Set(prev);
          list.forEach(t => next.delete(t));
          return next;
        });
      } catch (e) {
        logger.error('Translation batch failed', e);
      }
    };
    
    const timeout = setTimeout(fetchTranslation, 500);
    return () => clearTimeout(timeout);
  }, [pendingTexts, language, dictionary]);

  const registerTexts = useCallback((texts: string[]) => {
    setPendingTexts(prev => {
      const next = new Set(prev);
      let changed = false;
      texts.forEach(t => {
        if (!next.has(t) && !dictionary[t]) {
          next.add(t);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [dictionary]);

  const translate = useCallback((text: string) => {
    if (!text) return "";
    if (language === 'en') return text;
    if (dictionary[text]) return dictionary[text];
    
    if (!pendingTexts.has(text)) {
      // Defer registration to avoid React strict mode set state during render issues
      setTimeout(() => registerTexts([text]), 0);
    }
    return text; 
  }, [language, dictionary, pendingTexts, registerTexts]);

  const contextValue = React.useMemo(
    () => ({ language, setLanguage, translate, t: translate, registerTexts, dictionary }),
    [language, translate, registerTexts, dictionary]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Convenience hook
export const useTranslation = (staticTexts: string[] = []) => {
  const context = useLanguage();
  
  useEffect(() => {
    if (staticTexts.length > 0 && context.language !== 'en') {
      context.registerTexts(staticTexts);
    }
  }, [staticTexts, context.language, context.registerTexts]);

  return {
    t: context.translate,
    language: context.language,
    setLanguage: context.setLanguage
  };
};
