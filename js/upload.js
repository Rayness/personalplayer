export const AddNewSongs = () => {
    document.getElementById('uploadForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const audioFile = document.getElementById('audio').files[0];
        const cover = document.getElementById('cover').value;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('audio', audioFile);
        formData.append('cover', cover);

        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').innerText = data.message;
        })
        .catch(error => {
            document.getElementById('message').innerText = 'Error: ' + error.message;
        });
    });
};
