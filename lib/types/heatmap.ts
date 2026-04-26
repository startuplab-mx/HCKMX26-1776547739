export interface HeatmapPoint {
  id:          string;
  source:      "events" | "layers_guard";
  lat:         number;
  lng:         number;
  intensity:   number;
  title:       string | null;
  category:    string | null;
  severity:    string | null;
  description: string | null;
}

export interface GuardEvent {
  id:              string;
  lat:             number;
  lng:             number;
  intensity:       number;
  nivel:           string | null;
  score:           number | null;
  fuente:          string | null;
  texto:           string | null;
  company:         string | null;
  as_type:         string | null;
  timestamp_event: string | null;
  created_at:      string;
  detalle:         string | null;
}

export interface HeatmapResponse {
  points:         HeatmapPoint[];
  newGuardEvents?: GuardEvent[];
  serverTime?:    string;
}
