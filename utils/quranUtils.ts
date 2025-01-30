import fs from "fs";
import path from "path";

interface Ayah {
  chapter: number;
  verse: number;
  text: string;
}

interface QuranData {
  [chapter: number]: Ayah[];
}

interface AyahResponse {
  arabic?: string;
  translation?: string;
  transliteration?: string;
}

// temp: Load Quranic data from JSON files
const quranData: QuranData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../data/quran.json"), "utf-8"),
);

const transliterationData: QuranData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../../data/transliterations/transliteration-en.json"),
    "utf-8",
  ),
);

const translationData: { [lang: string]: QuranData } = {};

const supportedLangs: string[] = ["en", "fr", "es", "ur"];

export function getAyah(
  chapter: number,
  ayah: number,
  lang: string,
  includeArabic: boolean,
  includeTranslation: boolean,
  includeTransliteration: boolean,
): AyahResponse | null {
  if (
    !quranData[chapter] ||
    !quranData[chapter].find((v) => v.verse === ayah)
  ) {
    return null;
  }

  const ayahObj = quranData[chapter].find((v) => v.verse === ayah);
  const result: AyahResponse = {};

  if (includeArabic) {
    result.arabic = ayahObj?.text || "Not available";
  }

  if (includeTranslation) {
    if (!supportedLangs.includes(lang)) {
      return { translation: "Unsupported language" };
    }
    if (!translationData[lang]) {
      translationData[lang] = JSON.parse(
        fs.readFileSync(
          path.join(
            __dirname,
            `../../data/translations/translation-${lang}.json`,
          ),
          "utf-8",
        ),
      );
    }
    const translationAyah = translationData[lang][chapter]?.find(
      (v) => v.verse === ayah,
    );
    result.translation = translationAyah
      ? translationAyah.text
      : "Translation not available";
  }

  if (includeTransliteration) {
    const transliterationAyah = transliterationData[chapter]?.find(
      (v) => v.verse === ayah,
    );
    result.transliteration = transliterationAyah
      ? transliterationAyah.text
      : "Transliteration not available";
  }

  return result;
}

export function getAyahRange(
  chapter: number,
  startAyah: number,
  endAyah: number,
  lang: string,
  includeArabic: boolean,
  includeTranslation: boolean,
  includeTransliteration: boolean,
): AyahResponse | null {
  if (!quranData[chapter]) {
    return null;
  }

  const ayahRange = quranData[chapter].filter(
    (v) => v.verse >= startAyah && v.verse <= endAyah,
  );
  const result: AyahResponse = {
    arabic: "",
    translation: "",
    transliteration: "",
  };

  ayahRange.forEach((ayah) => {
    const ayahNumber = ayah.verse;
    if (includeArabic) {
      result.arabic += ` ${ayah.text} ۝${ayahNumber} `;
    }

    if (includeTranslation) {
      if (!supportedLangs.includes(lang)) {
        return { translation: "Unsupported language" };
      }
      if (!translationData[lang]) {
        translationData[lang] = JSON.parse(
          fs.readFileSync(
            path.join(
              __dirname,
              `../../data/translations/translation-${lang}.json`,
            ),
            "utf-8",
          ),
        );
      }
      const translationAyah = translationData[lang][chapter]?.find(
        (v) => v.verse === ayahNumber,
      );
      result.translation += ` ${ayahNumber}. ${translationAyah ? translationAyah.text : "Translation not available"} `;
    }

    if (includeTransliteration) {
      const transliterationAyah = transliterationData[chapter]?.find(
        (v) => v.verse === ayahNumber,
      );
      result.transliteration += ` ${ayahNumber}. ${transliterationAyah ? transliterationAyah.text : "Transliteration not available"} `;
    }
  });

  return result;
}

export function isValidLanguage(lang: string): boolean {
  return supportedLangs.includes(lang);
}

export { supportedLangs };
