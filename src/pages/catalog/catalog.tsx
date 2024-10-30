import React, { useEffect, useState } from "react";
// import "./style.scss";

type SongType = {
	name: string;
	artist: string;
	cover: string;
};

const Catalog: React.FC = () => {
	const [songs, setSongs] = useState<SongType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const getSongs = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("http://localhost:7999/songs.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setSongs(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getSongs();
	}, []);

	return (
		<div>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				songs.map((song: SongType) => (
					<div className="song">
						<div className="song_image">
							<img
								src={song.cover}
								alt="Постер музыкальной композиции"
							/>
						</div>
						<div id="song_info3">
							<h3 id="song_name3">{song.name}</h3>
							<h4 id="song_author">{song.artist}</h4>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default Catalog;
