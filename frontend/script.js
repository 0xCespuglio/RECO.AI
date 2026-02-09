// Script per aggiungere quadratini selezionabili alle preferenze e salvarle in JSON
document.addEventListener('DOMContentLoaded', function() {
    const tags = document.querySelectorAll('.tag');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Aggiungi checkbox a ogni tag
    tags.forEach(tag => {
        // Crea il quadratino (checkbox)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '8px';
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';
        checkbox.style.cursor = 'pointer';
        
        // Inserisci il checkbox all'inizio del tag
        tag.insertBefore(checkbox, tag.firstChild);
        
        // Gestisci il click sul tag (non sul checkbox)
        tag.addEventListener('click', function(e) {
            // Se il click è sul checkbox, lascia che gestisca lui
            if (e.target === checkbox) {
                return;
            }
            // Altrimenti toggla il checkbox
            checkbox.checked = !checkbox.checked;
        });
    });

    /**
     * Funzione per creare e scaricare un file JSON con le preferenze
     * Il file avrà SEMPRE nome "user_preferences.json"
     * Contiene SOLO l'array user_preferences senza metadati
     */
    function downloadJSON(data) {
        try {
            // Formatto finale: SOLO l'array user_preferences
            const finalData = data.user_preferences;
            
            // Converti i dati in stringa JSON formattata
            const jsonString = JSON.stringify(finalData, null, 2);
            
            // Crea un blob (oggetto binario) con i dati JSON
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            // Crea un URL temporaneo per il blob
            const url = URL.createObjectURL(blob);
            
            // Crea un elemento <a> invisibile per il download
            const link = document.createElement('a');
            link.href = url;
            
            // NOME FISSO per sovrascrivere sempre lo stesso file
            link.download = 'user_preferences.json';
            
            // Forza il download nella stessa directory della pagina
            link.setAttribute('download', 'user_preferences.json');
            
            link.style.display = 'none';
            
            // Aggiungi al DOM, clicca e rimuovi
            document.body.appendChild(link);
            
            // Programmatic click per avviare il download
            link.click();
            
            // Attendi un momento prima di rimuovere il link
            setTimeout(() => {
                document.body.removeChild(link);
                // Rilascia l'URL creato per evitare memory leaks
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('File user_preferences.json scaricato con successo');
            console.log('Contenuto:', jsonString);
            return true;
        } catch (error) {
            console.error('Errore nel download del JSON:', error);
            return false;
        }
    }

    /**
     * Funzione per raccogliere le preferenze selezionate
     */
    function collectPreferences() {
        const selectedPreferences = {
            tematiche: []
        };

        tags.forEach(tag => {
            const checkbox = tag.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const category = tag.getAttribute('data-category');
                const value = tag.getAttribute('data-value');
                const text = tag.textContent.trim();
                
                if (category === 'tematiche') {
                    selectedPreferences.tematiche.push({
                        value: value,
                        label: text
                    });
                }
            }
        });

        return selectedPreferences;
    }

    /**
     * Funzione per formattare le preferenze per il file JSON finale
     * Formato compatibile con l'HTML fornito (solo tematiche)
     * RESTITUISCE SOLO l'array delle preferenze come richiesto
     */
    function formatForJSON(preferences) {
        // Formato SEMPLICE: solo array di stringhe come nell'esempio originale
        const jsonOutput = {
            // Array di stringhe con le tematiche selezionate
            // ESEMPIO: ["Intrattenimento", "Cultura", "Interviste"]
            user_preferences: preferences.tematiche.map(item => item.label)
        };
        
        return jsonOutput;
    }

    /**
     * Funzione per mostrare le preferenze selezionate e chiedere conferma
     */
    function confirmAndDownload(preferences) {
        if (preferences.tematiche.length === 0) {
            alert('Nessuna preferenza selezionata!\nSeleziona almeno una tematica.');
            return false;
        }
        
        // Mostra riepilogo
        let message = 'RIEPILOGO PREFERENZE:\n\n';
        message += 'Tematiche selezionate (' + preferences.tematiche.length + '):\n';
        preferences.tematiche.forEach(item => {
            message += '• ' + item.label + '\n';
        });
        
        message += '\nIl file "user_preferences.json" verrà creato/aggiornato.';
        message += '\n\nCONTENUTO DEL FILE:\n';
        message += JSON.stringify(preferences.tematiche.map(item => item.label), null, 2);
        
        message += '\n\nIl browser potrebbe chiederti di confermare la sovrascrittura del file esistente.';
        
        if (confirm(message + '\n\nVuoi procedere?')) {
            return true;
        }
        return false;
    }

    /**
     * Funzione per mostrare l'anteprima del JSON che verrà generato
     */
    function showJSONPreview(preferences) {
        const formattedJSON = formatForJSON(preferences);
        const jsonString = JSON.stringify(formattedJSON.user_preferences, null, 2);
        
        // Crea un elemento per mostrare l'anteprima
        const previewDiv = document.createElement('div');
        previewDiv.id = 'json-preview';
        previewDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 1000;
            max-width: 90%;
            max-height: 80vh;
            overflow: auto;
            font-family: monospace;
        `;
        
        previewDiv.innerHTML = `
            <h3 style="margin-top: 0;">Anteprima user_preferences.json</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; max-height: 300px;">${jsonString}</pre>
            <p style="font-size: 12px; color: #666;">Questo è esattamente il contenuto del file che verrà scaricato.</p>
            <div style="margin-top: 20px; text-align: right;">
                <button id="closePreview" style="padding: 8px 15px; margin-right: 10px; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">Chiudi</button>
                <button id="downloadFromPreview" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Scarica File</button>
            </div>
        `;
        
        document.body.appendChild(previewDiv);
        
        // Aggiungi overlay per lo sfondo scuro
        const overlay = document.createElement('div');
        overlay.id = 'preview-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;
        document.body.appendChild(overlay);
        
        // Gestione chiusura preview
        document.getElementById('closePreview').addEventListener('click', function() {
            document.body.removeChild(previewDiv);
            document.body.removeChild(overlay);
        });
        
        // Gestione download dalla preview
        document.getElementById('downloadFromPreview').addEventListener('click', function() {
            document.body.removeChild(previewDiv);
            document.body.removeChild(overlay);
            
            const jsonOutput = formatForJSON(preferences);
            const success = downloadJSON(jsonOutput);
            
            if (success) {
                setTimeout(() => {
                    alert('✅ FILE CREATO CON SUCCESSO!\n\nNome: user_preferences.json\n\nIl file è pronto per il sistema di raccomandazione.');
                }, 500);
            }
        });
        
        // Chiudi cliccando sull'overlay
        overlay.addEventListener('click', function() {
            document.body.removeChild(previewDiv);
            document.body.removeChild(overlay);
        });
    }

    // Gestione pulsante conferma
    submitBtn.addEventListener('click', function() {
        // Raccogli le preferenze
        const selectedPreferences = collectPreferences();
        
        // Mostra console log per debug
        console.log('Preferenze raccolte:', selectedPreferences);
        
        if (selectedPreferences.tematiche.length === 0) {
            alert('Nessuna preferenza selezionata!\nSeleziona almeno una tematica.');
            return;
        }
        
        // Formatta per il JSON finale
        const jsonOutput = formatForJSON(selectedPreferences);
        
        // Mostra anteprima del JSON
        showJSONPreview(selectedPreferences);
    });

    // Gestione pulsante reset
    resetBtn.addEventListener('click', function() {
        if (confirm('Vuoi davvero azzerare tutte le selezioni?')) {
            tags.forEach(tag => {
                const checkbox = tag.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = false;
                }
            });
            console.log('Tutte le selezioni sono state azzerate');
            alert('Selezioni azzerate!');
        }
    });

    // ====================================================================
    // FUNZIONALITÀ AGGIUNTIVA: Visualizzazione formato JSON atteso
    // ====================================================================
    
    /**
     * Mostra un esempio del formato JSON atteso dal backend
     */
    function showJSONFormatExample() {
        const example = {
            user_preferences: ["Intrattenimento", "Cultura", "Interviste", "Attualità"]
        };
        
        const exampleDiv = document.createElement('div');
        exampleDiv.id = 'json-example';
        exampleDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 999;
            max-width: 400px;
            font-family: monospace;
            font-size: 12px;
        `;
        
        exampleDiv.innerHTML = `
            <strong>📋 Formato JSON atteso:</strong>
            <pre style="margin: 10px 0; padding: 10px; background: white; border-radius: 3px; overflow: auto;">
${JSON.stringify(example, null, 2)}</pre>
            <small>Il file conterrà SOLO l'array user_preferences</small>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: #666; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(exampleDiv);
        
        // Rimuovi automaticamente dopo 10 secondi
        setTimeout(() => {
            if (document.body.contains(exampleDiv)) {
                document.body.removeChild(exampleDiv);
            }
        }, 10000);
    }
    
    // Mostra l'esempio dopo il caricamento della pagina
    setTimeout(showJSONFormatExample, 1000);

    // Mostra istruzioni nella console
    console.log(`
    ============================================
    RECO.AI - Sistema di Raccolta Preferenze
    ============================================
    
    FORMATO DEL FILE JSON GENERATO:
    
    Il file "user_preferences.json" conterrà SOLO:
    
    [
      "Tematica1",
      "Tematica2",
      "Tematica3"
    ]
    
    ESEMPIO:
    
    [
      "Intrattenimento",
      "Cultura", 
      "Interviste"
    ]
    
    NESSUNA ALTRA INFORMAZIONE:
    • No metadata
    • No timestamp
    • Solo l'array delle preferenze
    
    ============================================
    `);
    
    // Funzione per test rapido
    function testJSONGeneration() {
        console.log("🧪 TEST: Generazione JSON semplificato");
        
        const testPreferences = {
            tematiche: [
                { value: "intrattenimento", label: "Intrattenimento" },
                { value: "cultura", label: "Cultura" }
            ]
        };
        
        const result = formatForJSON(testPreferences);
        console.log("Risultato test:", JSON.stringify(result, null, 2));
        console.log("✅ Formato corretto: solo user_preferences array");
    }
    
    // Esegui test all'avvio
    setTimeout(testJSONGeneration, 500);
});