import os
import uuid
from flask import Flask, request, jsonify
import detector
import ocr
import mailer
import ipinfo as ipinfo_client
import db
from config import KEYWORD_THRESHOLD, FLASK_PORT

app = Flask(__name__)

NIVELES_ALERTA = {"naranja", "rojo", "critico"}


@app.route("/analizar", methods=["POST"])
def analizar():
    fuente = None
    texto = ""
    timestamp = ""
    ruta_imagen = None

    if request.content_type and "multipart/form-data" in request.content_type:
        fuente = request.form.get("fuente", "foto")
        timestamp = request.form.get("timestamp", "")
        imagen = request.files.get("imagen")
        if imagen:
            nombre = f"/tmp/kidswatch_{uuid.uuid4().hex}.jpg"
            imagen.save(nombre)
            ruta_imagen = nombre
            texto = ocr.extraer_texto(ruta_imagen)
    else:
        data = request.get_json(force=True) or {}
        fuente = data.get("fuente", "audio")
        texto = data.get("texto", "")
        timestamp = data.get("timestamp", "")

    resultado = detector.analizar(texto)
    nivel = resultado["nivel"]
    alerta = nivel in NIVELES_ALERTA
    email_enviado = False

    ip_origen = request.headers.get("X-Forwarded-For", request.remote_addr)
    if ip_origen:
        ip_origen = ip_origen.split(",")[0].strip()

    if alerta:
        ip_data = ipinfo_client.lookup(ip_origen)
        mailer.enviar_alerta(
            fuente=fuente,
            timestamp=timestamp,
            texto=texto,
            detalle=resultado["detalle"],
            nivel=nivel,
            score=resultado["score"],
            ruta_imagen=ruta_imagen,
            ip_origen=ip_origen,
        )
        try:
            db.insertar_evento(
                ip_info=ip_data,
                nivel=nivel,
                score=resultado["score"],
                fuente=fuente,
                timestamp_event=timestamp,
                texto=texto,
                detalle=resultado["detalle"],
            )
        except Exception as e:
            app.logger.error(f"Supabase insert error: {e}")
        email_enviado = True

    if ruta_imagen and os.path.exists(ruta_imagen):
        os.remove(ruta_imagen)

    return jsonify({
        "ok": True,
        "alerta": alerta,
        "nivel": nivel,
        "score": resultado["score"],
        "score_base": resultado["score_base"],
        "multiplicador": resultado["multiplicador"],
        "categorias": resultado["categorias"],
        "fuente": fuente,
        "texto": texto,
        "palabras_encontradas": resultado["palabras_encontradas"],
        "detalle": resultado["detalle"],
        **({"email_enviado": email_enviado} if alerta else {}),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=FLASK_PORT)
