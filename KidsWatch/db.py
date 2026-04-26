from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client


def insertar_evento(ip_info: dict, nivel: str, score: float, fuente: str,
                    timestamp_event: str, texto: str, detalle: list):
    row = {
        "company":         ip_info.get("company"),
        "as_type":         ip_info.get("as_type"),
        "latitud":         ip_info.get("latitud"),
        "longitud":        ip_info.get("longitud"),
        "nivel":           nivel.upper(),
        "score":           score,
        "fuente":          fuente,
        "timestamp_event": timestamp_event,
        "texto":           texto,
        "detalle": {
            "palabras": [
                {
                    "texto":     d["palabra"],
                    "categoria": d["categoria"],
                    "puntos":    d["puntos"],
                }
                for d in detalle
            ]
        },
    }
    _get_client().table("layers_guard_events").insert(row).execute()
