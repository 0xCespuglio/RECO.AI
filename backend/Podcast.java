public class Podcast {
    // ATTRIBUTI 
    String nome;
    String descrizione;
    String[] tags;
    String link;
    String immagine;
    
    // COSTRUTTORE 
    Podcast(String nome, String descrizione, String[] tags, String link, String immagine){
        this.nome = nome;
        this.descrizione = descrizione;
        this.tags = tags;
        this.link = link;
        this.immagine = immagine;
    }

    // GETTER 
    public String getNome() {
        return nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public String[] getTags() {
        return tags;
    }

    public String getLink() {
        return link;
    }

    public String getImmagine() {
        return immagine;
    }

    // --- SETTER ---
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
    
    public void setTags(String[] tags) {
        this.tags = tags;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public void setImmagine(String immagine) {
        this.immagine = immagine;
    }
}