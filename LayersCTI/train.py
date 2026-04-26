"""
Script de entrenamiento/validacion del pipeline OCR + detector.

Procesa todas las imagenes en ../imagenes/, muestra el texto extraido,
las palabras del diccionario encontradas y el nivel de riesgo calculado.
Util para ajustar umbrales, agregar keywords, y validar preprocessing.

Uso:
    python train.py
    python train.py --imagen /ruta/a/imagen.jpg
    python train.py --verbose
"""

import argparse
import os
import sys
import time

# Permite importar desde el mismo directorio
sys.path.insert(0, os.path.dirname(__file__))

import ocr
import detector

COLORES = {
    "critico": "\033[91m",   # rojo brillante
    "rojo":    "\033[31m",   # rojo
    "naranja": "\033[33m",   # amarillo/naranja
    "verde":   "\033[32m",   # verde
    "reset":   "\033[0m",
    "bold":    "\033[1m",
    "dim":     "\033[2m",
}

IMAGENES_DIR = os.path.join(os.path.dirname(__file__), "..", "imagenes")


def _color(nivel: str, texto: str) -> str:
    c = COLORES.get(nivel, "")
    return f"{c}{texto}{COLORES['reset']}"


def procesar_imagen(ruta: str, verbose: bool = False) -> dict:
    nombre = os.path.basename(ruta)
    print(f"\n{'='*60}")
    print(f"{COLORES['bold']}Imagen:{COLORES['reset']} {nombre}")
    print("="*60)

    t0 = time.time()
    texto = ocr.extraer_texto(ruta)
    elapsed = time.time() - t0

    if not texto:
        print(_color("naranja", "  [!] No se extrajo texto de esta imagen"))
        return {"imagen": nombre, "texto": "", "nivel": "verde", "score": 0}

    if verbose:
        print(f"\n{COLORES['dim']}--- Texto extraido ({elapsed:.1f}s) ---{COLORES['reset']}")
        # Muestra primeros 400 chars para no saturar la consola
        preview = texto[:400] + ("..." if len(texto) > 400 else "")
        print(preview)

    resultado = detector.analizar(texto)
    nivel = resultado["nivel"]
    score = resultado["score"]

    nivel_str = _color(nivel, nivel.upper())
    print(f"\n  Nivel de riesgo : {nivel_str}  (score: {score})")
    print(f"  Score base      : {resultado['score_base']}  x{resultado['multiplicador']}")

    if resultado["palabras_encontradas"]:
        print(f"\n  Palabras detectadas:")
        for d in resultado["detalle"]:
            cat_color = {"alto": "rojo", "medio": "naranja", "bajo": "dim"}.get(d["categoria"], "reset")
            cat_fmt = f"{d['categoria']:6s}"
            print(f"    {_color(cat_color, cat_fmt)}  +{d['puntos']}pt  \"{d['palabra']}\"")
    else:
        print(_color("verde", "  Sin palabras de riesgo detectadas"))

    return {
        "imagen": nombre,
        "texto": texto,
        "nivel": nivel,
        "score": score,
        "palabras": resultado["palabras_encontradas"],
    }


def resumen(resultados: list) -> None:
    print(f"\n{'='*60}")
    print(f"{COLORES['bold']}RESUMEN{COLORES['reset']}")
    print("="*60)

    orden_nivel = ["critico", "rojo", "naranja", "verde"]
    resultados_ordenados = sorted(resultados, key=lambda r: orden_nivel.index(r["nivel"]))

    for r in resultados_ordenados:
        nivel = r["nivel"]
        bar = "█" * min(20, int(r["score"] / 3))
        palabras_str = ", ".join(r["palabras"][:5]) if r["palabras"] else "—"
        nivel_fmt = f"{nivel:7s}"
        print(
            f"  {_color(nivel, nivel_fmt)}  score={r['score']:5.1f}  {COLORES['dim']}{bar}{COLORES['reset']}"
            f"\n           {r['imagen'][:50]}"
            f"\n           Palabras: {palabras_str}"
        )

    alertas = [r for r in resultados if r["nivel"] in {"naranja", "rojo", "critico"}]
    print(f"\n  Total imágenes  : {len(resultados)}")
    print(f"  Con alerta      : {_color('rojo', str(len(alertas)))}")


def main():
    parser = argparse.ArgumentParser(description="Valida el pipeline OCR + detector sobre imágenes de muestra")
    parser.add_argument("--imagen", help="Procesar solo esta imagen")
    parser.add_argument("--verbose", "-v", action="store_true", help="Mostrar texto OCR completo")
    args = parser.parse_args()

    if args.imagen:
        rutas = [args.imagen]
    else:
        if not os.path.isdir(IMAGENES_DIR):
            print(f"[ERROR] No se encontró el directorio de imágenes: {IMAGENES_DIR}")
            sys.exit(1)
        extensiones = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
        rutas = sorted(
            os.path.join(IMAGENES_DIR, f)
            for f in os.listdir(IMAGENES_DIR)
            if os.path.splitext(f)[1].lower() in extensiones
        )
        if not rutas:
            print("[ERROR] No se encontraron imágenes en", IMAGENES_DIR)
            sys.exit(1)

    print(f"{COLORES['bold']}OCR + Detector de Riesgo — Validación{COLORES['reset']}")
    print(f"Procesando {len(rutas)} imagen(es)...\n")

    resultados = []
    for ruta in rutas:
        try:
            r = procesar_imagen(ruta, verbose=args.verbose)
            resultados.append(r)
        except Exception as e:
            print(f"  [ERROR] {ruta}: {e}")

    if len(resultados) > 1:
        resumen(resultados)


if __name__ == "__main__":
    main()
