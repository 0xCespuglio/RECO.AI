# RECO.AI - Sistema di Raccomandazione Podcast

Sistema intelligente di raccomandazione podcast basato sulle preferenze dell'utente.

## 📁 Struttura del Progetto

```
data/
└── output_ranking.json          # File JSON con il ranking dei podcast

frontend/
├── index.html                    # Home page
├── css/
│   └── style.css                 # Stili comuni a tutte le pagine
├── js/
│   └── script.js                 # Script home (minimo)
├── risultato/
│   ├── risultato.html            # Pagina visualizzazione risultati
│   ├── css/
│   │   └── style_risultato.css   # Stili specifici risultato (override)
│   └── js/
│       └── script_risultato.js   # Logica caricamento e display podcast
├── preferenze/
│   ├── preferenze.html           # Pagina selezione preferenze
│   ├── css/
│   │   └── style_preferenze.css  # Stili specifici preferenze (override)
│   └── js/
│       └── script_preferenze.js  # Logica selezione e salvataggio JSON
└── assets/
    ├── img/                      # Immagini podcast
    └── desc/                     # Descrizioni (se necessario)
```

## 🚀 Funzionalità

### 1. **Home Page** (`index.html`)
- Presentazione del progetto RECO.AI
- Bottone "Inizia" che porta alla selezione preferenze
- Animazione fade-in all'apertura

### 2. **Selezione Preferenze** (`preferenze/preferenze.html`)
- L'utente seleziona **esattamente 3 tematiche**
- Validazione della selezione
- Generazione file `user_preferences.json` con formato:
  ```json
  {
    "tags": ["Cultura", "Interviste", "Cultura pop"]
  }
  ```
- Animazione di elaborazione con 5 step
- Reindirizzamento automatico alla pagina risultati

### 3. **Visualizzazione Risultati** (`risultato/risultato.html`)
- Caricamento dinamico da `data/output_ranking.json`
- Visualizzazione podcast ordinati per affinità
- Badge con posizione e percentuale di affinità
- Modal con dettagli completi del podcast
- Link diretto a Spotify
- Gestione errori e stati di caricamento

## 🎨 Ottimizzazioni Implementate

### **CSS**
- ✅ **Un solo file CSS condiviso** (`css/style.css`) per eliminare duplicazioni
- ✅ **Variabili CSS** per colori, ombre, transizioni (facile manutenzione)
- ✅ **CSS specifici vuoti** (pronti per eventuali override futuri)
- ✅ **Animazioni CSS pure** (fadeInUp, shake, float, modal)
- ✅ **Responsive design** completo
- ✅ **Scrollbar personalizzata**

### **JavaScript**
- ✅ **Separazione logica/presentazione** (HTML pulito, JS esterno)
- ✅ **Nessuna ridondanza** (codice DRY)
- ✅ **Gestione errori robusta** con try/catch
- ✅ **Commenti JSDoc** per funzioni
- ✅ **Validazione input** (3 preferenze obbligatorie)
- ✅ **Accessibilità** (ARIA attributes, keyboard support)

### **HTML**
- ✅ **Struttura semantica** pulita
- ✅ **Nessuno script inline** (tutto in file esterni)
- ✅ **Collegamenti corretti** tra pagine
- ✅ **Meta tag ottimizzati**

## 📋 Formato Dati

### **Input: user_preferences.json**
```json
{
  "tags": ["tag1", "tag2", "tag3"]
}
```

### **Output: output_ranking.json**
```json
{
  "ranking": [
    {
      "titolo": "Nome Podcast",
      "descrizione": "Descrizione o path a file .txt",
      "punteggio": 85.0,
      "tag_comuni": ["tag1", "tag2"],
      "link": "https://open.spotify.com/...",
      "immagine": "path/to/image.jpg"
    }
  ]
}
```

## 🔄 Flusso di Navigazione

```
index.html 
    ↓
preferenze/preferenze.html 
    ↓ (genera user_preferences.json)
    ↓ (animazione elaborazione)
    ↓
risultato/risultato.html 
    ↓ (carica output_ranking.json)
    ↓ (visualizza risultati)
```

## 🛠️ Modifiche Apportate

### **Eliminato:**
- ❌ Sezione feedback nella pagina preferenze
- ❌ Codice duplicato nei CSS
- ❌ Script inline negli HTML
- ❌ Riferimenti localStorage (non necessari)
- ❌ Codice commentato o non utilizzato

### **Aggiunto:**
- ✅ index.html (home page)
- ✅ Elementi algorithmSteps nella pagina preferenze
- ✅ Separazione pulita CSS/JS per pagina
- ✅ Documentazione completa

### **Mantenuto:**
- ✅ Tutte le funzionalità originali
- ✅ Stile visivo identico
- ✅ Animazioni e transizioni
- ✅ Logica di validazione
- ✅ Gestione errori

## 📦 Come Usare

1. **Posizionare i file** nella struttura indicata
2. **Aggiungere il file** `output_ranking.json` in `/data/`
3. **Aprire** `index.html` nel browser
4. **Seguire il flusso**:
   - Click su "Inizia"
   - Selezionare 3 tematiche
   - Generare JSON
   - Visualizzare risultati

## 🎯 Note Tecniche

- **Nessuna dipendenza** JavaScript (vanilla JS)
- **Font**: Inter (Google Fonts)
- **Icone**: Font Awesome 6.4.0
- **Browser support**: Moderni (Chrome, Firefox, Safari, Edge)
- **Responsive**: Mobile, Tablet, Desktop

## 📝 File Vuoti ma Pronti

I seguenti file sono stati creati vuoti ma pronti per override futuri:
- `preferenze/css/style_preferenze.css`
- `risultato/css/style_risultato.css`

## ✨ Caratteristiche Chiave

- **Codice pulito e ordinato**: Separazione delle responsabilità
- **Manutenibilità**: Facile da modificare e estendere
- **Performance**: Animazioni CSS, caricamento ottimizzato
- **Accessibilità**: ARIA labels, keyboard navigation
- **UX curata**: Animazioni fluide, feedback visivo

---

**Versione**: 2.0 Ottimizzata  
**Data**: Febbraio 2026  
**Autore**: RECO.AI Team
