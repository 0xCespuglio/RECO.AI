// script_preferenze.js - SOLO delega eventi, TUTTO IL RESTO IDENTICO

document.addEventListener('DOMContentLoaded', () => {
    const tagsContainer = document.querySelector('.tags-grid');  // oppure '#tematicheGrid'
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    let modal = null;  // lasciato com'era

    if (!tagsContainer || !submitBtn || !resetBtn) return;

    // --- UNICO LISTENER (invece di 34) ---
    tagsContainer.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag');
        if (!tag) return;

        // --- da qui in poi è IDENTICO all'originale ---
        const selected = document.querySelectorAll('.tag.selected').length;
        if (tag.classList.contains('selected')) {
            tag.classList.remove('selected');
            tag.setAttribute('aria-checked', 'false');
            return;
        }
        if (selected >= 3) {
            alert('Puoi selezionare al massimo 3 preferenze');
            return;
        }
        tag.classList.add('selected');
        tag.setAttribute('aria-checked', 'true');
    });

    // --- RESET (identico all'originale) ---
    resetBtn.addEventListener('click', () => {
        if (!confirm('Vuoi davvero azzerare tutte le selezioni?')) return;
        document.querySelectorAll('.tag').forEach(t => {
            t.classList.remove('selected');
            t.setAttribute('aria-checked', 'false');
        });
    });

    // --- TUTTE LE FUNZIONI DI SALVATAGGIO E REDIRECT sono IDENTICHE all'originale ---
    function getSelectedPreferences() {
        return Array.from(document.querySelectorAll('.tag.selected'))
            .map(t => t.getAttribute('data-value') || t.querySelector('span')?.textContent.trim());
    }

    function buildJSON(preferences) {
        const safe = preferences.filter(p => typeof p === 'string' && p.trim());
        return JSON.stringify({ tags: safe }, null, 2);
    }

    function downloadFallback(fileName, content) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 150);
    }

    async function saveWithFilePicker(fileName, content) {
        const opts = {
            suggestedName: fileName,
            types: [{ description: 'File JSON', accept: { 'application/json': ['.json'] } }]
        };
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
    }

    function showModal() {
        return new Promise(resolve => {
            window.confirm('Se il browser ha mostrato la finestra di salvataggio, premi OK per "Ho salvato" oppure Annulla per "Procedi comunque".');
            resolve();
        });
    }

    // --- SUBMIT (identico all'originale) ---
    submitBtn.addEventListener('click', async () => {
        const prefs = getSelectedPreferences();
        if (prefs.length !== 3) {
            alert('Seleziona esattamente 3 preferenze');
            return;
        }

        const json = buildJSON(prefs);
        const filename = 'user_preferences.json';

        if (window.showSaveFilePicker) {
            try {
                await saveWithFilePicker(filename, json);
                window.location.href = '../risultato/risultato.html';
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.warn('File picker fallito, uso download:', err);
            }
        }

        try {
            downloadFallback(filename, json);
        } catch (err) {
            console.error('Download fallback fallito', err);
            alert('Impossibile avviare il download. Riprova.');
            return;
        }

        await showModal();
        window.location.href = '../risultato/risultato.html';
    });
});