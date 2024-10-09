package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/gorilla/handlers"
	"main.go/utils"
)

func main() {
	go utils.DownloadFiles("musics", "")
	go runReact()
	go runAPI()

	select {}
}

func runAPI() {
	http.Handle("/audio/", http.StripPrefix("/audio/", http.FileServer(http.Dir("./audios"))))
	http.HandleFunc("/api/songs", listAudioFiles)

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "OPTIONS"})

	err := http.ListenAndServe(":8080", handlers.CORS(headers, origins, methods)(http.DefaultServeMux))

	if err != nil {
		log.Fatal(err)
	}
}

func runReact() {
	cmd := exec.Command("npm", "start")

	// Captura stdout e stderr em tempo real
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		log.Fatalf("Erro ao executar npm start: %v", err)
	}
}

func listAudioFiles(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir("./audios")

	if err != nil {
		log.Fatal(err)
	}

	var audioFiles []string

	for _, file := range files {
		if !file.IsDir() {
			fileName := strings.TrimSuffix(file.Name(), ".mp3")
			audioFiles = append(audioFiles, fileName)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(audioFiles)
}
