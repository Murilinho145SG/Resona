import SongsContext from "./SongsContext";

const [songs, setSongs] = useState([]);

function MusicList() {
    const { songs, setSong } = useContext(SongsContext);

    return (
        <div className="music-list">

        </div>
    )
}

export {
    songs,
    setSongs
}

export default MusicList