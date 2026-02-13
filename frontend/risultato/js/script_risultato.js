/**
 * RECO.AI - Sistema di Raccomandazione Podcast
 * Script principale per caricamento e visualizzazione dei podcast
 */

// === ELEMENTI DOM PRINCIPALI ===
let podcastsContainer = null;
let loadingElement = null;
let errorElement = null;
let errorMessageElement = null;
let modal = null;

/**
 * Funzione principale eseguita al caricamento della pagina
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inizializzazione RECO.AI...');
    
    // Inizializza gli elementi DOM
    initDOMElements();
    
    // Carica i dati dei podcast
    loadPodcasts();
});

/**
 * Inizializza i riferimenti agli elementi DOM
 */
function initDOMElements() {
    podcastsContainer = document.getElementById('podcasts-container');
    loadingElement = document.getElementById('loading');
    errorElement = document.getElementById('error');
    errorMessageElement = document.getElementById('error-message');
    modal = document.getElementById('modal');
    
    if (!podcastsContainer) {
        console.error('Elemento #podcasts-container non trovato!');
    }
}

/**
 * Carica i dati dei podcast dal file JSON
 */
async function loadPodcasts() {
    try {
        console.log('Caricamento dati da output_ranking.json...');
        
        // Effettua la richiesta al file JSON
        const response = await fetch('../../data/output_ranking.json');
        
        // Controlla se la risposta è valida
        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Parsing dei dati JSON
        const data = await response.json();
        
        // Controlla la struttura dei dati
        if (!data.ranking || !Array.isArray(data.ranking)) {
            throw new Error('Formato JSON non valido: proprietà "ranking" mancante o non array');
        }
        
        console.log(`Dati caricati: ${data.ranking.length} podcast trovati`);
        
        // Nascondi il messaggio di caricamento
        hideLoading();
        
        // Visualizza i podcast
        displayPodcasts(data.ranking);
        
    } catch (error) {
        console.error('Errore nel caricamento dei podcast:', error);
        showError(`Impossibile caricare i dati: ${error.message}`);
    }
}

/**
 * Nasconde il messaggio di caricamento
 */
