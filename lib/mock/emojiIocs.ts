export type EmojiSeverity = "critical" | "high" | "medium" | "low";

export interface EmojiIOCEntry {
  symbol:   string;
  label:    string;
  meaning:  string;
  severity: EmojiSeverity;
  category: string;
}

export const emojiIocs: EmojiIOCEntry[] = [
  {
    symbol:   "🥷",
    label:    "Ninja",
    meaning:  "Referencia a operadores o miembros de organización criminal",
    severity: "critical",
    category: "Reclutamiento / Identidad",
  },
  {
    symbol:   "🪖",
    label:    "Casco militar",
    meaning:  "Contenido con personas armadas o estética paramilitar",
    severity: "high",
    category: "Militarización / Violencia",
  },
  {
    symbol:   "🍕",
    label:    "Pizza",
    meaning:  "Referencia codificada a organizaciones criminales (ej: chapizza)",
    severity: "high",
    category: "Código / Identidad",
  },
  {
    symbol:   "🐔",
    label:    "Gallo",
    meaning:  "Asociado a reclutamiento en ciertos grupos",
    severity: "high",
    category: "Reclutamiento",
  },
  {
    symbol:   "😈",
    label:    "Diablo",
    meaning:  "Representación de conducta agresiva o criminal",
    severity: "medium",
    category: "Intención",
  },
];

export const emojiSymbols: string[] = emojiIocs.map((e) => e.symbol);
