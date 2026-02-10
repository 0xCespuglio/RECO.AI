
public class Ranking {
    // ATTRIBUTI 
    String nome;
    String descrizione;
    Double punteggio;
    String[] tag_comuni;
    String link;
    String immagine;

    // COSTRUTTORE
    public Ranking(String nome, String descrizione, Double punteggio, String[] tag_comuni, String link, String immagine) {
        this.nome = nome;
        this.descrizione = descrizione;
        this.punteggio = punteggio;
        this.tag_comuni = tag_comuni;
        this.link = link;
        this.immagine = immagine;
    }

    // SETTER

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public void setPunteggio(Double punteggio) {
        this.punteggio = punteggio;
    }

    public void setTag_comuni(String[] tag_comuni) {
        this.tag_comuni = tag_comuni;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setImmagine(String immagine) {
        this.immagine = immagine;
    }

    // GETTER
    
    public String getNome() {
        return nome;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public Double getPunteggio() {
        return punteggio;
    }

    public String[] getTag_comuni() {
        return tag_comuni;
    }

    public String getLink() {
        return link;
    }

    public String getImmagine() {
        return immagine;
    }
}
