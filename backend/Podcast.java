import java.util.Arrays;

/**
 * Classe che rappresenta un Podcast con tutti i suoi metadati.
 * Utilizzata dal sistema di raccomandazione content-based RECO.AI
 */
public class Podcast {
    
    // ========== ATTRIBUTI ==========
    
    private String titolo;                  // Nome del podcast
    private String descrizioneBreve;        // Descrizione breve (opzionale)
    private String[] tag;                   // Array di tag tematici
    private double[] pesi;                  // Array di pesi (parallelo ai tag)
    private String link;                    // URL Spotify/YouTube
    private String percorsoImmagine;        // Path dell'immagine (es: Muschio-Selvaggio.jpg)
    private String percorsoDescrizione;     // Path del file descrizione (es: desc/Muschio-Selvaggio.txt)
    
    
    // ========== COSTRUTTORI ==========
    
    /**
     * Costruttore completo
     */
    public Podcast(String titolo, String descrizioneBreve, String[] tag, 
                   double[] pesi, String link, String percorsoImmagine, 
                   String percorsoDescrizione) {
        this.titolo = titolo;
        this.descrizioneBreve = descrizioneBreve;
        this.tag = tag;
        this.pesi = pesi;
        this.link = link;
        this.percorsoImmagine = percorsoImmagine;
        this.percorsoDescrizione = percorsoDescrizione;
    }
    
    /**
     * Costruttore semplificato
     */
    public Podcast(String titolo, String[] tag, double[] pesi, String link) {
        this(titolo, "", tag, pesi, link, "", "");
    }
    
    /**
     * Costruttore vuoto (utile per parsing)
     */
    public Podcast() {
        this.tag = new String[0];
        this.pesi = new double[0];
    }
    
    
    // ========== GETTER E SETTER ==========
    
    public String getTitolo() {
        return titolo;
    }
    
    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }
    
    public String getDescrizioneBreve() {
        return descrizioneBreve;
    }
    
    public void setDescrizioneBreve(String descrizioneBreve) {
        this.descrizioneBreve = descrizioneBreve;
    }
    
    public String[] getTag() {
        return tag;
    }
    
    public void setTag(String[] tag) {
        this.tag = tag;
    }
    
    public double[] getPesi() {
        return pesi;
    }
    
    public void setPesi(double[] pesi) {
        this.pesi = pesi;
    }
    
    public String getLink() {
        return link;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public String getPercorsoImmagine() {
        return percorsoImmagine;
    }
    
    public void setPercorsoImmagine(String percorsoImmagine) {
        this.percorsoImmagine = percorsoImmagine;
    }
    
    public String getPercorsoDescrizione() {
        return percorsoDescrizione;
    }
    
    public void setPercorsoDescrizione(String percorsoDescrizione) {
        this.percorsoDescrizione = percorsoDescrizione;
    }
    
    
    // ========== METODI UTILI PER L'ALGORITMO ==========
    
    /**
     * Verifica se il podcast contiene un determinato tag (case-insensitive)
     * @param tagDaCercare il tag da cercare
     * @return true se il tag è presente
     */
    public boolean hasTag(String tagDaCercare) {
        for (String t : tag) {
            if (t.equalsIgnoreCase(tagDaCercare)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Restituisce il peso associato a un tag specifico
     * @param tagDaCercare il tag di cui ottenere il peso
     * @return il peso del tag, 0.0 se il tag non esiste
     */
    public double getPesoTag(String tagDaCercare) {
        for (int i = 0; i < tag.length; i++) {
            if (tag[i].equalsIgnoreCase(tagDaCercare)) {
                return pesi[i];
            }
        }
        return 0.0;
    }
    
    /**
     * Restituisce l'indice di un tag nell'array
     * @param tagDaCercare il tag da cercare
     * @return l'indice del tag, -1 se non trovato
     */
    public int getIndiceTag(String tagDaCercare) {
        for (int i = 0; i < tag.length; i++) {
            if (tag[i].equalsIgnoreCase(tagDaCercare)) {
                return i;
            }
        }
        return -1;
    }
    
    /**
     * Restituisce il numero di tag del podcast
     */
    public int getNumeroTag() {
        return tag != null ? tag.length : 0;
    }
    
    
    // ========== METODI OVERRIDE ==========
    
    /**
     * Rappresentazione testuale del podcast (utile per debug)
     */
    @Override
    public String toString() {
        return "Podcast{" +
                "titolo='" + titolo + '\'' +
                ", tag=" + Arrays.toString(tag) +
                ", pesi=" + Arrays.toString(pesi) +
                ", link='" + link + '\'' +
                ", immagine='" + percorsoImmagine + '\'' +
                '}';
    }
    
    /**
     * Confronto tra podcast (basato sul titolo)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Podcast podcast = (Podcast) obj;
        return titolo != null && titolo.equals(podcast.titolo);
    }
    
    @Override
    public int hashCode() {
        return titolo != null ? titolo.hashCode() : 0;
    }
}