// LINGUA NOTE = ITALIANO
// lettura del file ..\data\catalogo_podcast.csv

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;


class Main{
    public static void main(String[] args) {
        String PATH_CATALOGO = "data/catalogo_podcast.csv"; // percorso del file catalogo_podcast.csv

        File catalogo = new File(PATH_CATALOGO); // creazione dell'oggetto File per il file catalogo_podcast.csv

        ArrayList<Podcast> listaPodcast = new ArrayList<>(); // creazione di una lista per memorizzare i podcast letti dal file

        
        int numeroRighe = 0; // variabile per contare il numero di righe lette dal file (esclusa l'intestazione)

        try (BufferedReader br = new BufferedReader(new FileReader(catalogo))) {
            String line;
            // lettura del file riga per riga, escludendo l'intestazione
            br.readLine();
            // ciclo di lettura del file riga per riga
            while ((line = br.readLine()) != null) {
            // per ogni riga, i campi sono separati da virgole, quindi si utilizza il metodo split(",") per dividere la riga in un array di stringhe

                String[] s = line.split(","); 
                String nome = s[0].replace("\"", "");
                String descrizione = s[1].replace("\"", "");
                String [] tags = s[2].replace("\"", "").split(";");
                String link = s[s.length - 2].replace("\"", "");
                String immagine = s[s.length - 1].replace("\"", "");

                listaPodcast.add(new Podcast(nome, descrizione, tags, link, immagine)); 

                numeroRighe++; 
            }

        } catch (IOException e) {
            e.printStackTrace();
        }   


    }
}