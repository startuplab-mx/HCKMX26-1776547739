import os
from dotenv import load_dotenv

load_dotenv()

SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_HOST = os.getenv("SMTP_HOST", "mail.layersintel.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
PAPA_EMAIL = os.getenv("PAPA_EMAIL")
KEYWORD_THRESHOLD = int(os.getenv("KEYWORD_THRESHOLD", "1"))
FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))

IPINFO_TOKEN   = os.getenv("IPINFO_TOKEN", "")
SUPABASE_URL   = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY   = os.getenv("SUPABASE_KEY", "")
