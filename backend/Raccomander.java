import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class Raccomander {

    /**
     * Algoritmo: Concentrazione (Precision)
     *
     * Score = |A ∩ B| / |B| × 100
     *
     * Risponde alla domanda:
     * "Di tutti i tag del podcast, quanti corrispondono ai miei interessi?"
     *
     * Vantaggi:
     * - Indipendente dal numero di tag dell'utente
     * - Premia i podcast focalizzati sugli interessi dell'utente
     * - Produce punteggi alti e distribuiti
     * - Stabile con 3, 5, 10 o più tag utente
     */
    private static double calcolaPunteggio(String[] preferenze, String[] tagsPodcast) {
        Set<String> setPreferenze = new HashSet<>();
        Set<String> setTags = new HashSet<>();

        for (String tag : preferenze) {
            if (tag != null) setPreferenze.add(tag.toLowerCase().trim());
        }
        for (String tag : tagsPodcast) {
            if (tag != null) setTags.add(tag.toLowerCase().trim());
        }

        if (setPreferenze.isEmpty() || setTags.isEmpty()) return 0.0;

        Set<String> intersezione = new HashSet<>(setPreferenze);
        intersezione.retainAll(setTags);
        int match = intersezione.size();

        if (match == 0) return 0.0;

        // Divido per i tag del podcast, non dell'utente
        return ((double) match / setTags.size()) * 100.0;
    }

    private static String[] trovaTagComuni(String[] preferenze, String[] tagsPodcast) {
        Set<String> setPreferenze = new HashSet<>();
        Set<String> tagComuni = new HashSet<>();

        for (String tag : preferenze) {
            if (tag != null) setPreferenze.add(tag.toLowerCase().trim());
        }
        for (String tag : tagsPodcast) {
            if (tag != null) {
                String tagNorm = tag.toLowerCase().trim();
                if (setPreferenze.contains(tagNorm)) tagComuni.add(tag.trim());
            }
        }

        return tagComuni.toArray(String[]::new);
    }

    public static ArrayList<Ranking> creaRanking(ArrayList<Podcast> listaPodcast, String[] preferenze) {
        ArrayList<Ranking> ranking = new ArrayList<>();

        for (Podcast podcast : listaPodcast) {
            double punteggio = calcolaPunteggio(preferenze, podcast.getTags());

            if (punteggio <= 0) continue;

            String[] tagComuni = trovaTagComuni(preferenze, podcast.getTags());

            ranking.add(new Ranking(
                podcast.getNome(),
                podcast.getDescrizione(),
                punteggio,
                tagComuni,
                podcast.getLink(),
                podcast.getImmagine()
            ));
        }

        ranking.sort((r1, r2) -> Double.compare(r2.getPunteggio(), r1.getPunteggio()));
        return ranking;
    }
}