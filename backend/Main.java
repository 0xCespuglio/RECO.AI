// LINGUA NOTE = ITALIANO
// lettura del file ..\data\catalogo_podcast.csv

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;


class Main{
    public static void main(String[] args) {
        String PATHCATALOGO = "..\\data\\catalogo_podcast.csv";
        File catalogo = new File(PATHCATALOGO);
        try (BufferedReader br = new BufferedReader(new java.io.FileReader(catalogo))) {
            String line;
            while ((line = br.readLine()) != null) {
                // Processa la riga del file
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }   

    }
}