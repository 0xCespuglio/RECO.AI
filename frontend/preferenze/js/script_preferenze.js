// script_preferenze.js

document.addEventListener('DOMContentLoaded', () => {
    const tagsContainer = document.querySelector('.tags-grid');
    const submitBtn     = document.getElementById('submitBtn');
    const resetBtn      = document.getElementById('resetBtn');

    if (!tagsContainer || !submitBtn || !resetBtn) return;

    // --- SELEZIONE TAG ---
    tagsContainer.addEventListener('click', (e) => {
        const tag = e.target.closest('.tag');
        if (!tag) return;

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

    // --- RESET ---
    resetBtn.addEventListener('click', () => {
        if (!confirm('Vuoi davvero azzerare tutte le selezioni?')) return;
        document.querySelectorAll('.tag').forEach(t => {
            t.classList.remove('selected');
            t.setAttribute('aria-checked', 'false');
        });
    });

    // --- SUBMIT ---
    submitBtn.addEventListener('click', async () => {
        const prefs = Array.from(document.querySelectorAll('.tag.selected'))
            .map(t => t.getAttribute('data-value') || t.querySelector('span')?.textContent.trim());

        if (prefs.length !== 3) {
            alert('Seleziona esattamente 3 preferenze');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvataggio...';

            const response = await fetch('http://localhost:5000/save-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tags: prefs })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Errore del server');
            }

            // Reindirizza automaticamente alla pagina dei risultati
            window.location.href = '../risultato/risultato.html';

        } catch (err) {
            console.error('Errore nel salvataggio:', err);
            alert('Impossibile salvare le preferenze. Assicurati che il server sia avviato.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Scopri i podcast <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    });
});