from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import json
import random

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'media/'
app.config['JSON_FILE'] = 'songs.json'

# Создаем папку для загрузок, если она не существует
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def generate_unique_id(songs):
    """Функция для генерации уникального числового ID."""
    while True:
        new_id = random.randint(100000, 999999)  # Генерируем ID из четырех цифр
        if all(song.get('id') != new_id for song in songs):
            return new_id

@app.route('/upload', methods=['POST'])
def upload():
    title = request.form['title']
    artist = request.form['artist']
    audio_file = request.files['audio']
    cover_path = request.form['cover']

    if audio_file:
        # Сохраняем файл аудио
        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(audio_file.filename))
        audio_file.save(audio_path)

        # Читаем существующий JSON-файл или создаем новый
        try:
            with open(app.config['JSON_FILE'], 'r', encoding='utf-8') as f:
                songs = json.load(f)
        except FileNotFoundError:
            songs = []

        # Генерируем уникальный числовой ID
        song_id = generate_unique_id(songs)

        # Добавляем новую песню
        songs.append({
            'id': song_id,
            'title': title,
            'artist': artist,
            'audio': 'uploads/' + audio_path,
            'cover': cover_path
        })

        # Сохраняем обновленный JSON-файл
        with open(app.config['JSON_FILE'], 'w', encoding='utf-8') as f:
            json.dump(songs, f, ensure_ascii=False, indent=2)

        return jsonify({'message': 'Song uploaded successfully', 'id': song_id}), 200
    else:
        return jsonify({'message': 'Failed to upload song'}), 400

if __name__ == '__main__':
    app.run(debug=True)
