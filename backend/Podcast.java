

class Podcast {
    // --- ATTRIBUTI ---
    String nome;
    String descrizione;
    String[] tags;
    double[] pesi;
    String link;
    String immagine;
    
    // --- COSTRUTTORE ---
    Podcast(String nome, String descrizione, String[] tags, double[] pesi, String link, String immagine){
        this.nome = nome;
        this.descrizione = descrizione;
        this.tags = tags;
        this.pesi = pesi;
        this.link = link;
        this.immagine = immagine;
    }

    // --- GETTER ---
    public String getNome() {
        return nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public String[] getTags() {
        return tags;
    }

    public double[] getPesi() {
        return pesi;
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
    
    public void setPesi(double[] pesi) {
        this.pesi = pesi;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public void setImmagine(String immagine) {
        this.immagine = immagine;
    }
}