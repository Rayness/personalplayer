export const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Изменение цвета вслед за точкой на временной шкале


// Функция для обновления значения кастомного свойства CSS
export function updateBackground(rangeInput) {
    const value = rangeInput.value;
    const min = rangeInput.min ? rangeInput.min : 0;
    const max = rangeInput.max ? rangeInput.max : 100;
    const percentage = (value - min) / (max - min) * 100;

    rangeInput.addEventListener('mousedown', function () {
        rangeInput.style.setProperty('--thumb-width', '10px');
    })

    rangeInput.addEventListener('mouseup', function () {
        rangeInput.style.setProperty('--thumb-width', '0px');
    })

    rangeInput.style.setProperty('--value', `${percentage}%`);
}