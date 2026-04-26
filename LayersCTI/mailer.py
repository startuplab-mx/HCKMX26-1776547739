import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from config import SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT, PAPA_EMAIL

ASUNTOS = {
    "naranja": "KidsWatch — Alerta de contenido detectado",
    "rojo":    "🔴 KidsWatch — ALERTA ALTA de contenido detectado",
    "critico": "🚨 KidsWatch — ALERTA CRÍTICA: posible reclutamiento",
}


def enviar_alerta(fuente: str, timestamp: str, texto: str, detalle: list,
                  nivel: str, score: float, ruta_imagen: str = None,
                  ip_origen: str = None):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = PAPA_EMAIL
    msg["Subject"] = ASUNTOS.get(nivel, ASUNTOS["naranja"])

    lineas_detalle = "\n".join(
        f"  [{d['categoria'].upper()}] '{d['palabra']}' (+{d['puntos']} pts)"
        for d in detalle
    )

    cuerpo = (
        f"Se detectó contenido inapropiado.\n\n"
        f"Nivel de riesgo: {nivel.upper()}\n"
        f"Score: {score}\n"
        f"Fuente: {fuente}\n"
        f"IP del dispositivo: {ip_origen or 'desconocida'}\n"
        f"Timestamp: {timestamp}\n"
        f"Texto extraído: {texto}\n\n"
        f"Palabras detectadas:\n{lineas_detalle}\n"
    )
    msg.attach(MIMEText(cuerpo, "plain"))

    if ruta_imagen and os.path.exists(ruta_imagen):
        with open(ruta_imagen, "rb") as f:
            adjunto = MIMEBase("application", "octet-stream")
            adjunto.set_payload(f.read())
        encoders.encode_base64(adjunto)
        adjunto.add_header("Content-Disposition", f"attachment; filename={os.path.basename(ruta_imagen)}")
        msg.attach(adjunto)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, PAPA_EMAIL, msg.as_string())
