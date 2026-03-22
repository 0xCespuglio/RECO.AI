// RECO.AI — Caricamento e visualizzazione dei podcast consigliati

// --- ELEMENTI DOM PRINCIPALI ---
let podcastsContainer   = null;
let loadingElement      = null;
let errorElement        = null;
let errorMessageElement = null;
let modal               = null;

// SVG inline usato quando l'immagine del podcast non si carica
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%" y="50%" font-size="14" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';


// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', function() {
    initDOMElements();
    loadPodcasts();
});

function initDOMElements() {
    podcastsContainer   = document.getElementById('podcasts-container');
    loadingElement      = document.getElementById('loading');
    errorElement        = document.getElementById('error');
    errorMessageElement = document.getElementById('error-message');
    modal               = document.getElementById('modal');

    if (!podcastsContainer) {
        console.error('Elemento #podcasts-container non trovato!');
    }
}


// --- DATA LOADING ---

// Carica output_ranking.json e aspetta almeno 1.5s per mostrare il loader
async function loadPodcasts() {
    try {
        const response = await fetch('../../data/output_ranking.json');

        if (!response.ok) {
            throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.ranking || !Array.isArray(data.ranking)) {
            throw new Error('Formato JSON non valido: proprietà "ranking" mancante o non array');
        }

        setTimeout(() => { hideLoading(); }, 1200);
        setTimeout(() => { displayPodcasts(data.ranking); }, 1200);

    } catch (error) {
        console.error('Errore nel caricamento dei podcast:', error);
        showError(`Impossibile caricare i dati: ${error.message}`);
    }
}

function hideLoading() {
    if (loadingElement) loadingElement.style.display = 'none';
}

function showHeader() {
    const header = document.getElementById('page-header');
    if (header) header.style.display = 'block';

    /* BOTTONE DISATTIVATO
    const bottom = document.getElementById('bottom-cta');
    if (bottom) bottom.style.display = 'block';
    */
}

function showError(message) {
    hideLoading();
    if (errorElement && errorMessageElement) {
        errorMessageElement.textContent = message;
        errorElement.style.display = 'block';
    }
}


// --- RENDERING ---

function displayPodcasts(podcasts) {
    if (!podcastsContainer) return;

    showHeader();
    podcastsContainer.innerHTML = '';

    if (podcasts.length === 0) {
        podcastsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Nessun podcast disponibile.</p>';
        return;
    }

    podcasts.forEach((podcast, index) => {
        podcastsContainer.appendChild(createPodcastElement(podcast, index + 1));
    });
}

function createPodcastElement(podcast, position) {
    const podcastDiv = document.createElement('div');
    podcastDiv.className = 'podcast-card';

    // Badge posizione (numero)
    const positionBadge = document.createElement('div');
    positionBadge.classList.add('podcast-card-position-badge');
    positionBadge.textContent = position;

    // Badge punteggio (etichetta testuale + colore)
    const scoreBadge = document.createElement('div');
    scoreBadge.classList.add('podcast-card-score-badge', getScoreClass(podcast.punteggio));
    scoreBadge.textContent = getBadgeText(podcast.punteggio);

    // Immagine copertina
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('podcast-image-container');
    const img = document.createElement('img');
    img.src = podcast.immagine ? `../assets/img/${podcast.immagine}` : '';
    img.alt = `Copertina di ${podcast.titolo}`;
    img.classList.add('podcast-card-image');
    img.onerror = function() {
        this.src = FALLBACK_IMAGE;
        this.style.opacity = '0.8';
    };
    imageContainer.appendChild(img);

    // Titolo
    const title = document.createElement('h3');
    title.classList.add('podcast-card-title');
    title.textContent = podcast.titolo;

    // Tag in comune con le preferenze dell'utente
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

    // Descrizione (testo diretto o caricata da file .txt)
    const description = document.createElement('p');
    description.classList.add('podcast-description');
    if (podcast.descrizione && podcast.descrizione.endsWith('.txt')) {
        description.textContent = 'Caricamento descrizione...';
        description.classList.add('podcast-description-file');
        loadDescription(`../assets/desc/${podcast.descrizione}`, description);
    } else if (podcast.descrizione) {
        description.textContent = podcast.descrizione;
    }

    // Link Spotify
    const linkContainer = document.createElement('div');
    linkContainer.classList.add('podcast-link-container');
    const link = document.createElement('a');
    link.href = podcast.link;
    link.target = '_blank';
    link.classList.add('podcast-link');
    link.innerHTML = '<i class="fab fa-spotify"></i> Ascolta su Spotify';
    linkContainer.appendChild(link);

    // Assemblaggio elementi nella card
    podcastDiv.appendChild(positionBadge);
    podcastDiv.appendChild(scoreBadge);
    podcastDiv.appendChild(imageContainer);
    podcastDiv.appendChild(title);
    podcastDiv.appendChild(tagsDiv);
    if (description.textContent) podcastDiv.appendChild(description);
    podcastDiv.appendChild(linkContainer);

    // Click sulla card apre il modal (escluso il link Spotify)
    podcastDiv.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && !e.target.closest('a')) {
            openModal(podcast);
        }
    });

    return podcastDiv;
}


// --- UTILITY FUNCTIONS ---

// Converte il punteggio numerico in etichetta testuale
function getBadgeText(punteggio) {
    if (punteggio >= 75) return "Perfetto per te";
    if (punteggio >= 50) return "Molto rilevante";
    if (punteggio >= 25) return "Abbastanza rilevante";
    return "Poco rilevante";
}

// Restituisce la classe CSS del badge in base al punteggio
function getScoreClass(score) {
    if (score >= 75) return 'score-badge-high';
    if (score >= 50) return 'score-badge-medium-high';
    if (score >= 25) return 'score-badge-medium';
    return 'score-badge-low';
}


// --- MODAL ---

function openModal(podcast) {
    if (!modal) return;

    document.getElementById('modalTitle').textContent = podcast.titolo;

    // Aggiorna badge compatibilità con colore e testo corretti
    const modalCompatibility = document.getElementById('modalCompatibility');
    modalCompatibility.classList.remove('score-badge-high', 'score-badge-medium-high', 'score-badge-medium', 'score-badge-low');
    modalCompatibility.classList.add(getScoreClass(podcast.punteggio));
    modalCompatibility.textContent = getBadgeText(podcast.punteggio);

    const modalImage = document.getElementById('modalImage');
    modalImage.src = podcast.immagine ? `../assets/img/${podcast.immagine}` : '';
    modalImage.alt = podcast.titolo;
    modalImage.style.display = 'block';
    modalImage.onerror = function() {
        this.src = FALLBACK_IMAGE;
        this.style.opacity = '0.8';
    };

    const modalDesc = document.getElementById('modalDescription');
    modalDesc.textContent = podcast.descrizione && podcast.descrizione.endsWith('.txt')
        ? 'Caricamento descrizione...'
        : (podcast.descrizione || 'Nessuna descrizione disponibile');
    if (podcast.descrizione && podcast.descrizione.endsWith('.txt')) {
        loadDescription(`../assets/desc/${podcast.descrizione}`, modalDesc);
    }

    // Tag
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

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}


// --- DESCRIPTION LOADER ---

// Carica la descrizione da un file .txt esterno
async function loadDescription(filePath, element) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            element.textContent = 'Descrizione non disponibile';
            return;
        }
        element.textContent = (await response.text()).trim();
    } catch (error) {
        console.error(`Errore nel caricamento della descrizione: ${error}`);
        element.textContent = 'Errore nel caricamento della descrizione';
    }
}