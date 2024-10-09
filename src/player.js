import { useEffect, useRef, useState } from "react";
import "./css/player.css";
import volumeIcon from "./assets/volume.png"
import volumeDeafenIcon from "./assets/volume_deafen.png"
import afterSongIcon from "./assets/after.png"
import beforeSongIcon from "./assets/before.png"
import pauseIcon from "./assets/pause.png"
import playIcon from "./assets/play.png"

function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentSongIndex] = useState(0);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
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

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    }

    const handleLoadedMetaData = () => {
        setDuration(audioRef.current.duration);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const handleCurrentTime = (event) => {
        const newTime = event.target.value
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime
    }

    const nextSong = () => {
        playSong(currentIndex + 1);
    }

    const beforeSong = () => {
        playSong(currentIndex - 1);
    }

    return (
        <div className="player">
            <h2>{String(songs[currentIndex] == null ? "" : songs[currentIndex].title)}</h2>
            {songs.length > 0 && (
                <audio ref={audioRef} preload="metadata" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetaData} />
            )}
            <div>
                <img onClick={togglePlayPause} src={isPlaying ? pauseIcon : playIcon} />
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
            <div id="time-container">
                <input id="time" type="range" min="0" max={duration} step="0.01" onChange={handleCurrentTime} value={currentTime} />
                <p>{formatTime(currentTime)}</p>
                <p>{formatTime(duration)}</p>
            </div>
            <div id="volume-container">
                <img src={volume > 0 ? volumeIcon : volumeDeafenIcon} alt="VolumeIcon" onClick={mute} />
                <input id="volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
            </div>
            <div>
                <img src={afterSongIcon} alt="afterMusic" onClick={nextSong} />
                <img src={beforeSongIcon} alt="beforeMusic" onClick={beforeSong} />
            </div>
        </div>
    );
}

export default Player;