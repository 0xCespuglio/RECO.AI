// RECO.AI - Podcast Edition - Gruppo Javascript
// Script per la selezione delle preferenze utente e generazione user_preferences.json

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Selezione elementi DOM con validazione
        const tags = document.querySelectorAll('.tag');
        const submitBtn = document.getElementById('submitBtn');
        const resetBtn = document.getElementById('resetBtn');
        const feedbackSection = document.getElementById('feedback');
        const feedbackList = document.getElementById('feedbackList');
        const feedbackCount = document.getElementById('feedbackCount');

        // Validazione elementi critici
        if (!submitBtn || !resetBtn) {
            throw new Error('Elementi pulsanti mancanti nel DOM');
        }

        if (tags.length === 0) {
            console.warn('Nessun tag trovato nella pagina');
            return;
        }

        // Inizializzazione interfaccia
        initializeTags();

        /**
         * Inizializza i tag con checkbox e gestori eventi
         */
        function initializeTags() {
            tags.forEach((tag, index) => {
                try {
                    // Evita duplicati se lo script viene ricaricato
                    if (tag.querySelector('input[type="checkbox"]')) return;

                    // Crea e configura checkbox
                    const checkbox = createCheckbox();
                    tag.insertBefore(checkbox, tag.firstChild);
                    
                    // Gestori eventi
                    tag.addEventListener('click', (e) => handleTagClick(e, tag, checkbox));
                    tag.addEventListener('keypress', (e) => handleTagKeypress(e, checkbox));
                    
                    // Aggiungi attributo aria per accessibilità
                    tag.setAttribute('aria-checked', 'false');
                    tag.setAttribute('tabindex', '0');
                    tag.setAttribute('role', 'checkbox');
                } catch (err) {
                    console.error(`Errore inizializzazione tag ${index}:`, err);
                }
            });
        }

        /**
         * Crea un elemento checkbox configurato
         */
        function createCheckbox() {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.cssText = 'margin-right: 8px; width: 18px; height: 18px; cursor: pointer;';
            checkbox.setAttribute('aria-hidden', 'true');
            return checkbox;
        }

        /**
         * Gestisce il click sul tag
         */
        function handleTagClick(event, tag, checkbox) {
            try {
                if (!event || !tag || !checkbox) return;
                if (event.target === checkbox) return;
                
                checkbox.checked = !checkbox.checked;
                updateTagVisualState(tag, checkbox.checked);
                updateFeedback();
            } catch (err) {
                console.error('Errore gestione click:', err);
            }
        }

        /**
         * Gestisce la pressione di Enter/Space sul tag (accessibilità)
         */
        function handleTagKeypress(event, checkbox) {
            try {
                if (!event || !checkbox) return;
                
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    updateTagVisualState(event.currentTarget, checkbox.checked);
                    updateFeedback();
                }
            } catch (err) {
                console.error('Errore gestione tastiera:', err);
            }
        }

        /**
         * Aggiorna lo stato visivo del tag
         */
        function updateTagVisualState(tag, isChecked) {
            if (!tag) return;

            try {
                if (isChecked) {
                    tag.style.backgroundColor = '#e3f2fd';
                    tag.style.border = '2px solid #2196F3';
                    tag.style.fontWeight = 'bold';
                    tag.setAttribute('aria-checked', 'true');
                } else {
                    tag.style.backgroundColor = '';
                    tag.style.border = '';
                    tag.style.fontWeight = '';
                    tag.setAttribute('aria-checked', 'false');
                }
            } catch (err) {
                console.error('Errore aggiornamento stato visivo:', err);
            }
        }

        /**
         * Aggiorna il feedback visivo delle selezioni
         */
        function updateFeedback() {
            try {
                const selected = getSelectedPreferences();
                
                if (!feedbackSection) return;

                if (selected.length === 0) {
                    feedbackSection.style.display = 'none';
                    return;
                }

                // Mostra feedback
                feedbackSection.style.display = 'block';
                
                if (feedbackList) {
                    feedbackList.innerHTML = selected
                        .map(pref => `<li>${escapeHTML(pref)}</li>`)
                        .join('');
                }
                
                if (feedbackCount) {
                    feedbackCount.textContent = selected.length;
                }
            } catch (err) {
                console.error('Errore aggiornamento feedback:', err);
            }
        }

        /**
         * Escape HTML per prevenire XSS
         */
        function escapeHTML(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        /**
         * Raccoglie le preferenze selezionate
         */
        function getSelectedPreferences() {
            const selected = [];
            
            tags.forEach(tag => {
                try {
                    const checkbox = tag.querySelector('input[type="checkbox"]');
                    if (!checkbox || !checkbox.checked) return;

                    // Estrae il testo pulito (senza checkbox)
                    const clone = tag.cloneNode(true);
                    const cloneCheckbox = clone.querySelector('input');
                    if (cloneCheckbox) {
                        clone.removeChild(cloneCheckbox);
                    }
                    
                    const text = clone.textContent.trim();
                    if (text) {
                        selected.push(text);
                    }
                } catch (err) {
                    console.error('Errore raccolta preferenza:', err);
                }
            });
            
            return selected;
        }

        /**
         * Salva il file JSON con le preferenze
         */
        async function savePreferencesJSON(preferences) {
            if (!Array.isArray(preferences) || preferences.length === 0) {
                throw new Error('Preferenze non valide');
            }

            const fileName = "user_preferences.json";
            
            // Formato compatto con validazione
            const tagsLine = preferences
                .filter(tag => typeof tag === 'string' && tag.trim())
                .map(tag => JSON.stringify(tag))
                .join(', ');
            
            const jsonString = `{\n  "tags": [${tagsLine}]\n}`;

            try {
                // Metodo moderno: File System Access API
                if (window.showSaveFilePicker) {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                        types: [{
                            description: 'File JSON',
                            accept: { 'application/json': ['.json'] },
                        }],
                    });
                    
                    const writable = await handle.createWritable();
                    await writable.write(jsonString);
                    await writable.close();
                    
                    showSuccessMessage('File salvato con successo nella posizione selezionata!');
                } else {
                    // Fallback automatico per browser non supportati
                    downloadJSONFile(jsonString, fileName);
                }
            } catch (err) {
                // L'utente ha annullato il salvataggio
                if (err.name === 'AbortError') {
                    console.log('Salvataggio annullato dall\'utente');
                    return;
                }
                
                // Errore durante il salvataggio - usa fallback
                console.warn('Errore File System API, uso fallback:', err);
                try {
                    downloadJSONFile(jsonString, fileName);
                } catch (fallbackErr) {
                    console.error('Errore anche con fallback:', fallbackErr);
                    showErrorMessage('Impossibile salvare il file. Riprova.');
                }
            }
        }

        /**
         * Download del file JSON (metodo fallback)
         */
        function downloadJSONFile(content, fileName) {
            if (!content || !fileName) {
                throw new Error('Parametri download non validi');
            }

            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            // Pulizia con timeout per compatibilità browser
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
            
            showSuccessMessage('File scaricato! Spostalo nella cartella del progetto.');
        }

        /**
         * Mostra messaggio di successo
         */
        function showSuccessMessage(message) {
            if (!message) return;
            alert(`✓ ${message}\n\nIl file user_preferences.json è pronto per il backend Java.`);
        }

        /**
         * Mostra messaggio di errore
         */
        function showErrorMessage(message) {
            if (!message) return;
            alert(`⚠️ Errore\n\n${message}`);
        }

        /**
         * Valida le selezioni prima del salvataggio
         */
        function validateSelections(preferences) {
            if (!Array.isArray(preferences)) {
                showErrorMessage('Errore interno: formato preferenze non valido.');
                return false;
            }

            const count = preferences.length;
            const required = 3;

            if (count !== required) {
                let message = '⚠️ Selezione non valida\n\n';
                
                if (count === 0) {
                    message += 'Non hai selezionato nessuna preferenza.\n';
                } else if (count < required) {
                    message += `Hai selezionato solo ${count} preferenza${count === 1 ? '' : 'e'}.\n`;
                } else {
                    message += `Hai selezionato ${count} preferenze.\n`;
                }
                
                message += `\nDevi selezionare esattamente ${required} preferenze per continuare.\n`;
                message += '\n✓ Le tue selezioni attuali sono state mantenute.';
                
                alert(message);
                return false;
            }
            
            return true;
        }

        // === GESTORI PULSANTI ===

        // Pulsante Conferma
        submitBtn.addEventListener('click', async function() {
            try {
                const preferences = getSelectedPreferences();
                
                // Validazione
                if (!validateSelections(preferences)) return;

                // Creazione oggetto JSON
                const data = { tags: preferences };
                
                console.log('Generazione user_preferences.json:', data);
                
                // Salvataggio file
                await savePreferencesJSON(preferences);
            } catch (err) {
                console.error('Errore durante il salvataggio:', err);
                showErrorMessage('Si è verificato un errore. Riprova.');
            }
        });

        // Pulsante Reset
        resetBtn.addEventListener('click', function() {
            try {
                const confirmReset = confirm('Vuoi davvero azzerare tutte le selezioni?');
                
                if (!confirmReset) return;

                tags.forEach(tag => {
                    try {
                        const checkbox = tag.querySelector('input[type="checkbox"]');
                        if (checkbox) {
                            checkbox.checked = false;
                            updateTagVisualState(tag, false);
                        }
                    } catch (err) {
                        console.error('Errore reset tag:', err);
                    }
                });
                
                updateFeedback();
                console.log('Selezioni azzerate');
            } catch (err) {
                console.error('Errore durante il reset:', err);
                showErrorMessage('Errore durante il reset. Ricarica la pagina.');
            }
        });

        // Log iniziale
        console.log('✓ RECO.AI - Script caricato e pronto');
        console.log(`  - ${tags.length} tag disponibili`);
        console.log('  - Formato output: { "tags": ["tag1", "tag2", ...] }');

    } catch (err) {
        console.error('Errore critico durante l\'inizializzazione:', err);
        alert('⚠️ Errore di inizializzazione\n\nRicarica la pagina. Se il problema persiste, controlla la console.');
    }
});