export const startVisualizer = (VisualizerAudio, audioContext) => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const source = audioContext.createMediaElementSource(VisualizerAudio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvas = document.getElementById("visualizerCanvas");
    const ctx = canvas.getContext("2d");

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        dataArray.forEach((value) => {
            const barHeight = value / 2;
            ctx.fillStyle = `rgb(${value + 100}, 50, 150)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        });
    }

    renderFrame();
};
