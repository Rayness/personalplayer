export function startVisualizer(canvas, audioFileInput) {
    const ctx = canvas.getContext("2d");
  
    audioFileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const reader = new FileReader();
  
        reader.onload = function(e) {
          audioContext.decodeAudioData(e.target.result, (buffer) => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
  
            // Создаем анализатор
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
  
            // Подключаем источник к анализатору и далее на вывод
            source.connect(analyser);
            analyser.connect(audioContext.destination);
  
            // Функция анимации
            function draw() {
              requestAnimationFrame(draw);
  
              analyser.getByteFrequencyData(dataArray);
  
              ctx.clearRect(0, 0, canvas.width, canvas.height);
  
              const barWidth = (canvas.width / bufferLength) * 2.5;
              let barHeight;
              let x = 0;
  
              for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
              }
            }
  
            draw();
            source.start();
          });
        };
  
        reader.readAsArrayBuffer(file);
      }
    });
  }
  