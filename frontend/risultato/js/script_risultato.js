/**
 * RECO.AI - Sistema di Raccomandazione Podcast
 * Script principale per caricamento e visualizzazione dei podcast
 */

// === CONFIGURATION ===
// === ELEMENTI DOM PRINCIPALI ===
let podcastsContainer = null;
let loadingElement = null;
let errorElement = null;
let errorMessageElement = null;
let modal = null;

// === IMMAGINE FALLBACK ===
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%" y="50%" font-size="14" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';

// === INITIALIZATION ===
/**
 * Funzione principale eseguita al caricamento della pagina
 */
document.addEventListener('DOMContentLoaded', function() {
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

// === DATA LOADING ===
/**
 * Carica i dati dei podcast dal file JSON
 */
async function loadPodcasts() {
    try {
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
 * Mostra l'intestazione della pagina (usata dopo che i podcast sono stati caricati).
 */
function showHeader() {
    const header = document.getElementById('page-header');
    if (header) {
        header.style.display = 'block';
    }

    /* BOTTONE DISATTIVATO
    const bottom = document.getElementById('bottom-cta');
    if (bottom) {
        bottom.style.display = 'block';
        }
    */
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

// === RENDERING ===
/**
 * Visualizza i podcast nella pagina
 * @param {Array} podcasts - Array di podcast da visualizzare
 */
function displayPodcasts(podcasts) {
    if (!podcastsContainer) {
        console.error('Contenitore podcast non disponibile');
        return;
    }

    // rendiamo visibile l'header e il pulsante indietro
    showHeader();
    
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
    scoreBadge.classList.add(getScoreClass(podcast.punteggio));
    scoreBadge.textContent = `${podcast.punteggio}% affinità`;
    
    // Container immagine
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('podcast-image-container');
    
    const img = document.createElement('img');
    img.src = podcast.immagine ? `../assets/img/${podcast.immagine}` : '';
    img.alt = `Copertina di ${podcast.titolo}`;
    img.classList.add('podcast-card-image');
    
    // Gestione errore immagine
    img.onerror = function() {
        this.src = FALLBACK_IMAGE;
        this.style.opacity = '0.8';
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
        description.textContent = `Caricamento descrizione...`;
        description.classList.add('podcast-description-file');
        loadDescription(`../assets/desc/${podcast.descrizione}`, description);
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

// === UTILITY FUNCTIONS ===
/**
 * Restituisce la classe CSS per il badge di punteggio di affinità
 * @param {number} score - Punteggio da 0 a 100
 * @returns {string} Nome della classe CSS
 */
function getScoreClass(score) {
    if (score >= 80) return 'score-badge-high';
    if (score >= 60) return 'score-badge-medium-high';
    if (score >= 40) return 'score-badge-medium';
    return 'score-badge-low';
}

// === MODAL HANDLING ===
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
    modalImage.src = podcast.immagine ? `../assets/img/${podcast.immagine}` : '';
    modalImage.alt = podcast.titolo;
    modalImage.style.display = 'block';
    
    // Gestione errore immagine nel modal
    modalImage.onerror = function() {
        this.src = FALLBACK_IMAGE;
        this.style.opacity = '0.8';
    };
    
    document.getElementById('modalDescription').textContent = 
        podcast.descrizione && podcast.descrizione.endsWith('.txt') 
            ? `Caricamento descrizione...`
            : (podcast.descrizione || 'Nessuna descrizione disponibile');
    
    // Carica la descrizione dal file se necessario
    if (podcast.descrizione && podcast.descrizione.endsWith('.txt')) {
        loadDescription(`../assets/desc/${podcast.descrizione}`, document.getElementById('modalDescription'));
    }
    
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
}

/**
 * Carica il contenuto di una descrizione da un file .txt
 * @param {string} filePath - Percorso del file di descrizione
 * @param {HTMLElement} element - Elemento DOM dove inserire la descrizione
 */
async function loadDescription(filePath, element) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            element.textContent = 'Descrizione non disponibile';
            return;
        }
        const text = await response.text();
        element.textContent = text.trim();
    } catch (error) {
        console.error(`Errore nel caricamento della descrizione: ${error}`);
        element.textContent = 'Errore nel caricamento della descrizione';
    }
}
