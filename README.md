# HCKMX26-1776547739

## Layers

Sistema open-source de detección de reclutamiento digital de menores por parte del crimen organizado, basado en tres capas de intervención: detección multimodal local, inteligencia colectiva y escalación crítica.

En México, el crimen organizado es el quinto mayor empleador del país. Su estrategia de reclutamiento más efectiva no requiere armas, solo WiFi. Layers corre dentro del hogar sobre una Raspberry Pi y combina señales de texto, imagen, audio y comportamiento para detectar intentos de reclutamiento digital sin que los datos del menor salgan de casa.

---

## Problema que resuelve

El crimen organizado en México ha trasladado su reclutamiento de menores a plataformas digitales: redes sociales, mensajería, juegos en línea y contenido viral (narcocorridos, estética narco, ofertas de "trabajo fácil"). Las soluciones actuales son insuficientes porque:

- **Las herramientas de control parental tradicionales** son reactivas, basadas en listas negras estáticas y fácilmente evadibles por un lenguaje en constante mutación.
- **Las soluciones en la nube** comprometen la privacidad del menor enviando su actividad completa a servidores externos.
- **Los padres** no tienen visibilidad sobre las señales tempranas (palabras clave, cuentas, canciones, patrones horarios) que indican un intento de reclutamiento.
- **El lenguaje del crimen organizado evoluciona** más rápido que cualquier filtro estático.

Layers ataca el problema desde tres frentes:

1. **Detección multimodal (reactiva):** análisis local de texto (OCR), imágenes (CLIP), narcocorridos y patrones de comportamiento dentro del hogar. Solo cuando múltiples señales coinciden se invoca la API de Claude para confirmar el riesgo y alertar al padre en tiempo real.
2. **Inteligencia colectiva (educativa):** cada alerta de alto riesgo alimenta una base de señales compartida; nuevas palabras, cuentas, canciones y patrones visuales se propagan a toda la red sin necesidad de actualizar la app.
3. **Escalación (crítica):** los eventos críticos se reportan masivamente contra cuentas reclutadoras y se canalizan con autoridades competentes.

---

## Tecnologías y herramientas utilizadas

**Hardware**
- Raspberry Pi 4 (4 GB RAM) como nodo de inferencia local en el hogar.
- Dispositivo móvil del menor como punto de captura.

**Edge / On-device**
- Captura cifrada con **AES-256-GCM**.
- **Tesseract OCR** para extracción de texto desde capturas de pantalla.
- Filtros rápidos en Python (~50 ms): keywords, lista de narcocorridos, cuentas conocidas, patrones horarios y de comportamiento.
- **CLIP** (embeddings visuales) para análisis de imágenes solo cuando los filtros previos detectan coincidencia.

**Backend**
- **Python** + **FastAPI** para el orquestador del pipeline.
- **Linux** (Raspberry Pi OS) como sistema base.

**Cloud / IA**
- **Claude API (Anthropic)** como capa de confirmación de riesgo, invocada únicamente cuando el score compuesto supera el umbral.

**Seguridad**
- Cifrado en reposo y en tránsito (AES-256-GCM).
- Modelo de amenazas y hardening del nodo local.
- Principio de minimización: los datos del menor nunca abandonan el hogar salvo señales agregadas y anonimizadas.

---

## Instrucciones para ejecutar el prototipo

> _Pendiente de completar._

---

## Demo del prototipo

> _Pendiente de completar (enlace público al demo)._

---

## Documentación de herramientas de IA utilizadas

> _Pendiente de completar — se documentarán todas las herramientas de IA usadas (cuáles, para qué y en qué medida), incluyendo modelos locales (CLIP, OCR) y APIs (Claude)._

---

## Integrantes del equipo

- **Carolina Nolasco** — Mecatrónica. Sistemas embebidos y captura en dispositivo.
- **Ruy Cabello** — Mecatrónica. Backend Python/FastAPI, Raspberry Pi, Linux e infraestructura.
- **Alejandro Grimaldo** — Software Developer. Cloud, orquestación del pipeline, front y backend.
- **David Farfán** — Ciberseguridad. Cifrado, modelo de amenazas y hardening.
- **Yahir Gaspar** — Ciberseguridad. Experiencia previa desarrollando soluciones similares.
