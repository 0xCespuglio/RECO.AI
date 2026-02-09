// Script per aggiungere quadratini selezionabili alle preferenze e salvarle in JSON
// RECO.AI - Podcast Edition - Gruppo Javascript

document.addEventListener('DOMContentLoaded', function() {
    const tags = document.querySelectorAll('.tag');
    const submitBtn = document.getElementById('submitBtn');
    
    // Aggiungi checkbox a ogni tag per una migliore UX
    tags.forEach(tag => {
        // Evita duplicati se lo script viene ricaricato
        if (tag.querySelector('input[type="checkbox"]')) return;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '8px';
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';
        checkbox.style.cursor = 'pointer';
        
        // Inserisci il checkbox all'inizio del tag
        tag.insertBefore(checkbox, tag.firstChild);
        
        // Gestisci il click sull'intero div del tag
        tag.addEventListener('click', function(e) {
            // Se clicco direttamente il checkbox, non faccio nulla (lo gestisce il browser)
            if (e.target === checkbox) return;
            
            // Altrimenti inverto lo stato del checkbox
            checkbox.checked = !checkbox.checked;
            
            // Aggiungo un feedback visivo alla classe del tag
            if(checkbox.checked) {
                tag.style.backgroundColor = '#e0e0e0'; // Leggero grigio per indicare selezione
                tag.style.border = '1px solid #333';
            } else {
                tag.style.backgroundColor = '';
                tag.style.border = '';
            }
        });
    });

    /**
     * Funzione principale per salvare il file.
     * Tenta di usare la moderna API "showSaveFilePicker" per permettere all'utente
     * di salvare direttamente nella cartella del progetto.
     */
    async function saveJSON(data) {
        const fileName = "user_preferences.json";
        const jsonString = JSON.stringify(data, null, 2);

        try {
            // METODO 1: File System Access API (Più moderno, permette di scegliere la cartella)
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'JSON File',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                
                const writable = await handle.createWritable();
                await writable.write(jsonString);
                await writable.close();
                
                alert("File salvato con successo! Assicurati di averlo messo nella cartella del progetto.");
            } else {
                // Se il browser non supporta la API sopra, usiamo il metodo classico
                throw new Error("API non supportata");
            }
        } catch (err) {
            // METODO 2: Fallback (Download classico nella cartella Download)
            // Questo scatta se l'utente annulla il salvataggio o se il browser è vecchio
            if (err.name !== 'AbortError') { // Ignora se l'utente ha cliccato "Annulla"
                console.warn("Uso metodo fallback per il download:", err);
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                
                // Pulizia
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                alert("Il file è stato scaricato nella tua cartella Download.\nPer favore SPOSTALO manualmente nella cartella del progetto Javascript.");
            }
        }
    }

    // Gestione del click sul pulsante "Conferma selezione"
    submitBtn.addEventListener('click', function() {
        // 1. Raccogli i dati selezionati
        const selectedPreferences = [];
        const allTags = document.querySelectorAll('.tag');
        
        allTags.forEach(tag => {
            const checkbox = tag.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                // Secondo il README, dobbiamo salvare i termini.
                // Usiamo il testo visibile (es. "Intrattenimento") pulito dagli spazi
                // Nota: Rimuoviamo il checkbox dal testo clonato per avere solo la parola
                const clone = tag.cloneNode(true);
                const cloneCheckbox = clone.querySelector('input');
                if(cloneCheckbox) clone.removeChild(cloneCheckbox);
                
                const cleanText = clone.textContent.trim();
                selectedPreferences.push(cleanText);
            }
        });

        // 2. Validazione: deve aver selezionato almeno qualcosa?
        if (selectedPreferences.length === 0) {
            alert("Per favore seleziona almeno una preferenza prima di confermare.");
            return;
        }

        // 3. Log di controllo (come richiesto per il Gruppo 2+3 che deve leggere il file)
        console.log("Generazione JSON in corso...", selectedPreferences);

        // 4. Avvia il salvataggio
        saveJSON(selectedPreferences);
    });

    // Console log informativo per il team
    console.log(`
    ============================================
    RECO.AI - Gruppo Javascript
    ============================================
    Script caricato.
    Pronto a generare "user_preferences.json"
    nel formato array semplice: ["Tag1", "Tag2"]
    ============================================
    `);
});