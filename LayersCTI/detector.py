from rapidfuzz import fuzz
from keywords import KEYWORDS, normalizar

NIVELES = [
    (30, "critico"),
    (15, "rojo"),
    (5,  "naranja"),
    (0,  "verde"),
]

# Umbral de similitud para fuzzy matching (0-100).
# 85 captura errores típicos de OCR (0 por o, l por 1, espacios extra)
# sin generar falsos positivos.
_FUZZY_THRESHOLD = 85


def _fuzzy_en_texto(keyword: str, texto_norm: str) -> bool:
    """Detecta keyword en texto con tolerancia a errores de OCR."""
    kw_norm = normalizar(keyword)

    if kw_norm in texto_norm:
        return True

    palabras_texto = texto_norm.split()
    palabras_kw = kw_norm.split()
    n = len(palabras_kw)

    if n == 1:
        for palabra in palabras_texto:
            if len(palabra) >= 3 and fuzz.ratio(kw_norm, palabra) >= _FUZZY_THRESHOLD:
                return True
    else:
        # Ventana deslizante para keywords de múltiples palabras
        for i in range(max(1, len(palabras_texto) - n + 1)):
            ngrama = " ".join(palabras_texto[i:i + n])
            if fuzz.ratio(kw_norm, ngrama) >= _FUZZY_THRESHOLD:
                return True

    return False


def analizar(texto: str) -> dict:
    normalizado = normalizar(texto)

    score_base = 0
    encontradas = {}
    detalle = []

    for categoria, kws in KEYWORDS.items():
        hits = []
        for kw, puntos in kws.items():
            if _fuzzy_en_texto(kw, normalizado):
                hits.append(kw)
                score_base += puntos
                detalle.append({"palabra": kw, "categoria": categoria, "puntos": puntos})
        if hits:
            encontradas[categoria] = hits

    categorias_presentes = len(encontradas)
    multiplicador = round(1.0 + 0.5 * (categorias_presentes - 1), 2) if categorias_presentes > 1 else 1.0
    score_final = round(score_base * multiplicador, 1)

    nivel = "verde"
    for umbral, nombre in NIVELES:
        if score_final >= umbral:
            nivel = nombre
            break

    return {
        "score": score_final,
        "score_base": score_base,
        "multiplicador": multiplicador,
        "nivel": nivel,
        "categorias": list(encontradas.keys()),
        "palabras_encontradas": [d["palabra"] for d in detalle],
        "detalle": detalle,
    }
