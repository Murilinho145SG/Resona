# Resona

My project for an online music player for study purposes and programming practice, I'm currently practicing making web applications and learning to use Golang, but at the end of it all I might just want to deal with the back-end even though I prefer a thousand times to do a back-end than a front

Basically the API is made in Golang, I used yt-dlp and ffmpeg, and I'm doing all of the front and back of the site and then transforming it into an electron application

If you want to use my project, just create a file called musics and put links inside that file
remember to create a folder called audios

After that just hit **`go run main.go`**
```Go
func main() {
	go utils.DownloadFiles("musics", "")
	go runReact()
	go runAPI()

	select {}
}
```

This code will start both the API and the React part of the project