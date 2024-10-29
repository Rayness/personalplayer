async function loadNames() {
    const response = await fetch('songs.json');
    const songs = await response.json();

    console.log(songs);
    };

loadNames();