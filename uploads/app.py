from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import json

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['JSON_FILE'] = 'songs.json'

# Создаем папку для загрузок, если она не существует
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload():
    title = request.form['title']
    artist = request.form['artist']
    audio_file = request.files['audio']
    cover_file = request.files['cover']

    if audio_file and cover_file:
        # Сохраняем файлы
        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(audio_file.filename))
        cover_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(cover_file.filename))
        audio_file.save(audio_path)
        cover_file.save(cover_path)

        # Читаем существующий JSON-файл или создаем новый
        try:
            with open(app.config['JSON_FILE'], 'r') as f:
                songs = json.load(f)
        except FileNotFoundError:
            songs = []

        # Добавляем новую песню
        songs.append({
            'title': title,
            'artist': artist,
            'audio': audio_path,
            'cover': cover_path
        })

        # Сохраняем обновленный JSON-файл
        with open(app.config['JSON_FILE'], 'w') as f:
            json.dump(songs, f, indent=2)

        return jsonify({'message': 'Song uploaded successfully'}), 200
    else:
        return jsonify({'message': 'Failed to upload song'}), 400

if __name__ == '__main__':
    app.run(debug=True)
