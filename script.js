// Pega todas as células
const cells = document.querySelectorAll('.cell');

//Músicas e beats em millissegundos
// const songs = [
//     {
//         music: "A",
//         beats: Array.from({ length: 570 }, (_, i) => (i + 1) * (60000 / 116.924)) //Aproximadamente 513.15 por beat
//     },
//     {
//         music: "B",
//         beats: [600, 1200, 1800, 2400, 3000, 3600, 4200, 4800, 5400]
//     }
// ];
let songs;
window.addEventListener('load', () => {
    fetch('./songs.json')
    .then(response => response.json())
    .then(data => {
        songs = data;
        playSelectedSong(2); // Chama a música depois de carregar
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
});

// Criação e aparência do círculo clicável
function createCircle(cell, duration) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.width = '0px';
    circle.style.height = '0px';
    circle.style.borderRadius = '50%';
    circle.style.background = '#15E0D4';
    circle.style.position = 'absolute';
    circle.style.top = '50%';
    circle.style.left = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.transition = `width ${duration}ms, height ${duration}ms`;

    // Adiciona o círculo à célula
    cell.appendChild(circle);

    circle.addEventListener('mouseover', () => {
        circle.style.background = '#000000'; // Muda a cor para vermelho
    });

    circle.offsetWidth;

    // Animação de crescimento do círculo
    setTimeout(() => {
        circle.style.width = '100%';
        circle.style.height = '100%';
    }, 0);

    // Remove o círculo após o tempo de exibição
    setTimeout(() => {
        circle.remove();
    }, duration);
}

// Criação e aparência do círculo predict
function createCirclePredict(cell, duration, number) {
    const predictCircle = document.createElement('div');
    predictCircle.classList.add('predict-circle');
    predictCircle.style.width = '30%';
    predictCircle.style.height = '30%';
    predictCircle.style.borderRadius = '50%';
    if (number == 1) {
        predictCircle.style.background = '#DE3AF5'
    } else {
        predictCircle.style.background = '#49F03A';
    }
    predictCircle.style.position = 'absolute';
    predictCircle.style.top = '50%';
    predictCircle.style.left = '50%';
    predictCircle.style.transform = 'translate(-50%, -50%)';
    //const animationDuration = duration * 1.5;

    // Adiciona o círculo à célula
    cell.appendChild(predictCircle);

    //predictCircle.offsetWidth;

    // // Animação da diminuição do círculo
    // predictCircle.animate([
    //     { transform: 'translate(-50%, -50%) scale(1)' },
    //     { transform: 'translate(-50%, -50%) scale(0)' }
    // ], {
    //     duration: animationDuration,
    //     easing: 'linear',
    // });

    // Remove o círculo predict após a duração
    setTimeout(() => {
        predictCircle.remove();
    }, duration);
}

// Armazena o índice da última célula
let lastCellIndex = -1;
let nextCellIndex;
let nextAgainCellIndex;

function getNextCellIndex(currentIndex) {
    // Obtém um índice de célula diferente do índice atual
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * cells.length);
    } while (newIndex === currentIndex);
    return newIndex;
}

function showCirclesRandomly(interval) {
    // Se for a primeira célula a ser usada, defina a célula inicial
    if (lastCellIndex === -1) {
        lastCellIndex = Math.floor(Math.random() * cells.length);
    }

    // Atualiza a célula atual e calcula as próximas células
    nextCellIndex = getNextCellIndex(lastCellIndex);

    // Cria o círculo na célula atual
    const currentCell = cells[lastCellIndex];
    createCircle(currentCell, interval);

    // Cria o círculo de previsão na próxima célula
    const nextCell = cells[nextCellIndex];
    createCirclePredict(nextCell, interval, 1);  // Função para criar o círculo de previsão

    // Atualiza o índice da última célula
    lastCellIndex = nextCellIndex;
}

// function showCirclesRandomly(interval) {
//
//     let randomIndex;
//
//     // Define a posição aleatória dos círculos
//     do {
//         randomIndex = Math.floor(Math.random() * cells.length);
//     } while (randomIndex === lastCellIndex)
//
//     lastCellIndex = randomIndex;
//     const randomCell = cells[randomIndex];
//     createCircle(randomCell, interval);
// }

// Define o tempo de disparo dos círculos
function dispareCircles(beats) {
    let previousBeatTime = 0;

    beats.forEach((currentBeatTime) => {
        const interval = currentBeatTime - previousBeatTime;
        setTimeout(() => {
            showCirclesRandomly(interval);
        }, previousBeatTime);

        previousBeatTime = currentBeatTime;
    });
}

// Toca a música selecionada
function playSelectedSong(songIndex) {
    const selectedSong = songs[songIndex];
    if (selectedSong) {
        dispareCircles(selectedSong.beats);
    }
}
