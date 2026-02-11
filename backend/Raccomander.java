import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class Raccomander {
    
    /*
        Calcola il coefficiente di Jaccard tra due insiemi di tag
        Formula: J(A,B) = |A ∩ B| / |A ∪ B| * 100
    */
    private static double calcolaJaccard(String[] preferenze, String[] tagsPodcast) {
        Set<String> setPreferenze = new HashSet<>();
        Set<String> setTags = new HashSet<>();
        
        // Converti array in Set per facilitare le operazioni insiemistiche
        for (String tag : preferenze) {
            if (tag != null) {
                setPreferenze.add(tag.toLowerCase().trim());
            }
        }
        
        for (String tag : tagsPodcast) {
            if (tag != null) {
                setTags.add(tag.toLowerCase().trim());
            }
        }
        
        // Calcola intersezione (tag comuni)
        Set<String> intersezione = new HashSet<>(setPreferenze);
        intersezione.retainAll(setTags);
        
        // Calcola unione (tutti i tag unici)
        Set<String> unione = new HashSet<>(setPreferenze);
        unione.addAll(setTags);
        
        // Evita divisione per zero
        if (unione.isEmpty()) {
            return 0.0;
        }
        
        // Jaccard * 100 per ottenere percentuale
        return ((double) intersezione.size() / unione.size()) * 100.0;
    }
    
    
    //Trova i tag in comune tra preferenze e podcast
    
    private static String[] trovaTagComuni(String[] preferenze, String[] tagsPodcast) {
        Set<String> setPreferenze = new HashSet<>();
        Set<String> tagComuni = new HashSet<>();
        
        for (String tag : preferenze) {
            if (tag != null) {
                setPreferenze.add(tag.toLowerCase().trim());
            }
        }
        
        for (String tag : tagsPodcast) {
            if (tag != null) {
                String tagNormalizzato = tag.toLowerCase().trim();
                if (setPreferenze.contains(tagNormalizzato)) {
                    tagComuni.add(tag.trim()); // Mantieni la formattazione originale
                }
            }
        }
        
        return tagComuni.toArray(String[]::new);
    }
    
    //Crea il ranking completo di tutti i podcast
    public static ArrayList<Ranking> creaRanking(ArrayList<Podcast> listaPodcast, String[] preferenze) {
        ArrayList<Ranking> ranking = new ArrayList<>();
        
        for (Podcast podcast : listaPodcast) {
            double punteggio = calcolaJaccard(preferenze, podcast.getTags());
            

            if (punteggio <= 0) {
                continue;
            }
            
            String[] tagComuni = trovaTagComuni(preferenze, podcast.getTags());
            
            Ranking r = new Ranking(
                podcast.getNome(),
                podcast.getDescrizione(),
                punteggio,
                tagComuni,
                podcast.getLink(),
                podcast.getImmagine()
            );
            
            ranking.add(r);
        }
        
        // Ordina per punteggio decrescente
        ranking.sort((r1, r2) -> Double.compare(r2.getPunteggio(), r1.getPunteggio()));
        
        return ranking;
    }
}