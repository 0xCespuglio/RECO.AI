#RECO.AI — Server Flask

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json, os, subprocess

app = Flask(__name__)
CORS(app)

# --- PERCORSI ---
BASE_DIR    = os.path.dirname(__file__)
DATA_FOLDER = os.path.join(BASE_DIR, "data")
JAVA_DIR    = os.path.join(BASE_DIR, "backend")
FRONT_DIR   = os.path.join(BASE_DIR, "frontend")


# --- ROUTE: HOMEPAGE ---
@app.route("/")
def index():
    return send_from_directory(FRONT_DIR, "index.html")


# --- ROUTE: FILE STATICI FRONTEND ---
@app.route("/frontend/<path:path>")
def serve_frontend(path):
    return send_from_directory(FRONT_DIR, path)


# --- ROUTE: FILE DATA ---
@app.route("/data/<path:filename>")
def serve_data(filename):
    return send_from_directory(DATA_FOLDER, filename)


# --- ROUTE: SALVA PREFERENZE + ESEGUI JAVA ---
@app.route("/save-preferences", methods=["POST"])
def save_preferences():
    data = request.get_json()

    if not data or "tags" not in data:
        return jsonify({"error": "Dati non validi"}), 400

    # 1. Salva user_preferences.json
    os.makedirs(DATA_FOLDER, exist_ok=True)
    prefs_path = os.path.join(DATA_FOLDER, "user_preferences.json")
    with open(prefs_path, "w", encoding="utf-8") as f:
        json.dump({"tags": data["tags"]}, f, ensure_ascii=False, indent=2)
    print(f"  → Preferenze: {data['tags']}")

    # 2. Esegui Main
    result = subprocess.run(
        ["java", "-cp", JAVA_DIR, "Main"],
        cwd=BASE_DIR,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"  → ❌ Errore Java:\n{result.stderr}")
        return jsonify({"error": "Errore esecuzione Java", "detail": result.stderr}), 500

    print(f"  → ✅ Ranking aggiornato")
    return jsonify({"success": True}), 200


# --- AVVIO ---
if __name__ == "__main__":

    # Compila i .java una sola volta (solo nel processo principale)
    if os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        print("⚙️  Compilazione Java...")
        result = subprocess.run(
            ["javac", "-d", JAVA_DIR, os.path.join(JAVA_DIR, "*.java")],
            capture_output=True,
            text=True,
            shell=True
        )
        if result.returncode != 0:
            print(f"  → ❌ Errore:\n{result.stderr}")
        else:
            print("  → ✅ Completata")

    print("🎙️  RECO.AI → http://127.0.0.1:5000/frontend/index.html")
    app.run(port=5000, debug=True)