export type IOCTipo      = "emoji" | "handle" | "url" | "ip" | "keyword";
export type IOCSeveridad = "critical" | "high" | "medium" | "low";

export interface UnifiedIOC {
  id:               string;
  tipo:             IOCTipo;
  valor:            string;
  label?:           string;
  emoji_meaning?:   string;
  categoria:        string;
  criticidad:       number;   // 1–5
  score:            number;   // 0–100
  hits:             number;
  ultima_deteccion: string;
  severity:         IOCSeveridad;
  tags?:            string[];
}
