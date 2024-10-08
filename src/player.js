import { useEffect, useRef, useState } from "react";
import "./css/player.css";
import volumeIcon from "./assets/volume.png"
import volumeDeafenIcon from "./assets/volume_deafen.png"


function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/songs");
                const data = await response.json();

                const constructedSongs = data.map(file => ({
                    title: file,
                    src: `http://localhost:8080/audio/${file}.mp3`
                }));

                setSongs(constructedSongs);
                console.log(constructedSongs);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSongs();
    }, []);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(prev => !prev);
    };

    const playSong = (index) => {
        setCurrentSongIndex(index);
        audioRef.current.src = songs[index].src;
        audioRef.current.load();

        const handleCanPlayThrough = () => {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((err) => {
                console.error("Erro ao tentar tocar a música:", err);
            });
        };

        audioRef.current.removeEventListener("canplaythrough", handleCanPlayThrough);
        audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough);
    };

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value
        setVolume(newVolume);
        audioRef.current.volume = newVolume
    }

    const mute = () => {
        const volumeRange = document.getElementById("volume")
        const currentVolume = Number(volumeRange.value)
        
        if (currentVolume > 0) {
            localStorage.setItem("volume", currentVolume)
            setVolume(0)
            audioRef.current.volume = 0
            volumeRange.value = 0
        } else {
            const oldVolumeString = localStorage.getItem("volume")
            if (oldVolumeString) {
                const oldVolume = Number(oldVolumeString)
                
                if (oldVolume != 0) {
                    setVolume(oldVolume)
                    audioRef.current.volume = oldVolume
                    volumeRange.value = oldVolume
                } else {
                    setVolume(0.5)
                    audioRef.current.volume = 0.5
                    volumeRange.value = 0.5
                }
            } else {
                setVolume(0.5)
                audioRef.current.volume = 0.5
                volumeRange.value = 0.5
            }
        }
    }

    return (
        <div>
            <h2>Música</h2>
            {songs.length > 0 && (
                <audio ref={audioRef} preload="metadata" />
            )}

            <div>
                <button onClick={togglePlayPause}>
                    {isPlaying ? "Pause" : "Play"}
                </button>
            </div>
            <div>
                <h3>Playlist:</h3>
                <ul>
                    {songs.map((song, index) => (
                        <li key={index}>
                            <button onClick={() => playSong(index)}>
                                {song.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div id="volume-container">
                <img src={volume > 0 ? volumeIcon : volumeDeafenIcon} alt="VolumeIcon" onClick={mute} />
                <input id="volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
            </div>
        </div>
    );
}

export default Player;
