import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

public class Scrittura {
    
    // Scrive il ranking in un file JSON
    
    public static void scriviRankingJSON(ArrayList<Ranking> ranking, String pathOutput) {
        try (FileWriter writer = new FileWriter(pathOutput)) {
            writer.write("{\n");
            writer.write("  \"ranking\": [\n");
            
            for (int i = 0; i < ranking.size(); i++) {
                Ranking r = ranking.get(i);
                
                writer.write("    {\n");
                writer.write("      \"titolo\": \"" + r.getNome() + "\",\n");
                writer.write("      \"descrizione\": \"" + r.getDescrizione() + "\",\n");
                
                writer.write("      \"punteggio\": " + String.format(Locale.US, "%.1f", r.getPunteggio()) + ",\n");
                
                // Array tag_comuni
                writer.write("      \"tag_comuni\": [");
                String[] tagComuni = r.getTag_comuni();
                for (int j = 0; j < tagComuni.length; j++) {
                    writer.write("\"" + tagComuni[j] + "\"");
                    if (j < tagComuni.length - 1) {
                        writer.write(",");
                    }
                }
                writer.write("],\n");
                
                writer.write("      \"link\": \"" + r.getLink() + "\",\n");
                writer.write("      \"immagine\": \"" + r.getImmagine() + "\"\n");
                writer.write("    }");
                
                // Virgola solo se non è l'ultimo elemento
                if (i < ranking.size() - 1) {
                    writer.write(",");
                }
                writer.write("\n");
            }
            
            writer.write("  ]\n");
            writer.write("}\n");
            
            System.out.println(pathOutput.split("/")[1] +" scritto correttamente in: " + pathOutput);

            
        } catch (IOException e) {
            System.err.println("Errore durante la scrittura di \"" + pathOutput + "\"!");
            e.printStackTrace();
        }
    }
}