# RDSP-Chatbot

Un mini-chatbot éducatif combinant **NLP sous Jupyter Notebook** et **interface web statique** (HTML/CSS/JS).  
Objectif : prototyper rapidement des logiques de compréhension de questions et de génération de réponses, puis les exposer via une interface simple.

> ⚠️ Ce dépôt est un POC (proof-of-concept) pédagogique : l’inférence principale vit dans le notebook `main.ipynb`, et l’interface web (`chat interface.html`, `script.js`, `styles.css`) est fournie pour des démos locales.

---

## 🧭 Aperçu

- **Notebook principal** : `main.ipynb` (prétraitement, intentions/réponses, logique de génération, évaluations).
- **Front-end** : `chat interface.html` + `styles.css` + `script.js` (UI de chat locale).
- **Ressource** : `reei.pdf` (document de référence / support).
- **Langages** : Jupyter Notebook, HTML, CSS, JavaScript.

```
RDSP-Chatbot/
├─ main.ipynb
├─ chat interface.html
├─ script.js
├─ styles.css
├─ reei.pdf
└─ README.md
```

---

## 🚀 Démo rapide (local)

### etape A — Exécuter la logique NLP dans le notebook

1. Créer un environnement Python puis lancer Jupyter :

    ```bash
    python -m venv .venv
    .venv\Scripts\activate        # Windows
    # source .venv/bin/activate   # Linux/Mac
    pip install -U pip jupyter
    jupyter notebook
    ```

2. Ouvrir `main.ipynb` et exécuter les cellules (prétraitement → modèle → génération).

> Astuce : itérer dans le notebook jusqu’à obtenir une fonction `answer(question: str) -> str`. La section **Intégration API (optionnel)** ci-dessous montre comment l’exposer à l’interface web.

### etape B —  l’interface (maquette)

1. Ouvrir `chat interface.html` dans votre navigateur.
2. Les messages s’affichent côté client. 
---

## 🧱 Prérequis & Installation

**Python**

- Recommandé : **Python 3.10+**

## 🧠 Fonctionnalités (POC)

- Chargement et nettoyage de données d’exemple (intents/FAQ/domain data).
- Vectorisation /  embeddings .
- Baseline de compréhension (ex. classification d’intentions, similarité).
- Génération de réponses simple (règles / retrieval / heuristiques).
- Interface web minimale pour la démonstration.

> Le cœur métier se trouve dans `main.ipynb`. Il peut :
> - entraîner/charger un modèle léger,
> - appliquer une stratégie de recherche (FAQ / réponses prêtes),
> - renvoyer du texte final.

---

## 🧩 Intégration API (optionnel)

Si vous souhaitez connecter l’UI web à une logique Python en local, voici un **exemple minimal FastAPI** :

```python
# app.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# TODO: importer votre pipeline depuis le notebook exporté (pickle/pt)
#       ou refactoriser la logique en module Python
def answer(question: str) -> str:
    # placeholder: branchez ici votre vraie fonction de réponse
    return f"Vous avez demandé: {question}. (Réponse de démonstration)"

class Query(BaseModel):
    message: str

@app.post("/chat")
def chat(q: Query):
    return {"reply": answer(q.message)}
```

Démarrage :

```bash
pip install fastapi uvicorn pydantic
uvicorn app:app --reload --port 8000
```

Dans `script.js`, remplacez l’envoi local par un `fetch("http://127.0.0.1:8000/chat", { method: "POST", ... })` pour recevoir la vraie réponse du backend.

---

## 🖥️ Interface web

- `chat interface.html` : structure de la page et conteneur des messages.
- `styles.css` : styles (bulles, mise en page, responsive).
- `script.js` : gestion des entrées utilisateur et rendu des réponses.

Pour un confort dev, vous pouvez servir les fichiers statiques avec un petit serveur local :

```bash
# Python 3
python -m http.server 5500
# puis ouvrir http://127.0.0.1:5500/chat%20interface.html
```

---

## 🔬 Évaluation & Jeux d’essai

Ajoutez dans le notebook un petit **jeu de test** (questions cibles → réponses attendues) pour mesurer :

- Exact match / Similarité (cosine) / Score d’intent
- Taux de fallback (“désolé, je n’ai pas compris”)
- Temps de réponse

Conservez quelques exemples concrets dans une cellule pour des *sanity checks* reproductibles.

---

## 🛠️ Personnalisation

- **Ajouter des intents/FAQ** : enrichir le jeu d’appariement questions ↔ réponses.
- **Changer la vectorisation** : TF-IDF → embeddings (`sentence-transformers`) si nécessaire.
- **Stratégie de réponse** : prioriser intent > retrieval > fallback.
- **Internationalisation** : détecter la langue et router vers le bon pipeline.

---



## 🗺️ Roadmap

- [ ] Extraire la logique du notebook vers un module Python (`src/`).
- [ ] Ajouter `requirements.txt` et `Dockerfile`.
- [ ] Brancher l’UI à une API réelle (FastAPI).
- [ ] Évaluer un mode **RAG** (index + embeddings) sur documents métier.
- [ ] Tests unitaires sur la fonction `answer`.

---

## 🤝 Contribuer

1. Fork
2. Créer une branche : `git checkout -b feature/ma-feature`
3. Commit : `git commit -m "feat: description"`
4. Push : `git push origin feature/ma-feature`
5. Ouvrir une PR

---



## 📚 Références

- Structure et fichiers du dépôt : `main.ipynb`, `chat interface.html`, `script.js`, `styles.css`, `reei.pdf`.
- La répartition des langages indique une majorité Jupyter Notebook.

