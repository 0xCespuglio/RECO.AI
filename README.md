**RECO.AI**

Podcast Edition

*Sistema di Raccomandazione Content-Based*

**Guida di Project Management**

1\. Descrizione Tecnica del Progetto

RECO.AI -- Podcast Edition è un sistema di raccomandazione content-based
progettato per guidare gli utenti nella scoperta di podcast rilevanti
basandosi esclusivamente sulle caratteristiche intrinseche dei contenuti
e sulle preferenze dichiarate.

1.1 Obiettivo del Progetto

L\'obiettivo principale è comprendere e implementare la catena
concettuale alla base dei sistemi di raccomandazione:

-   **Feature → rappresentazione delle caratteristiche dei contenuti**

-   **Similarità → misurazione dell\'affinità tra preferenze e
    contenuti**

-   **Ranking → ordinamento dei risultati**

-   **Spiegabilità → motivazione trasparente delle raccomandazioni**

Il progetto punta sulla chiarezza, trasparenza e modularità piuttosto
che sulla complessità infrastrutturale. Il risultato finale deve essere
dimostrabile, funzionante e comprensibile.

1.2 Caratteristiche Tecniche

Dominio

Il sistema si concentra esclusivamente sui **podcast italiani**. Il
catalogo include 20-30 podcast famosi appartenenti a categorie diverse
(tecnologia, crime, attualità, sport, cultura, storia, scienza, ecc.).

Dataset e Feature

Il catalogo è rappresentato tramite un file CSV contenente le seguenti
informazioni per ciascun podcast:

-   **Titolo** -- nome del podcast

-   **Descrizione** -- breve presentazione

-   **Tag tematici** -- categorie principali (es. tecnologia, crime,
    sport)

-   **Pesi associati ai tag** -- valori semplici (es. 1.0, 0.5) che
    indicano la rilevanza di ciascun tag

-   **Link esterno** -- collegamento a Spotify, YouTube o altre
    piattaforme

Esempio di struttura CSV:

  --------------- ---------------------- ----------------- ---------- ------------------
  **Titolo**      **Descrizione**        **Tag**           **Pesi**   **Link**

  Podcast Tech    Innovazione digitale   tech, AI, startup 1.0, 0.8,  spotify.com/\...
                                                           0.5        
  --------------- ---------------------- ----------------- ---------- ------------------

Preferenze Utente

L\'utente esprime le proprie preferenze attraverso un\'interfaccia web
semplice e intuitiva (checkbox per selezionare le categorie di
interesse). Le preferenze vengono salvate in formato JSON per essere
elaborate dal backend.

Esempio di file JSON delle preferenze:

