# 🎙️ RECO.AI — Podcast Recommender

![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

> Progetto scolastico sviluppato per un'azienda tech partner.  
> RECO.AI è un sistema di raccomandazione di podcast italiani basato sugli interessi dell'utente.

---

## 📌 Panoramica

RECO.AI permette all'utente di selezionare le proprie tematiche preferite (es. *Economia*, *Crime*, *Tecnologia*) e ricevere una lista personalizzata di podcast ordinata per affinità.  
Il sistema combina un backend Java per l'elaborazione dei dati con un server Python Flask e un'interfaccia web moderna e responsive.

---

## 🏫 Il progetto

Progetto realizzato nell'ambito delle attività di **Formazione Scuola Lavoro (FSL)**, annualità **2025-26**.

| | |
|---|---|
| **Istituto** | ITT Guido Dorso — Avellino, Indirizzo Informatica |
| **Classe** | 4Ai |
| **Azienda partner** | M.A.C Solution |

---

## ✨ Funzionalità principali

- **Selezione interattiva** delle preferenze tramite tag cliccabili
- **Algoritmo di ranking** che calcola l'affinità tra i gusti dell'utente e il catalogo podcast
- **Risultati ordinati** con badge di compatibilità, copertine e link diretti a Spotify
- **Modal di dettaglio** per ogni podcast consigliato

---

## 📸 Screenshot

| Homepage | Preferenze | Risultati |
|:---:|:---:|:---:|
| ![Homepage](https://github.com/user-attachments/assets/20a7ab29-cabc-4126-b796-b8a88851da0b) | ![Preferenze](https://github.com/user-attachments/assets/46711d12-36f4-421c-9406-ed54d108fd72) | ![Risultati](https://github.com/user-attachments/assets/3b96498d-5448-484f-9dba-bc679faf7298) |

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Ruolo nel progetto |
|---|---|
| **Java** | Lettura del catalogo, calcolo del ranking, scrittura dell'output JSON |
| **Python / Flask** | Server web, API REST, salvataggio preferenze, esecuzione del backend Java |
| **HTML / CSS / JavaScript** | Interfaccia utente: home, pagina preferenze, pagina risultati |


---

## 🗂️ Struttura del progetto

```
RECO.AI/
│
├── backend/                  # Logica di business in Java
│   ├── Main.java             # Entry point del backend
│   ├── Podcast.java          # Modello dati podcast
│   ├── Ranking.java          # Modello dati risultato ranking
│   ├── Raccomander.java      # Algoritmo di raccomandazione
│   ├── Lettura.java          # Lettura CSV e JSON
│   └── Scrittura.java        # Scrittura output JSON
│
├── data/                     # File di dati
│   ├── catalogo_podcast.csv  # Catalogo completo dei podcast
│   ├── user_preferences.json # Preferenze salvate dall'utente
│   └── output_ranking.json   # Risultato del ranking (generato)
│
├── frontend/                 # Interfaccia utente
│   ├── index.html            # Homepage con hero e CTA
│   ├── css/
│   │   └── style.css         # Stili globali condivisi (variabili, header, animazioni)
│   ├── js/
│   │   └── script.js         # Navigazione homepage
│   ├── assets/
│   │   ├── img/              # Copertine dei podcast (.webp)
│   │   ├── desc/             # Descrizioni dei podcast (.txt)
│   │   └── logo/             # Logo e favicon
│   ├── preferenze/
│   │   ├── preferenze.html   # Pagina selezione tag/tematiche
│   │   ├── css/              # Stili esclusivi pagina preferenze
│   │   └── js/               # Logica selezione tag e invio preferenze
│   └── risultato/
│       ├── risultato.html    # Pagina risultati consigliati
│       ├── css/              # Stili esclusivi pagina risultati
│       └── js/               # Caricamento ranking, rendering card e modal
│
└── server.py                 # Server Flask (entry point applicazione)
```

---

## ⚙️ Requisiti

Prima di avviare il progetto, assicurati di avere installato:

- **Java JDK** 25 (versioni precedenti non testate)
- **Python** 3.13 (versioni precedenti non testate)
- **pip** (gestore pacchetti Python)

---

## 🚀 Installazione e avvio

**1. Clona il repository**
```bash
git clone https://github.com/0xCespuglio/RECO.AI.git
cd RECO.AI
```

**2. Installa le dipendenze Python**
```bash
pip install flask flask-cors
```

**3. Avvia il server**
```bash
python server.py
```

> All'avvio, il server compila automaticamente i file Java. Non è necessario compilarli manualmente.

**4. Apri l'applicazione nel browser**
```
http://127.0.0.1:5000/frontend/index.html
```

---

## 🔄 Come funziona

1. **L'utente** apre la homepage e clicca su *Inizia*
2. **Nella pagina Preferenze** seleziona una o più tematiche di interesse (es. Crime, Finanza, Satira)
3. **Il frontend** invia le preferenze al server Flask tramite una chiamata API (`POST /save-preferences`)
4. **Il server Flask** salva le preferenze in `user_preferences.json` e avvia il programma Java
5. **Il backend Java** legge il catalogo podcast, calcola il punteggio di affinità per ogni podcast e scrive i risultati in `output_ranking.json`
6. **La pagina Risultati** carica il JSON generato e mostra i podcast consigliati, ordinati dal più al meno affine

**Flusso dati:**
```
Homepage → Preferenze → POST /save-preferences → Flask → Java → output_ranking.json → Risultati
```

---

## 🧮 Algoritmo di raccomandazione

Il sistema usa un algoritmo di **Concentrazione (Precision)**:

```
Score = (tag in comune tra utente e podcast) / (tag totali del podcast) × 100
```

Questo approccio premia i podcast *focalizzati* sugli interessi dell'utente: un podcast con 3 tag, tutti corrispondenti alle preferenze, ottiene un punteggio più alto rispetto a uno con 10 tag di cui solo 3 corrispondenti. Il risultato è un ranking stabile indipendentemente dal numero di preferenze selezionate.

I podcast con punteggio `0` (nessun tag in comune) vengono esclusi dai risultati.

---

## 📝 Note per gli sviluppatori

- Per aggiungere o modificare podcast, modifica `data/catalogo_podcast.csv`
- I tag nel CSV devono essere separati da `;`
- Per modificare l'algoritmo di raccomandazione agisci su `backend/Raccomander.java`
- Il server compila automaticamente il Java all'avvio — non è necessario compilare manualmente
- Le descrizioni dei podcast sono file `.txt` separati in `frontend/assets/desc/` — il nome del file deve corrispondere al campo `Immagine` del CSV (con estensione `.txt`)
- Per aggiungere un nuovo tag selezionabile, inseriscilo nell'HTML di `preferenze/preferenze.html` e assicurati che corrisponda esattamente (case-insensitive) al tag nel CSV

---

## 👥 Team

**Progettazione**  
Donato Amoroso · Domenico Gaeta · Emanuele Del Vacchio · Domenico Pappacoda

**Sviluppo**  
Vincenzo Ercolino · Stefano Picariello · Raffaele Donnarummo · Carmine Napolitano

**Grafica**  
Ernesto Capponi · Antonio Canarino · Mario Spiotta · Pasquale Castellano

**Script**  
Andrea Lepore · Matthias Altomare · Vittorio Graziano · Renato Apice · Carmine Penna

**Scrittura della presentazione e documentazione**  
Michele Cotovanu · Ian Fernandes · Carmine Cioffi · Marco Savino
