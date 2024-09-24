// Pega todas as células
const cells = document.querySelectorAll('.cell');

let isClickEnabled = true;
let clicked = false;

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

//Pega as músicas do arquivo songs.json
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
    const hitbox = document.createElement('div');

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

    cell.appendChild(circle);

    // circle.addEventListener('mouseover', () => {
    //     circle.style.background = '#000000'; // Muda a cor para vermelho
    // });

    circle.offsetWidth;

    // Animação de crescimento do círculo
    setTimeout(() => {
        circle.style.width = '100%';
        circle.style.height = '100%';
    }, 0);

    // Remove o círculo após o tempo de exibição
    setTimeout(() => {
        if (!clicked) {
            dispareScore(0);
        }
        circle.remove();
        clicked = false; //Reset do click
    }, duration);

    //Clique e afins
    document.addEventListener('click', (event) => {
        if(!isClickEnabled) return;
        const cell = event.target.closest('.cell'); // Verifica clique na célula

        if (cell) {
            const circle = cell.querySelector('.circle');

            if (circle) {

                clicked = true;

                circle.style.background = '#000000';

                const clickTime = performance.now(); // Pega o tempo do clique (em milissegundos)

                calculateClickPrecision(clickTime); // Chama a função para calcular a precisão do clique
                isClickEnabled = false;
            }

            setTimeout(() => {
                isClickEnabled = true;
            }, 50);
        }
    });
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

function getNextCellIndex(currentIndex, nextCurrentIndex) {
    // Obtém um índice de célula diferente do índice atual
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * cells.length);
    } while (newIndex === currentIndex || newIndex === nextCurrentIndex);
    return newIndex;
}

function showCirclesRandomly(interval) {
    // Se for a primeira célula a ser usada, defina a célula inicial
    if (lastCellIndex === -1) {
        lastCellIndex = Math.floor(Math.random() * cells.length);
        nextCellIndex = Math.floor(Math.random() * cells.length);
    }

    // Atualiza a célula atual e calcula as próximas células
    nextAgainCellIndex = getNextCellIndex(lastCellIndex, nextCellIndex);

    // Cria o círculo na célula atual
    const currentCell = cells[lastCellIndex];
    createCircle(currentCell, interval);

    // Cria o círculo de previsão na próxima célula
    const nextCell = cells[nextCellIndex];
    createCirclePredict(nextCell, interval, 1);

    const nextAgainCell = cells[nextAgainCellIndex];
    createCirclePredict(nextAgainCell, interval, 2);  // Função para criar o círculo de previsão

    // Atualiza o índice da última célula
    lastCellIndex = nextCellIndex;
    nextCellIndex = nextAgainCellIndex;
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

let globalCurrentBeatTime;
let globalInterval;

// Define o tempo de disparo dos círculos
function dispareCircles(beats) {
    let previousBeatTime = 0;

    beats.forEach((currentBeatTime) => {
        const interval = currentBeatTime - previousBeatTime;
        setTimeout(() => {
            globalCurrentBeatTime = currentBeatTime;
            globalInterval = interval;
            showCirclesRandomly(interval);
        }, previousBeatTime);

        previousBeatTime = currentBeatTime;
    });
}

function calculateClickPrecision(clickTime) {
    let clickPrecision = globalCurrentBeatTime - clickTime;
    clickPrecision = (globalInterval - clickPrecision) * 100 / globalInterval;
    console.log("clique:", clickPrecision, "intervalo:", globalInterval, "tempo do clique:", clickTime, "tempo do beat:", globalCurrentBeatTime);

    dispareScore(clickPrecision);
}

function dispareScore(clickPrecision) {
    if (clickPrecision > 75) {
        console.log("Perfect");
    } else if (clickPrecision > 50) {
        console.log("Good");
    } else if (clickPrecision > 25) {
        console.log("Ok");
    } else {
        console.log("Bad");
        displayRandomImage();
    }
}

// Toca a música selecionada
function playSelectedSong(songIndex) {
    const selectedSong = songs[songIndex];
    if (selectedSong) {
        dispareCircles(selectedSong.beats);
    }
}

function displayRandomImage() {
    const img = document.createElement('img');
    img.src = './yatoBed.jpg'; // Substitua pelo caminho da sua imagem
    img.style.position = 'absolute'; // Para permitir o posicionamento aleatório
    img.style.width = '100px'; // Ajuste o tamanho conforme necessário
    img.style.height = '100px'; // Ajuste o tamanho conforme necessário

    // Calcula posições aleatórias
    const x = Math.random() * (window.innerWidth - 100); // Largura da imagem
    const y = Math.random() * (window.innerHeight - 100); // Altura da imagem
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    document.body.appendChild(img); // Adiciona a imagem ao corpo da página

    // Opcional: Remove a imagem após um tempo
    setTimeout(() => {
        img.remove();
    }, 400); // Remove após 2 segundos
}