{ \"user_preferences\": \[\"tecnologia\", \"crime\", \"attualità\"\] }

Algoritmo di Similarità

Il sistema utilizza un algoritmo **content-based semplice e
spiegabile**, basato su:

-   **Similarità di Jaccard** applicata agli insiemi di tag (misura
    l\'intersezione divisa per l\'unione)

-   **Estensione con pesi** che permettono di dare maggiore rilevanza ad
    alcuni tag rispetto ad altri

Formula semplificata: per ogni podcast, si calcola un **punteggio di
affinità normalizzato (0-100%)** che rappresenta quanto il podcast
corrisponde alle preferenze dell\'utente.

L\'algoritmo è volutamente semplice per garantire:

-   Trasparenza e comprensibilità

-   Facilità di implementazione

-   Spiegabilità immediata dei risultati

Output

Il backend produce un file **output_ranking.json** contenente:

-   Lista ordinata dei podcast (dal più rilevante al meno rilevante)

-   Punteggio percentuale di affinità per ciascun podcast

-   Tag in comune tra preferenze utente e podcast (spiegabilità)

-   Informazioni complete del podcast (titolo, descrizione, link)

2\. Architettura della Soluzione

L\'architettura del sistema è progettata per mantenere una **separazione
netta dei ruoli** tra le diverse componenti, favorendo modularità,
manutenibilità e comprensione del flusso dati.

2.1 Pipeline del Sistema

Il flusso operativo segue questa pipeline sequenziale:

  ---------- ---------------- ----------------------- -------------------------
  **Fase**   **Componente**   **Responsabilità**      **Formato**

  **1**      **Catalogo       Contiene tutti i        **CSV** (facilmente
             Podcast**        podcast disponibili con modificabile)
                              metadati e feature      

  **2**      **Sito Web**     Raccoglie le preferenze **JSON** (salvato
                              dell\'utente (checkbox) localmente)

  **3**      **Backend Java** Legge CSV e JSON,       Input: CSV + JSON Output:
                              calcola similarità,     **output_ranking.json**
                              genera ranking          

  **4**      **Frontend Web** Legge solo JSON e       Input:
                              visualizza risultati    **output_ranking.json**
                              con interfaccia moderna 
  ---------- ---------------- ----------------------- -------------------------

2.2 Separazione dei Ruoli

Uno dei principi fondamentali dell\'architettura è la **separazione
netta tra backend e frontend**:

-   **Backend (Java)** → si occupa SOLO della logica di business
    (parsing, calcolo, ranking)

-   **Frontend (HTML/CSS/JS)** → si occupa SOLO della presentazione e
    dell\'interazione utente

Questo approccio permette di:

-   Lavorare in parallelo sui due blocchi

-   Sostituire o modificare una componente senza impattare l\'altra

-   Testare e debuggare in modo indipendente

-   Comprendere meglio il flusso dati

3\. Organizzazione dei Gruppi di Lavoro

La classe è divisa in **4 gruppi**, ciascuno con responsabilità
specifiche e ben definite. Questa suddivisione rispecchia la struttura
di un vero team di sviluppo aziendale.

🔹 Gruppo 1 -- Sviluppo Backend (JAVA)

Responsabilità Principali

-   Modellazione dei dati (classe Podcast)

-   Implementazione algoritmo di similarità

-   Generazione del ranking ordinato

-   Produzione del file di output JSON

Task Specifici

  -------- ----------------------------------- -----------------------------------
  **\#**   **Task**                            **Dettaglio**

  **1**    Definire struttura classe Podcast   Attributi: titolo, descrizione,
                                               tag\[\], pesi\[\], link

  **2**    Parsing del file CSV                Leggere il catalogo e creare
                                               oggetti Podcast

  **3**    Parsing del file JSON preferenze    Estrarre tag e pesi scelti
                                               dall\'utente

  **4**    Implementare calcolo affinità       Jaccard + pesi → punteggio 0-100%

  **5**    Ordinare i risultati                Dal punteggio più alto al più basso

  **6**    Generare output_ranking.json        Include: punteggio, tag comuni,
                                               info podcast
  -------- ----------------------------------- -----------------------------------

Output Atteso

-   **Codice Java funzionante e ben commentato**

-   **File output_ranking.json ben strutturato**

-   **Algoritmo spiegabile a voce** (saper descrivere come funziona)

🔹 Gruppo 2 -- Script e Logica (JavaScript)

**⚠️ IMPORTANTE: Questo gruppo NON si occupa di grafica, CSS o
animazioni.**

Responsabilità Principali

-   Parsing del file JSON di output

-   Logica applicativa lato client (filtri, ordinamento, gestione dati)

-   Gestione interazione utente (click, eventi)

-   Passaggio dati al popup di dettaglio

Task Specifici

  -------- ----------------------------------- -----------------------------------
  **\#**   **Task**                            **Dettaglio**

  **1**    Lettura output_ranking.json         Usare fetch() o XMLHttpRequest

  **2**    Filtrare podcast con affinità \> 0  Mostrare solo podcast rilevanti

  **3**    Gestione click sulle card           Catturare evento e passare dati al
                                               popup

  **4**    Separare logica da presentazione    NO CSS hardcoded negli script
  -------- ----------------------------------- -----------------------------------

Output Atteso

-   **Script JavaScript modulari e ben commentati**

-   **Logica chiara separata dalla presentazione**

-   **Nessun codice CSS/UI hardcoded**

🔹 Gruppo 3 -- Grafica e UI/UX (HTML / CSS / Animazioni)

Responsabilità Principali

-   Design dell\'interfaccia utente

-   Stile moderno e professionale

-   Animazioni ed effetti visivi

-   Esperienza utente fluida e intuitiva

Task Specifici

  -------- ----------------------------------- -----------------------------------
  **\#**   **Task**                            **Dettaglio**

  **1**    Layout a card dei podcast           Design responsive e moderno

  **2**    Ordinamento visivo per punteggio    I podcast migliori in evidenza

  **3**    Popup di dettaglio                  Descrizione completa, punteggio %,
                                               tag comuni, link

  **4**    Animazioni                          Hover, apertura popup, transizioni
                                               smooth
  -------- ----------------------------------- -----------------------------------

Output Atteso

-   **Sito web curato, moderno e professionale**

-   **Esperienza utente fluida e intuitiva**

-   **Animazioni leggere e coerenti**

🔹 Gruppo 4 -- Presentazione e Comunicazione

Responsabilità Principali

-   Raccontare il progetto in modo professionale

-   Preparare e guidare la demo live

-   Creare materiale di presentazione efficace

-   Spiegare scelte tecniche e logica algoritmica

Task Specifici

  -------- ----------------------------------- -----------------------------------
  **\#**   **Task**                            **Dettaglio**

  **1**    Slide chiare e narrative            No wall of text, solo concetti
                                               chiave

  **2**    Script orale (guida, non da         Preparare cosa dire, non leggere
           leggere)                            parola per parola

  **3**    Spiegare il problema risolto        Perché servono raccomandazioni?
                                               Quale bisogno?

  **4**    Spiegare la soluzione adottata      Architettura, flusso dati,
                                               separazione backend/frontend

  **5**    Spiegare l\'algoritmo               Jaccard, pesi, affinità - senza
                                               matematica complessa

  **6**    Demo live                           Mostrare il sistema in azione dal
                                               vivo

  **7**    Preparazione alle domande           Anticipare domande tecniche e
                                               organizzative
  -------- ----------------------------------- -----------------------------------

Output Atteso

-   **Slide complete e ben strutturate**

-   **Presentazione fluida e professionale**

-   **Capacità di rispondere alle domande con sicurezza**

4\. Linee Guida di Collaborazione

Il successo del progetto dipende dalla capacità dei gruppi di lavorare
in modo **coordinato e organizzato**. Ecco alcune linee guida
essenziali.

4.1 Utilizzo di Git/GitHub

Anche se il progetto non richiede flussi Git complessi, è fondamentale
utilizzare un repository condiviso per:

-   Mantenere traccia delle modifiche

-   Evitare conflitti e sovrascritture accidentali

-   Permettere a tutti di accedere all\'ultima versione

-   Dimostrare capacità di lavoro professionale

Comandi Git Essenziali

Mantenete il flusso semplice:

1\. git clone \<url-repository\>

→ Scarica il progetto sul tuo computer (una sola volta)

2\. git pull

→ Scarica le ultime modifiche fatte dagli altri (fai sempre prima di
lavorare)

3\. git add .

→ Prepara i file modificati per il commit

4\. git commit -m \"Descrizione breve della modifica\"

→ Salva le modifiche localmente con una descrizione

5\. git push

→ Carica le tue modifiche sul repository condiviso

4.2 Naming e Formati Condivisi

Per evitare confusione e incompatibilità, definite fin dall\'inizio:

-   **Nomi dei file:** catalogo_podcast.csv, user_preferences.json,
    output_ranking.json

-   **Struttura JSON:** accordatevi sui nomi dei campi (es. \'score\' vs
    \'punteggio\')

-   **Tag comuni:** usate sempre gli stessi termini (es. \'tecnologia\'
    vs \'tech\')

4.3 Comunicazione Continua

La comunicazione è fondamentale. Suggerimenti:

-   Create un gruppo WhatsApp/Telegram dedicato

-   Fate riunioni brevi settimanali (anche 15 minuti)

-   Comunicate problemi o blocchi immediatamente

-   Condividete progressi e successi

4.4 Testing e Validazione

Prima della presentazione finale:

-   **Gruppo 1** → testa il backend con diversi input JSON

-   **Gruppo 2+3** → verifica che il frontend legga correttamente il
    JSON

-   **Gruppo 4** → prova la demo live più volte prima della
    presentazione

5\. Obiettivo Finale

L\'obiettivo del progetto è creare una **demo funzionante, spiegabile e
ben presentata** che dimostri:

-   **Comprensione dei sistemi di raccomandazione content-based**

-   **Capacità di lavorare in team con ruoli definiti**

-   **Attenzione a UX, architettura software e chiarezza espositiva**

-   **Capacità di documentare e comunicare scelte tecniche**

Ricordate: **non serve un\'infrastruttura complessa**. Ciò che conta è
che il sistema funzioni, che sia comprensibile e che possiate spiegarlo
con chiarezza e sicurezza.

**Buon lavoro! 🚀**
