import re
import cv2
import numpy as np
import pytesseract
from PIL import Image

# PSM modes: 3=auto, 6=uniform block, 11=sparse text (best for overlaid text on photos)
_CONFIGS = [
    "--oem 1 -l spa --psm 6",
    "--oem 1 -l spa --psm 11",
    "--oem 1 -l spa --psm 3",
]


def _upscale(img: np.ndarray, factor: float = 2.0) -> np.ndarray:
    h, w = img.shape[:2]
    return cv2.resize(img, (int(w * factor), int(h * factor)), interpolation=cv2.INTER_LANCZOS4)


def _variantes(img_bgr: np.ndarray) -> list:
    """
    Genera variantes preprocesadas del frame optimizadas para capturas
    de TikTok/WhatsApp con texto superpuesto sobre fondos complejos.
    """
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = _upscale(gray)

    variantes = []

    # 1. Escala de grises pura escalada
    variantes.append(gray)

    # 2. CLAHE — compensa iluminación desigual (escenas nocturnas, bosques)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    variantes.append(clahe.apply(gray))

    # 3. Invertido — para texto blanco sobre fondo oscuro
    variantes.append(cv2.bitwise_not(gray))

    # 4. Umbralización adaptativa — aísla texto de fondos complejos
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    variantes.append(
        cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 10)
    )

    # 5. Umbral adaptativo sobre invertido — texto blanco en fondo oscuro
    inv_blur = cv2.GaussianBlur(cv2.bitwise_not(gray), (5, 5), 0)
    variantes.append(
        cv2.adaptiveThreshold(inv_blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 10)
    )

    # 6. Otsu — umbral global óptimo para imágenes bimodales
    _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    variantes.append(otsu)

    # 7. Bilateral + CLAHE — preserva bordes, ideal para texto con sombra
    bilateral = cv2.bilateralFilter(gray, 9, 75, 75)
    variantes.append(clahe.apply(bilateral))

    return variantes


def extraer_texto(ruta_imagen: str) -> str:
    img_bgr = cv2.imread(ruta_imagen)
    if img_bgr is None:
        raise ValueError(f"No se pudo leer imagen: {ruta_imagen}")

    fragmentos = []

    for variante in _variantes(img_bgr):
        pil_img = Image.fromarray(variante)
        for config in _CONFIGS:
            try:
                texto = pytesseract.image_to_string(pil_img, config=config)
                texto = re.sub(r"[^\w\sáéíóúüñÁÉÍÓÚÜÑ.,!?;:\-]", " ", texto)
                texto = re.sub(r"\s+", " ", texto).strip()
                if len(texto) > 5:
                    fragmentos.append(texto)
            except Exception:
                pass

    if not fragmentos:
        return ""

    # Merge: prioriza fragmentos más largos (más contexto = mejor detección)
    fragmentos.sort(key=len, reverse=True)
    merged = " ".join(dict.fromkeys(fragmentos))  # deduplica preservando orden
    return re.sub(r"\s+", " ", merged).strip()
