# RDSP-Chatbot

Assistant éducatif sur le **Régime Enregistré d’Épargne-Invalidité (RDSP)**, composé d’un **prototype NLP dans un Notebook** et de **front-ends web statiques**.  
Le but est de prototyper rapidement la compréhension de questions et la génération de réponses, puis de les exposer via une interface simple.

> ℹ️ **POC pédagogique** : la logique NLP réside dans `main.ipynb`. Deux interfaces front-end coexistent :
> 1) un **single-file** riche (`chat interface.html`, styles/JS inclus),  
> 2) une **version modulaire** (`styles.css` + `script.js`) prête à intégrer à un `index.html` minimal.

---

## 🗂️ Structure

```
RDSP-Chatbot/
├─ main.ipynb                # Notebook: data prep, logique QA, tests
├─ chat interface.html       # UI complète (sidebar, multi-discussions, thème)
├─ script.js                 # UI minimaliste FR/EN + suggestions + API
├─ styles.css                # Styles de la version minimaliste
└─ README.md
```

---

## ✨ Fonctionnalités clés

- **Deux UI au choix**
  - **Riche (single-file)** : sidebar, **multi-discussions** (renommer/supprimer/copier), **thème sombre/clair**, **FAQ cliquables**, **indicateur de saisie**, requêtes vers une **API `/api/chat`**. :contentReference[oaicite:0]{index=0}
  - **Minimaliste (modulaire)** : **bilingue FR/EN** (toggle), zone de **suggestions** pré-remplies, envoi à l’API `/api/chat`. :contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2}
- **Contrat API simple** (POST JSON) :  
  Requête `{ "question": "<texte>", "lang": "fr|en" (optionnel) }` → Réponse `{ "response": "<texte>" }`. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}
- **UX** : messages animés, responsive, mémorisation du thème (localStorage), copier la conversation.

---

## 🚀 Prise en main rapide

### Option A — Ouvrir l’UI « single-file »
1. Ouvrir **`chat interface.html`** directement dans votre navigateur.  
2. Mettre à jour l’URL du backend si besoin (voir **Configuration API**).

### Option B — Lancer l’UI « modulaire »
1. Créer un `index.html` minimal (exemple ci-dessous) qui référence `styles.css` et `script.js`.  
2. Servir localement (ex. `python -m http.server 5500`) et ouvrir l’URL.

**Exemple `index.html` minimal pour la version modulaire :**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>RDSP Chatbot</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div class="container">
    <header><h1>RDSP Chatbot <span class="canada-flag">🇨🇦</span></h1></header>

    <div class="language-toggle">
      <button id="toggleLang">FR / EN</button>
    </div>

    <div class="chat-container" id="chatBox"></div>

    <div class="suggestions">
      <p id="suggestionText">Essayez ces questions :</p>
      <div class="suggestion-buttons"></div>
    </div>

    <div class="input-area">
      <input id="userInput" placeholder="Posez votre question sur le RDSP..." />
      <button id="sendButton">Envoyer</button>
    </div>
  </div>

  <script src="./script.js"></script>
</body>
</html>
```

---

## 🔧 Configuration API

Les deux UI consomment une **API HTTP POST** (par défaut `/api/chat`).  
Mise à jour à faire :

- **Single-file** : dans `chat interface.html`, modifier `API_URL` (constante JS) si vous changez de domaine (ngrok, localhost, etc.). :contentReference[oaicite:5]{index=5}  
- **Modulaire** : dans `script.js`, adapter `API_URL` et, si besoin, la logique d’envoi `{ question, lang }`. :contentReference[oaicite:6]{index=6}

**Contrat attendu :**
```http
POST /api/chat
Content-Type: application/json

{ "question": "Qu'est-ce que le RDSP ?", "lang": "fr" }  # "lang" optionnel
```
Réponse :
```json
{ "response": "Le RDSP est..." }
```

---

## 🧠 Notebook (`main.ipynb`)

Le notebook contient la logique expérimentale : préparation, règles/ML simples de QA, et jeux d’essai.  
Recommandations :
- factoriser la logique de réponse en une fonction `answer(question: str, lang: str | None) -> str`;
- sauvegarder les artefacts (vecteurs/modèle) pour les charger en API.

Lancement Jupyter :
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
# source .venv/bin/activate
pip install -U pip jupyter
jupyter notebook
```

---

## 🧩 Exemple de backend (Flask)

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # pour tests locaux

def answer(question: str, lang: str | None = None) -> str:
    # TODO: brancher la logique du notebook (chargement modèle / règles)
    if not question:
        return "Posez-moi une question sur le RDSP."
    prefix = "[FR]" if (lang or "fr").lower().startswith("fr") else "[EN]"
    return f"{prefix} Demo: vous avez demandé « {question} »."

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    q = data.get("question", "")
    lang = data.get("lang")
    return jsonify({"response": answer(q, lang)})
```

Démarrage :
```bash
pip install flask flask-cors
python app.py
```

---

## 🧩 Alternative backend (FastAPI)

```python
# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

class Query(BaseModel):
    question: str
    lang: str | None = None

def answer(question: str, lang: str | None = None) -> str:
    if not question:
        return "Posez-moi une question sur le RDSP."
    prefix = "[FR]" if (lang or "fr").lower().startswith("fr") else "[EN]"
    return f"{prefix} Demo: vous avez demandé « {question} »."

@app.post("/api/chat")
def chat(q: Query):
    return {"response": answer(q.question, q.lang)}
```

Démarrage :
```bash
pip install fastapi uvicorn pydantic "uvicorn[standard]"
uvicorn app:app --reload --port 8000
```


---

## 🧪 Tests rapides

- **Sanity check** dans le notebook : liste de questions→réponses attendues.  
- **Smoke test API** :
  ```bash
  curl -X POST http://127.0.0.1:8000/api/chat \
       -H "Content-Type: application/json" \
       -d '{"question":"What is RDSP?","lang":"en"}'
  ```



---

## 🔒 Notes & bonnes pratiques

- Activer **CORS** pour le dev local.  
- Ne pas exposer une clé privée côté front.  
- Valider/limiter la taille d’entrée côté API.  
- Logger les erreurs API.

---

## 🗺️ Roadmap

- [ ] Extraire la logique NLP du notebook vers `src/`.
- [ ] Brancher réellement l’UI à l’API (`answer()`).
- [ ] Ajout d’un mode **RAG** (embeddings + index RDSP).
- [ ] Jeux d’essai + métriques (EM, F1/accuracy intent, temps de réponse).

---

## 🔗 Références du code UI

- UI riche (single-file) : gestion multi-discussions, thème, FAQ, `API_URL`, POST JSON → `response`. :contentReference[oaicite:7]{index=7}  
- UI modulaire : `API_URL`, bascule FR/EN, suggestions, DOM ids (`chatBox`, `userInput`, `toggleLang`, etc.). :contentReference[oaicite:8]{index=8}  
- Styles de la version modulaire (palette, layout, responsive). :contentReference[oaicite:9]{index=9}
