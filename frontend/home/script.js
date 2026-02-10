/**
 * RECO.AI - Sistema di Raccomandazione Podcast
 * Script principale per caricamento e visualizzazione dei podcast
 */

// Elementi DOM principali
let podcastsContainer = null;
let loadingElement = null;
let errorElement = null;
let errorMessageElement = null;

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
        podcastsContainer.innerHTML = '<p>Nessun podcast disponibile.</p>';
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
    
    // Aggiungi bordo e margini
    podcastDiv.style.border = '2px solid #3498db';
    podcastDiv.style.borderRadius = '8px';
    podcastDiv.style.margin = '20px 0';
    podcastDiv.style.padding = '20px';
    podcastDiv.style.backgroundColor = 'white';
    podcastDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    // Titolo del podcast
    const title = document.createElement('h2');
    title.textContent = `${position}. ${podcast.titolo}`;
    title.style.color = '#2c3e50';
    title.style.marginBottom = '10px';
    title.style.fontSize = '1.5em';
    
    // Punteggio di affinità
    const scoreDiv = document.createElement('div');
    scoreDiv.style.margin = '10px 0';
    
    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'Affinità: ';
    scoreLabel.style.fontWeight = 'bold';
    
    const scoreValue = document.createElement('span');
    scoreValue.textContent = `${podcast.punteggio}%`;
    scoreValue.style.fontWeight = 'bold';
    scoreValue.style.color = getScoreColor(podcast.punteggio);
    
    scoreDiv.appendChild(scoreLabel);
    scoreDiv.appendChild(scoreValue);
    
    // Tag in comune
    const tagsDiv = document.createElement('div');
    tagsDiv.style.margin = '10px 0';
    
    const tagsLabel = document.createElement('span');
    tagsLabel.textContent = 'Tag in comune: ';
    tagsLabel.style.fontWeight = 'bold';
    tagsLabel.style.display = 'block';
    tagsLabel.style.marginBottom = '5px';
    
    tagsDiv.appendChild(tagsLabel);
    
    if (podcast.tag_comuni && podcast.tag_comuni.length > 0) {
        podcast.tag_comuni.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.style.display = 'inline-block';
            tagSpan.style.backgroundColor = '#e8f4fc';
            tagSpan.style.color = '#2980b9';
            tagSpan.style.padding = '5px 10px';
            tagSpan.style.margin = '2px 5px 2px 0';
            tagSpan.style.borderRadius = '15px';
            tagSpan.style.fontSize = '0.9em';
            
            tagsDiv.appendChild(tagSpan);
        });
    } else {
        const noTagsSpan = document.createElement('span');
        noTagsSpan.textContent = 'Nessun tag in comune';
        noTagsSpan.style.color = '#7f8c8d';
        noTagsSpan.style.fontStyle = 'italic';
        tagsDiv.appendChild(noTagsSpan);
    }
    
    // Link al podcast
    const linkDiv = document.createElement('div');
    linkDiv.style.margin = '15px 0';
    
    const link = document.createElement('a');
    link.href = podcast.link;
    link.textContent = 'Ascolta su Spotify →';
    link.target = '_blank';
    link.style.display = 'inline-block';
    link.style.backgroundColor = '#1DB954'; // Verde Spotify
    link.style.color = 'white';
    link.style.padding = '10px 20px';
    link.style.textDecoration = 'none';
    link.style.borderRadius = '5px';
    link.style.fontWeight = 'bold';
    
    linkDiv.appendChild(link);
    
    // Immagine del podcast (se disponibile)
    let imageDiv = null;
    if (podcast.immagine) {
        imageDiv = document.createElement('div');
        imageDiv.style.margin = '10px 0';
        imageDiv.style.textAlign = 'center';
        
        const img = document.createElement('img');
        img.src = podcast.immagine;
        img.alt = `Copertina di ${podcast.titolo}`;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        img.style.borderRadius = '5px';
        img.style.border = '1px solid #ddd';
        
        // Gestione errore caricamento immagine
        img.onerror = function() {
            console.warn(`Immagine non trovata: ${podcast.immagine}`);
            this.style.display = 'none';
            
            const fallback = document.createElement('div');
            fallback.textContent = '🎧';
            fallback.style.fontSize = '4em';
            fallback.style.opacity = '0.3';
            imageDiv.appendChild(fallback);
        };
        
        imageDiv.appendChild(img);
    }
    
    // Descrizione (se è un percorso file, lo indichiamo)
    const descDiv = document.createElement('div'); 
    descDiv.style.margin = '10px 0';
    descDiv.style.color = '#555';
    
    if (podcast.descrizione && podcast.descrizione.endsWith('.txt')) {
        const descText = document.createElement('span');
        descText.textContent = `Descrizione disponibile in: ${podcast.descrizione}`;
        descText.style.fontStyle = 'italic';
        descDiv.appendChild(descText);
    } else if (podcast.descrizione) {
        const descText = document.createElement('p');
        descText.textContent = podcast.descrizione;
        descDiv.appendChild(descText);
    }
    
    // Assemblare tutti gli elementi
    podcastDiv.appendChild(title);
    podcastDiv.appendChild(scoreDiv);
    
    if (imageDiv) {
        podcastDiv.appendChild(imageDiv);
    }
    
    podcastDiv.appendChild(tagsDiv);
    podcastDiv.appendChild(descDiv);
    podcastDiv.appendChild(linkDiv);
    
    return podcastDiv;
}

/**
 * Restituisce il colore in base al punteggio di affinità
 * @param {number} score - Punteggio da 0 a 100
 * @returns {string} Codice colore CSS
 */
function getScoreColor(score) {
    if (score >= 80) return '#27ae60'; // Verde per punteggi alti
    if (score >= 60) return '#f39c12'; // Arancione per punteggi medi
    if (score >= 40) return '#e67e22'; // Arancione scuro
    return '#e74c3c'; // Rosso per punteggi bassi
}

/**
 * Funzione per ordinare i podcast
 * @param {string} criteria - Criterio di ordinamento
 */
function sortPodcasts(criteria) {
    // Questa funzione potrebbe essere estesa per aggiungere pulsanti di ordinamento
    console.log(`Ordinamento per: ${criteria}`);
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