function hideLoading() {
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

/**
 * Mostra un messaggio di errore
 * @param {string} message - Messaggio di errore da visualizzare
 */
function showError(message) {
    hideLoading();
    
    if (errorElement && errorMessageElement) {
        errorMessageElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Visualizza i podcast nella pagina
 * @param {Array} podcasts - Array di podcast da visualizzare
 */
function displayPodcasts(podcasts) {
    if (!podcastsContainer) {
        console.error('Contenitore podcast non disponibile');
        return;
    }
    
    // Svuota il contenitore
    podcastsContainer.innerHTML = '';
    
    // Se non ci sono podcast, mostra messaggio
    if (podcasts.length === 0) {
        podcastsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Nessun podcast disponibile.</p>';
        return;
    }
    
    // Crea e aggiunge ogni podcast
    podcasts.forEach((podcast, index) => {
        const podcastElement = createPodcastElement(podcast, index + 1);
        podcastsContainer.appendChild(podcastElement);
    });
    
    console.log(`Visualizzati ${podcasts.length} podcast`);
}

/**
 * Crea l'elemento HTML per un singolo podcast
 * @param {Object} podcast - Dati del podcast
 * @param {number} position - Posizione nella classifica
 * @returns {HTMLElement} Elemento DOM del podcast
 */
function createPodcastElement(podcast, position) {
    // Crea l'elemento principale
    const podcastDiv = document.createElement('div');
    podcastDiv.className = 'podcast-card';
    
    // Badge posizione
    const positionBadge = document.createElement('div');
    positionBadge.classList.add('podcast-card-position-badge');
    positionBadge.textContent = position;
    
    // Badge punteggio
    const scoreBadge = document.createElement('div');
    scoreBadge.classList.add('podcast-card-score-badge');
    scoreBadge.style.background = getScoreGradient(podcast.punteggio);
    scoreBadge.textContent = `${podcast.punteggio}% affinità`;
    
    // Container immagine
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('podcast-image-container');
    
    const img = document.createElement('img');
    img.src = podcast.immagine || '';
    img.alt = `Copertina di ${podcast.titolo}`;
    img.classList.add('podcast-card-image');
    
    // Gestione errore immagine
    img.onerror = function() {
        console.warn(`Immagine non trovata: ${podcast.immagine}`);
        this.style.display = 'none';
        
        const fallback = document.createElement('div');
        fallback.classList.add('podcast-image-fallback');
        fallback.innerHTML = '<i class="fas fa-podcast"></i>';
        imageContainer.appendChild(fallback);
    };
    
    imageContainer.appendChild(img);
    
    // Titolo
    const title = document.createElement('h3');
    title.classList.add('podcast-card-title');
    title.textContent = podcast.titolo;
    
    // Tag in comune
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('podcast-tags-container');
    
    if (podcast.tag_comuni && podcast.tag_comuni.length > 0) {
        podcast.tag_comuni.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-mini';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
    } else {
        const noTagsSpan = document.createElement('span');
        noTagsSpan.className = 'tag-mini';
        noTagsSpan.textContent = 'Nessun tag in comune';
        noTagsSpan.style.opacity = '0.7';
        tagsDiv.appendChild(noTagsSpan);
    }
    
    // Descrizione
    const description = document.createElement('p');
    description.classList.add('podcast-description');
    if (podcast.descrizione && podcast.descrizione.endsWith('.txt')) {
        description.textContent = `Descrizione disponibile nel file: ${podcast.descrizione}`;
        description.classList.add('podcast-description-file');
    } else if (podcast.descrizione) {
        description.textContent = podcast.descrizione;
    }
    
    // Link al podcast
    const linkContainer = document.createElement('div');
    linkContainer.classList.add('podcast-link-container');
    
    const link = document.createElement('a');
    link.href = podcast.link;
    link.target = '_blank';
    link.classList.add('podcast-link');
    
    link.innerHTML = '<i class="fab fa-spotify"></i> Ascolta su Spotify';
    
    linkContainer.appendChild(link);
    
    // Assemblare tutti gli elementi
    podcastDiv.appendChild(positionBadge);
    podcastDiv.appendChild(scoreBadge);
    podcastDiv.appendChild(imageContainer);
    podcastDiv.appendChild(title);
    podcastDiv.appendChild(tagsDiv);
    
    if (description.textContent) {
        podcastDiv.appendChild(description);
    }
    
    podcastDiv.appendChild(linkContainer);
    
    // Aggiungi evento click per aprire il modal
    podcastDiv.addEventListener('click', (e) => {
        // Non aprire modal se click su link Spotify
        if (e.target.tagName !== 'A' && !e.target.closest('a')) {
            openModal(podcast);
        }
    });
    
    return podcastDiv;
}

/**
 * Restituisce il gradiente di colore in base al punteggio di affinità
 * @param {number} score - Punteggio da 0 a 100
 * @returns {string} Gradiente CSS
 */
function getScoreGradient(score) {
    if (score >= 80) return 'linear-gradient(135deg, #10b981, #34d399)'; // Verde
    if (score >= 60) return 'linear-gradient(135deg, #f59e0b, #fbbf24)'; // Arancione
    if (score >= 40) return 'linear-gradient(135deg, #f97316, #fb923c)'; // Arancione scuro
    return 'linear-gradient(135deg, #ef4444, #f87171)'; // Rosso
}

/**
 * Apre il modal con i dettagli del podcast
 * @param {Object} podcast - Dati del podcast
 */
function openModal(podcast) {
    if (!modal) return;
    
    // Popola i campi del modal
    document.getElementById('modalTitle').textContent = podcast.titolo;
    document.getElementById('modalCompatibility').textContent = `${podcast.punteggio}% affinità`;
    
    const modalImage = document.getElementById('modalImage');
    modalImage.src = podcast.immagine || '';
    modalImage.alt = podcast.titolo;
    modalImage.style.display = 'block';
    
    // Gestione errore immagine nel modal
    modalImage.onerror = function() {
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.classList.add('modal-image-fallback');
        fallback.innerHTML = '<i class="fas fa-podcast"></i>';
        
        const modalHeader = document.querySelector('.modal-header');
        modalHeader.insertBefore(fallback, modalImage);
    };
    
    document.getElementById('modalDescription').textContent = 
        podcast.descrizione && podcast.descrizione.endsWith('.txt') 
            ? `Descrizione disponibile nel file: ${podcast.descrizione}`
            : (podcast.descrizione || 'Nessuna descrizione disponibile');
    
    // Popola i tag
    const modalTags = document.getElementById('modalTags');
    modalTags.innerHTML = '';
    
    if (podcast.tag_comuni && podcast.tag_comuni.length > 0) {
        podcast.tag_comuni.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-mini';
            tagSpan.textContent = tag;
            modalTags.appendChild(tagSpan);
        });
    } else {
        const noTagsSpan = document.createElement('span');
        noTagsSpan.className = 'tag-mini';
        noTagsSpan.textContent = 'Nessun tag in comune';
        noTagsSpan.style.opacity = '0.7';
        modalTags.appendChild(noTagsSpan);
    }
    
    // Mostra il modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Chiude il modal
 */
function closeModal() {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Rimuovi eventuale fallback dell'immagine
    const fallback = document.querySelector('.modal-header div[style*="linear-gradient"]');
    if (fallback) {
        fallback.remove();
    }
    
    // Ripristina l'immagine
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.style.display = 'block';
    }
}

/**
 * Log delle statistiche per debug
 */
function logStatistics() {
    console.log('=== STATISTICHE SISTEMA ===');
    console.log('Pagina inizializzata correttamente');
    console.log('Struttura JSON: ranking array con podcast');
    console.log('Ogni podcast contiene: titolo, descrizione, punteggio, tag_comuni, link, immagine');
    console.log('===========================');
}

// Chiamata iniziale per log statistiche
setTimeout(logStatistics, 1000);
