import requests
from config import IPINFO_TOKEN


def lookup(ip: str) -> dict:
    try:
        url = f"https://ipinfo.io/{ip}/json"
        params = {"token": IPINFO_TOKEN} if IPINFO_TOKEN else {}
        r = requests.get(url, params=params, timeout=5)
        data = r.json()

        lat, lon = None, None
        if "loc" in data:
            parts = data["loc"].split(",")
            lat = float(parts[0])
            lon = float(parts[1])

        # org: "AS17072 TOTAL PLAY TELECOMUNICACIONES SA DE CV"
        org = data.get("org", "")
        company = org.split(" ", 1)[1] if " " in org else org

        # as_type viene del objeto asn (plan de pago); fallback "isp"
        as_type = data.get("asn", {}).get("type", "isp")

        return {
            "company": company or None,
            "as_type": as_type,
            "latitud": lat,
            "longitud": lon,
            "ciudad": data.get("city"),
            "region": data.get("region"),
            "pais": data.get("country"),
        }
    except Exception:
        return {
            "company": None,
            "as_type": None,
            "latitud": None,
            "longitud": None,
            "ciudad": None,
            "region": None,
            "pais": None,
        }
