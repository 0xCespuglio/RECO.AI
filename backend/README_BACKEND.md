# RECO.AI - Sistema di Raccomandazione Podcast
## Gruppo Backend Java - Guida Completa

---

## 📁 Struttura del Progetto

```
RECO.AI/
├── src/
│   ├── Podcast.java
│   ├── CSVParser.java
│   ├── RisultatoRanking.java
│   ├── AlgoritmoSimilarita.java
│   └── TestCompleto.java
├── data/
│   ├── catalogo_podcast.csv
│   └── user_preferences.json (opzionale)
└── output/
    └── output_ranking.json (generato automaticamente)
```

---

## 🚀 Come Usare il Codice

### 1. Compilazione

```bash
javac Podcast.java RisultatoRanking.java AlgoritmoSimilarita.java CSVParser.java TestCompleto.java
```

### 2. Esecuzione

```bash
java TestCompleto
```

### 3. Output Atteso

Il programma:
1. ✅ Legge `catalogo_podcast.csv`
2. ✅ Simula preferenze utente (modificabili nel main)
3. ✅ Calcola ranking con algoritmo Jaccard
4. ✅ Genera `output_ranking.json`

---

## 📊 Esempio di Output Console

```
╔══════════════════════════════════════════════════════════╗
║         RECO.AI - PODCAST RECOMMENDATION SYSTEM          ║
╚══════════════════════════════════════════════════════════╝

📥 FASE 1: Caricamento catalogo podcast
────────────────────────────────────────────────────────────
📋 Header CSV: Nome,Descrizione,Tags,Pesi,Link,Immagine
✅ Podcast caricato: Muschio Selvaggio
✅ Podcast caricato: La Zanzara
✅ Podcast caricato: One More Time
✅ Podcast caricato: Power Pizza Podcast
✅ Podcast caricato: Elisa True Crime

✅ Caricamento completato: 5 podcast

👤 FASE 2: Preferenze utente
────────────────────────────────────────────────────────────
Tag selezionati: [true crime, investigazione, attualità]
Pesi: {crime=1.0, investigazione=0.9, attualità=0.7}

🧮 FASE 3: Calcolo ranking (Jaccard con pesi)
────────────────────────────────────────────────────────────
✅ Ranking calcolato per 5 podcast

📊 FASE 4: Risultati ranking
════════════════════════════════════════════════════════════

🏆 1. Elisa True Crime
   Affinità: 62.50%
   Tag comuni: [true crime, investigazione]

🏆 2. La Zanzara
   Affinità: 21.88%
   Tag comuni: [attualità]

ℹ️  3 podcast senza affinità (non mostrati)

💾 FASE 5: Generazione output JSON
────────────────────────────────────────────────────────────
✅ File 'output_ranking.json' generato con successo!

╔══════════════════════════════════════════════════════════╗
║                    PROCESSO COMPLETATO                   ║
╚══════════════════════════════════════════════════════════╝
```

---

## 📄 Esempio di output_ranking.json Generato

```json
{
  "ranking": [
    {
      "titolo": "Elisa True Crime",
      "descrizione_breve": "Descrizione da caricare",
      "punteggio": 62.5,
      "tag_comuni": ["true crime", "investigazione"],
      "link": "https://open.spotify.com/",
      "percorso_immagine": "Elisa-True-Crime.jpg",
      "percorso_descrizione": "desc/Elisa-True-Crime.txt"
    },
    {
      "titolo": "La Zanzara",
      "descrizione_breve": "Descrizione da caricare",
      "punteggio": 21.88,
      "tag_comuni": ["attualità"],
      "link": "https://open.spotify.com/",
      "percorso_immagine": "La-Zanzara.jpg",
      "percorso_descrizione": "desc/La-Zanzara.txt"
    },
    {
      "titolo": "One More Time",
      "descrizione_breve": "Descrizione da caricare",
      "punteggio": 0.0,
      "tag_comuni": [],
      "link": "https://open.spotify.com/",
      "percorso_immagine": "One-More-Time.jpg",
      "percorso_descrizione": "desc/One-More-Time.txt"
    }
  ]
}
```

---

## 🧮 Spiegazione dell'Algoritmo di Jaccard

### Formula Base

```
Similarità = (Intersezione / Unione) × 100
```

### Esempio Pratico

**Preferenze Utente:**
- true crime (peso 1.0)
- investigazione (peso 0.9)
- attualità (peso 0.7)

**Podcast "Elisa True Crime":**
- true crime (peso 1.0)
- cronaca nera (peso 0.9)
- investigazione (peso 0.8)

**Calcolo:**

1. **Intersezione (tag comuni):**
   - true crime: 1.0 × 1.0 = 1.0
   - investigazione: 0.9 × 0.8 = 0.72
   - **Totale = 1.72**

2. **Unione (tutti i tag):**
   - Pesi utente: 1.0 + 0.9 + 0.7 = 2.6
   - Pesi podcast non comuni: 0.9 (cronaca nera)
   - **Totale = 2.6 + 0.9 = 3.5**

3. **Jaccard:**
   ```
   (1.72 / 3.5) × 100 = 49.14%
   ```

---

## 🔧 Come Modificare le Preferenze Utente

Nel file `TestCompleto.java`, modifica la sezione:

```java
// Esempio: utente interessato a cinema e recensioni
List<String> preferenzeTag = Arrays.asList(
    "cinema",
    "serie TV",
    "recensioni"
);

Map<String, Double> preferenzePesi = new HashMap<>();
preferenzePesi.put("cinema", 1.0);
preferenzePesi.put("serie TV", 0.8);
preferenzePesi.put("recensioni", 0.6);
```

---

## ✅ Checklist per la Presentazione

- [ ] Il codice compila senza errori
- [ ] Il CSV viene letto correttamente
- [ ] L'algoritmo calcola i punteggi
- [ ] Il JSON viene generato
- [ ] Saper spiegare l'algoritmo di Jaccard
- [ ] Saper rispondere a domande tecniche

---

## 📚 File Forniti

1. **Podcast.java** - Classe modello
2. **CSVParser.java** - Lettore del catalogo CSV
3. **RisultatoRanking.java** - Risultato del calcolo
4. **AlgoritmoSimilarita.java** - Logica di Jaccard
5. **TestCompleto.java** - Test end-to-end

---

## 🎯 Prossimi Passi (Opzionale)

### Integrare con JSON delle Preferenze Utente

Invece di hardcodare le preferenze nel main, leggetele da un file JSON:

```java
// File: user_preferences.json
{
  "user_preferences": ["true crime", "investigazione"],
  "weights": {
    "true crime": 1.0,
    "investigazione": 0.9
  }
}
```

Usate una libreria come **Gson** per parsare il JSON.

---

## 💡 Suggerimenti

1. **Test con diversi input**: Cambiate i tag delle preferenze e verificate che i risultati siano sensati
2. **Debug**: Usate `System.out.println()` per capire cosa succede passo dopo passo
3. **Codice commentato**: Aggiungete commenti per spiegare la logica
4. **Coordinamento**: Assicuratevi che il frontend possa leggere il vostro JSON

---

## 🤝 Coordinamento con Altri Gruppi

### Con Gruppo 2 (JavaScript):
- ✅ Formato JSON concordato
- ✅ Nomi dei campi standardizzati
- ✅ Percorsi file consistenti

### Con Gruppo 3 (UI/UX):
- ✅ Percorsi immagini corretti
- ✅ Percorsi descrizioni corretti

### Con Gruppo 4 (Presentazione):
- ✅ Preparate esempi di demo
- ✅ Spiegate l'algoritmo in modo semplice

---

**Buon lavoro! 🚀**
