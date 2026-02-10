document.addEventListener('DOMContentLoaded', async () => {
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences'));
    const container = document.getElementById('resultsContainer');

    // Se non ci sono preferenze, reindirizza
    if (!userPrefs || !userPrefs.tematiche || userPrefs.tematiche.length === 0) {
        setTimeout(() => {
            alert('Nessuna preferenza trovata. Verrai reindirizzato alla pagina di selezione.');
            window.location.href = 'index.html';
        }, 500);
        return;
    }

    try {
        // Carica i podcast
        const response = await fetch('podcast.json');
        const allPodcasts = await response.json();

        // Calcola coefficiente di Jaccard per ogni podcast
        const scoredPodcasts = allPodcasts.map(podcast => {
            const userThemes = new Set(userPrefs.tematiche);
            const podcastThemes = new Set(podcast.tematiche);

            // Intersezione
            const intersection = new Set(
                [...podcastThemes].filter(theme => userThemes.has(theme))
            );

            // Unione
            const union = new Set([...podcastThemes, ...userThemes]);

            // Coefficiente di Jaccard
            const jaccardScore = intersection.size / union.size;

            // Punteggio aggiuntivo per matching esatti
            const exactMatchBonus = intersection.size === podcastThemes.size ? 0.1 : 0;

            const finalScore = Math.min(jaccardScore + exactMatchBonus, 1);
            const percentage = Math.round(finalScore * 100);

            return {
                ...podcast,
                score: finalScore,
                percent: percentage,
                matchingThemes: Array.from(intersection)
            };
        });

        // Ordina per punteggio (decrescente)
        scoredPodcasts.sort((a, b) => b.score - a.score);

        // Prendi i top 3
        const top3 = scoredPodcasts.slice(0, 3);

        // Renderizza i podcast
        container.innerHTML = top3.map((podcast, index) => `
            <div class="podcast-card" onclick="openModal('${podcast.id}')" data-rank="${index + 1}">
                <div class="score-badge">${podcast.percent}% compatibile</div>
                <img src="${podcast.immagine}" class="img-stondata-card" alt="${podcast.nome}">
                <h3>${podcast.nome}</h3>
                <p>${podcast.descrizione_breve.substring(0, 100)}...</p>
                <p style="color: var(--text-tertiary); font-size: 0.9rem; margin-top: 16px;">
                    <i class="fas fa-heart" style="color: #ef4444;"></i> 
                    ${podcast.matchingThemes.length} tematiche in comune
                </p>
            </div>
        `).join('');

        // Se non ci sono risultati sufficienti
        if (top3.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 16px;">Nessun podcast trovato</h3>
                    <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto;">
                        Prova a selezionare più tematiche o modifica le tue preferenze.
                    </p>
                    <button class="btn-submit" onclick="window.location.href='index.html'" style="margin-top: 30px;">
                        <i class="fas fa-edit"></i> Modifica preferenze
                    </button>
                </div>
            `;
        }

        // Crea funzioni globali per il modal
        window.openModal = (podcastId) => {
            const podcast = allPodcasts.find(p => p.id === podcastId);
            if (!podcast) return;

            // Trova il punteggio per questo podcast
            const scoredPodcast = scoredPodcasts.find(p => p.id === podcastId);

            document.getElementById('modalTitle').textContent = podcast.nome;
            document.getElementById('modalDescription').textContent = podcast.descrizione_breve;
            document.getElementById('modalImage').src = podcast.immagine;
            document.getElementById('modalCompatibility').textContent =
                scoredPodcast ? `${scoredPodcast.percent}% compatibile` : 'Compatibilità non disponibile';

            // Renderizza i tag
            const tagsContainer = document.getElementById('modalTags');
            tagsContainer.innerHTML = podcast.tematiche.map(theme => {
                const isMatched = userPrefs.tematiche.includes(theme);
                return `
                    <span class="tag-mini" style="
                        ${isMatched ?
                        'background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(34, 197, 94, 0.15)); border-color: rgba(16, 185, 129, 0.3);' :
                        'background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);'
                    }
                    ">
                        ${isMatched ? '<i class="fas fa-check" style="margin-right: 5px; color: #10b981;"></i>' : ''}
                        ${theme}
                    </span>
                `;
            }).join('');

            // Mostra il modal
            document.getElementById('modal').classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        window.closeModal = () => {
            document.getElementById('modal').classList.remove('active');
            document.body.style.overflow = 'auto';

            // Chiudi con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        };

        // Chiudi il modal cliccando all'esterno o premendo ESC
        document.querySelector('.modal-overlay').addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('modal').classList.contains('active')) {
                closeModal();
            }
        });

        // Aggiungi badge per il ranking (opzionale)
        document.querySelectorAll('.podcast-card').forEach((card, index) => {
            if (index === 0) {
                const badge = document.createElement('div');
                badge.innerHTML = '<i class="fas fa-crown" style="color: #fbbf24;"></i> Top consiglio';
                badge.style.cssText = `
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: rgba(251, 191, 36, 0.1);
                    color: #b45309;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    border: 1px solid rgba(251, 191, 36, 0.3);
                `;
                card.appendChild(badge);
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento dei podcast:", error);
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 16px;">Si è verificato un errore</h3>
                <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto;">
                    Impossibile caricare i podcast al momento. Riprova più tardi.
                </p>
                <button class="btn-submit" onclick="window.location.reload()" style="margin-top: 30px;">
                    <i class="fas fa-sync-alt"></i> Ricarica pagina
                </button>
            </div>
        `;
    }
});