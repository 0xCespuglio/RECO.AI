import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Lettura {
    
    // METEDO PER LEGGERE IL CATALOGO PODCAST
    public static ArrayList<Podcast> leggiCatalogo(String pathCatalogo) {
        ArrayList<Podcast> listaPodcast = new ArrayList<>();
        File catalogo = new File(pathCatalogo);

        try (BufferedReader br = new BufferedReader(new FileReader(catalogo))) {
            String line;
            br.readLine(); // salta l'intestazione

            while ((line = br.readLine()) != null) {
                String[] s = line.split(",");

                String nome = s[0].replace("\"", "");
                String descrizione = s[1].replace("\"", "");
                String[] tags = s[2].replace("\"", "").split(";"); // separatore tag ";"
                String link = s[s.length - 2].replace("\"", "");
                String immagine = s[s.length - 1].replace("\"", "");

                listaPodcast.add(new Podcast(nome, descrizione, tags, link, immagine));
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return listaPodcast;
    }

    // METEDO PER LEGGERE LE PREFERENZE DELL'UTENTE

        public static String[] leggiPreferenze(String pathPreferenze) {

            String[] tags = new String[3];
            
            try {
                BufferedReader br = new BufferedReader(new FileReader(pathPreferenze));
                StringBuilder jsonContent = new StringBuilder();
                String line;
                
                while ((line = br.readLine()) != null) {
                    jsonContent.append(line);
                }
                br.close();
                
                String json = jsonContent.toString();
                String tagsSection = json.substring(json.indexOf("[") + 1, json.indexOf("]"));
                tags = tagsSection.split(",");
                
                for (int i = 0; i < tags.length; i++) {
                    tags[i] = tags[i].trim().replace("\"", "");
                }
                
            } catch (IOException e) {
                e.printStackTrace();
            }
            
            return tags;
        }
}
