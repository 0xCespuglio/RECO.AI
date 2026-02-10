// LINGUA NOTE = ITALIANO
// lettura del file ..\data\catalogo_podcast.csv

import java.util.ArrayList;

class Main{
    public static void main(String[] args) {

        // --- LETTURA FILE CATALOGO PODCAST ---

        String PATH_CATALOGO = "data/catalogo_podcast.csv";
        ArrayList<Podcast> listaPodcast = Lettura.leggiCatalogo(PATH_CATALOGO);


        // --- LETTURA JSON PREFERENZE UTENTE ---
 
        String PATH_PREFERENZE = "data/user_preferences.json";
        String[] preferenze = Lettura.leggiPreferenze(PATH_PREFERENZE);


        // --- CALCOLO RANKING ---
         ArrayList<Ranking> ranking = Raccomander.creaRanking(listaPodcast, preferenze);
        

        // --- SCRITTURA FILE JSON ---
        String PATH_OUTPUT = "data/output_ranking.json";
        Scrittura.scriviRankingJSON(ranking, PATH_OUTPUT);
        


    }
}