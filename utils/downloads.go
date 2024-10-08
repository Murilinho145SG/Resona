package utils

import (
	"bufio"
	"os"
	"os/exec"
	"time"
)


func Download(url string, path string) *exec.Cmd {
	cmd := exec.Command("yt-dlp", "-x", "--audio-format", "mp3", url)
	cmd.Dir = path

	if err := cmd.Start(); err != nil {
		panic(err)
	}

	return cmd
}

func DownloadDefault(url string) *exec.Cmd {
	return Download(url, "./audios")
}

func DownloadFiles(filename string, path string) {
	file, err := os.Open(filename)

	if err != nil {
		panic(err)
	}

	defer file.Close()
	
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		var cmd *exec.Cmd

		if path != "" {
			cmd = Download(scanner.Text(), path)
		} else {
			cmd = DownloadDefault(scanner.Text())
		}

		if err := cmd.Wait(); err != nil {
			panic(err)
		}

		time.Sleep(time.Second)
	}
}