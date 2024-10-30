import React from 'react';

const Catalog: React.FC = () => {
    const [songs, setSongs] = useState([]);
    const getSongs = async () => {
        try {
            const response = await fetch("http://localhost:7999/songs.json")
            setSongs(await response.json())
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getSongs()
    }, [])

    return (
        <div>
            {songs.map((song: any) => (
                <div class="song">
                    <div class="song_image">
                        <img src={song.cover} alt="Постер музыкальной композиции"/>
                    </div>
                    <div id="song_info3"><h3 id="song_name3">{song.Name}</h3><h4 id="song_author">{song.Artist}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Catalog;