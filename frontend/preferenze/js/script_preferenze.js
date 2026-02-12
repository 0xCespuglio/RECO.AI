/**
 * RECO.AI - Podcast Edition
 * Script per la selezione delle preferenze utente e generazione user_preferences.json
 */

document.addEventListener('DOMContentLoaded', function() {
    try {
        // === SELEZIONE ELEMENTI DOM ===
        const tags = document.querySelectorAll('.tag');
        const submitBtn = document.getElementById('submitBtn');
        const resetBtn = document.getElementById('resetBtn');
        const algorithmSteps = document.getElementById('algorithmSteps');
        const stepsList = document.getElementById('stepsList');
        const progressFill = document.getElementById('progressFill');

        // Validazione elementi critici
        if (!submitBtn || !resetBtn) {
            throw new Error('Elementi pulsanti mancanti nel DOM');
        }

        if (tags.length === 0) {
            console.warn('Nessun tag trovato nella pagina');
            return;
        }

        // === INIZIALIZZAZIONE ===
        initializeTags();

        /**
         * Inizializza i tag con checkbox e gestori eventi
         */
        function initializeTags() {
            tags.forEach((tag, index) => {
                try {
                    // Evita duplicati se lo script viene ricaricato
                    if (tag.querySelector('input[type="checkbox"]')) return;

                    // Crea checkbox nascosta
                    const checkbox = createCheckbox();
                    tag.insertBefore(checkbox, tag.firstChild);
                    
                    // Gestori eventi
                    tag.addEventListener('click', (e) => handleTagClick(e, tag, checkbox));
                    tag.addEventListener('keypress', (e) => handleTagKeypress(e, tag, checkbox));
                    
                    // Accessibilità
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
            checkbox.style.cssText = 'display: none;';
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
            } catch (err) {
                console.error('Errore gestione click:', err);
            }
        }

        /**
         * Gestisce la pressione di Enter/Space sul tag (accessibilità)
         */
        function handleTagKeypress(event, tag, checkbox) {
            try {
                if (!event || !checkbox) return;
                
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    updateTagVisualState(tag, checkbox.checked);
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
                    tag.classList.add('selected');
                    tag.setAttribute('aria-checked', 'true');
                } else {
                    tag.classList.remove('selected');
                    tag.setAttribute('aria-checked', 'false');
                }
            } catch (err) {
                console.error('Errore aggiornamento stato visivo:', err);
            }
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

                    // Estrae il testo pulito dal data-value o dallo span
                    const dataValue = tag.getAttribute('data-value');
                    const spanText = tag.querySelector('span')?.textContent.trim();
                    const text = spanText || dataValue || '';
                    
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
         * Avvia l'animazione di elaborazione
         */
        function startProcessingAnimation() {
            if (!algorithmSteps || !stepsList || !progressFill) return;
            
            algorithmSteps.classList.add('visible');
            stepsList.innerHTML = '';
            progressFill.style.width = '0%';

            // Steps animati
            const steps = [
                { icon: '🔍', text: 'Analisi delle tue preferenze...', delay: 600 },
                { icon: '📊', text: 'Calcolo coefficiente di Jaccard...', delay: 1300 },
                { icon: '🤖', text: 'Applicazione algoritmo di matching...', delay: 2000 },
                { icon: '🎯', text: 'Identificazione podcast più rilevanti...', delay: 2700 },
                { icon: '✨', text: 'Generazione consigli personalizzati...', delay: 3400 }
            ];

            steps.forEach((step, i) => {
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.className = 'step-item';
                    div.innerHTML = `<span class="step-icon">${step.icon}</span> ${step.text}`;
                    stepsList.appendChild(div);

                    // Completa lo step precedente
                    if (i > 0) {
                        stepsList.children[i - 1].classList.add('completed');
                    }

                    // Aggiorna progress bar
                    progressFill.style.width = `${((i + 1) / steps.length * 100)}%`;

                    // Ultimo step: reindirizza
                    if (i === steps.length - 1) {
                        setTimeout(() => {
                            div.classList.add('completed');
                            setTimeout(() => {
                                window.location.href = '../risultato/risultato.html';
                            }, 800);
                        }, 500);
                    }
                }, step.delay);
            });
        }

        // === GESTORI PULSANTI ===

        /**
         * Pulsante Conferma
         */
        submitBtn.addEventListener('click', async function() {
            try {
                const preferences = getSelectedPreferences();
                
                // Validazione (richiede esattamente 3 selezioni)
                if (!validateSelections(preferences)) return;

                console.log('Generazione user_preferences.json:', { tags: preferences });
                
                // Salvataggio file JSON
                await savePreferencesJSON(preferences);
                
                // Avvia animazione elaborazione
                startProcessingAnimation();
            } catch (err) {
                console.error('Errore durante il salvataggio:', err);
                showErrorMessage('Si è verificato un errore. Riprova.');
            }
        });

        /**
         * Pulsante Reset
         */
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
                        // Animazione shake
                        tag.style.animation = 'shake 0.5s ease';
                        setTimeout(() => {
                            tag.style.animation = '';
                        }, 500);
                    } catch (err) {
                        console.error('Errore reset tag:', err);
                    }
                });
                
                console.log('Selezioni azzerate');
            } catch (err) {
                console.error('Errore durante il reset:', err);
                showErrorMessage('Errore durante il reset. Ricarica la pagina.');
            }
        });

        // === LOG INIZIALE ===
        console.log('✓ RECO.AI - Script preferenze caricato');
        console.log(`  - ${tags.length} tag disponibili`);
        console.log('  - Formato output: { "tags": ["tag1", "tag2", "tag3"] }');

    } catch (err) {
        console.error('Errore critico durante l\'inizializzazione:', err);
        alert('⚠️ Errore di inizializzazione\n\nRicarica la pagina. Se il problema persiste, controlla la console.');
    }
});
