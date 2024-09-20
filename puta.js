// Pega todas as células
const cells = document.querySelectorAll('.cell');

// Songs and beats in milliseconds
const songs = [
    {
        music: "A",
        beats: Array.from({ length: 570 }, (_, i) => (i + 1) * (60000 / 116.924)) // Exemplo: [ interval, 2 * interval, ... ]
    },
    {
        music: "B",
        beats: [600, 1200, 1800, 2400, 3000, 3600, 4200, 4800, 5400]
    }
];

// Criação e aparência do círculo
function createCircle(cell, duration) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.width = '0px';
    circle.style.height = '0px';
    circle.style.borderRadius = '50%';
    circle.style.background = 'radial-gradient(circle, #fff, #ccc)';
    circle.style.position = 'absolute';
    circle.style.top = '50%';
    circle.style.left = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.transition = `width ${duration}ms, height ${duration}ms`;

    // Adiciona o círculo à célula
    cell.appendChild(circle);

    circle.offsetWidth;

    // Animação de crescimento do círculo
    setTimeout(() => {
        circle.style.width = '100%';
        circle.style.height = '100%';
    }, 0);

    // Remove o círculo após o tempo de exibição
    setTimeout(() => {
        circle.remove();
    }, duration - 5);
}

let lastCellIndex = null; // Armazena o índice da última célula

// Exibe círculos aleatoriamente
function showCirclesRandomly() {

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * cells.length);
    } while (randomIndex === lastCellIndex)

    lastCellIndex = randomIndex;
    const randomCell = cells[randomIndex];
    createCircle(randomCell, 500); // Defina o tempo de duração para o círculo, se necessário
}

// Reproduz a música e exibe os círculos
function playSong(beats) {
    let previousBeatTime = 0;

    beats.forEach((currentBeatTime) => {
        const delay = currentBeatTime - previousBeatTime;
        setTimeout(() => {
            showCirclesRandomly();
        }, previousBeatTime);

        previousBeatTime = currentBeatTime; // Atualiza o tempo da batida anterior
    });
}

// Toca a música selecionada
function playSelectedSong(songIndex) {
    const selectedSong = songs[songIndex];
    if (selectedSong) {
        playSong(selectedSong.beats);
    }
}

// Toca a música A
window.addEventListener('load', () => {
    playSelectedSong(0);
});
