// Variáveis para o controle de cliques e habilidades
let cliques = 0;
let precoHabilidade1 = 100;
let precoHabilidade2 = 500;
let precoAutoClique = 2000;  // Preço da habilidade de auto clique
let habilidadesCompradas1 = 0;
let habilidadesCompradas2 = 0;
let autoCliqueAtivo = false;  // Controle para saber se o AutoClique está ativo
let autoCliqueIntervalo = 1000;  // Intervalo de tempo em milissegundos (1 segundo)
let valorClique = 1;  // Valor do clique inicial é 1
let nivel = 1; // Nível inicial
let cliquesParaProximoNivel = 500; // Quantidade de cliques necessária para o próximo nível
let multiplicadorPrestigio = 1;  // Multiplicador de prestigio (inicia com 1)
let cliquesParaPrestigio = 5000; // Número de cliques necessários para prestigiar

// Variáveis para o sistema de Diamantes
let diamantes = 0; // Diamantes iniciais
let precoBoost30s = 50; // Preço do boost de 30 segundos
let precoBoost30m = 200; // Preço do boost de 30 minutos

// Variáveis para o controle de Boosts
let boostAtivo = false;
let tempoBoostRestante = 0; // Tempo restante do boost
let boostMultiplicador = 2; // Multiplicador de cliques durante o boost

// Variáveis para o sistema de Conquistas
let conquistasAvancadas = [];  // Lista de conquistas avançadas
let conquistasLongoPrazo = [];  // Lista de conquistas de longo prazo
let cliquesLongoPrazo = 0;  // Contador de cliques para as conquistas de longo prazo
let habilidadesCompradasLongoPrazo = 0;  // Contador de habilidades compradas para conquistas de longo prazo

let nome = "Jogador"; // Nome inicial

function editarNome() {
    // Mostra o campo de input e esconde o nome
    const nomeExibicao = document.getElementById('nomeExibicao');
    const nomeInput = document.getElementById('nomeInput');
    const alterarNomeButton = document.getElementById('alterarNomeButton');

    nomeExibicao.style.display = 'none';
    nomeInput.style.display = 'inline-block';
    nomeInput.focus();
    alterarNomeButton.textContent = 'Salvar';
    alterarNomeButton.setAttribute('onclick', 'salvarNome()');
}

function salvarNome() {
    // Salva o novo nome e exibe novamente o nome estático
    const nomeInput = document.getElementById('nomeInput');
    const nomeExibicao = document.getElementById('nomeExibicao');
    const alterarNomeButton = document.getElementById('alterarNomeButton');

    nomeExibicao.textContent = 'Nome: ' + nomeInput.value;
    nomeExibicao.style.display = 'inline-block';
    nomeInput.style.display = 'none';
    alterarNomeButton.textContent = 'Trocar';
    alterarNomeButton.setAttribute('onclick', 'editarNome()');
}

function clicar() {
    // Se o boost estiver ativo, usa o multiplicador do boost
    let multiplicador = boostAtivo ? boostMultiplicador : multiplicadorPrestigio;

    // Incrementa os cliques com base no valor atual do clique e o multiplicador
    cliques += valorClique * multiplicador;
    cliquesLongoPrazo += valorClique * multiplicador; // Conta os cliques acumulados para as conquistas de longo prazo
    document.getElementById('contador').innerText = `Cliques: ${cliques}`;
    document.getElementById('valorClique').innerText = `Valor do Clique: ${valorClique}`;

    // Verifica se os cliques atingiram um múltiplo de 300
    if (cliques % 300 === 0) {
        ganharDiamante();
    }

    verificarNivel();
    verificarConquistas();  // Verifica se o jogador desbloqueou novas conquistas
    atualizarBotaoHabilidades();

    // Se o boost estiver ativo, decrementa o tempo restante
    if (boostAtivo) {
        tempoBoostRestante--;
        if (tempoBoostRestante <= 0) {
            desativarBoost();
        }
    }
}

// Função para ganhar diamantes ao subir de nível
function ganharDiamante() {
    // A cada subida de nível, o jogador ganha 5 diamantes
    if (nivel > 1 && nivel % 5 === 0) {
        diamantes += 5;
        document.getElementById('diamantes').innerText = `Diamantes: ${diamantes}`;
        atualizarBoosts();
    }
}

// Função para comprar o boost de 30 segundos
function comprarBoost30s() {
    if (diamantes >= precoBoost30s) {
        diamantes -= precoBoost30s;
        tempoBoostRestante = 30; // 30 segundos de boost
        boostAtivo = true;
        document.getElementById('diamantes').innerText = `Diamantes: ${diamantes}`;
        document.getElementById('boostStatus').innerText = `Boost de 30s Ativado!`;
        atualizarBoosts();
    } else {
        alert('Diamantes insuficientes para comprar o Boost de 30 segundos!');
    }
}

// Função para comprar o boost de 30 minutos
function comprarBoost30m() {
    if (diamantes >= precoBoost30m) {
        diamantes -= precoBoost30m;
        tempoBoostRestante = 1800; // 30 minutos de boost (em segundos)
        boostAtivo = true;
        document.getElementById('diamantes').innerText = `Diamantes: ${diamantes}`;
        document.getElementById('boostStatus').innerText = `Boost de 30 minutos Ativado!`;
        atualizarBoosts();
    } else {
        alert('Diamantes insuficientes para comprar o Boost de 30 minutos!');
    }
}

// Função para desativar o boost
function desativarBoost() {
    boostAtivo = false;
    document.getElementById('boostStatus').innerText = `Boost Desativado.`;
}

// Função para atualizar os botões de boost
function atualizarBoosts() {
    document.getElementById('comprarBoost30s').innerText = `Preço: ${precoBoost30s} Diamantes (Boost de 30s)`;
    document.getElementById('comprarBoost30m').innerText = `Preço: ${precoBoost30m} Diamantes (Boost de 30m)`;

    document.getElementById('comprarBoost30s').disabled = diamantes < precoBoost30s || boostAtivo;
    document.getElementById('comprarBoost30m').disabled = diamantes < precoBoost30m || boostAtivo;
}

// Funções para o controle de níveis, habilidades e prestígio
function verificarNivel() {
    if (cliques >= cliquesParaProximoNivel) {
        nivel++;
        cliquesParaProximoNivel *= 2;  // Dobra os cliques necessários para o próximo nível
        document.getElementById('nivel').innerText = `Nível: ${nivel}`;
        adicionarConquista(`Você atingiu o Nível ${nivel}!`);
        cliques += 50;
        document.getElementById('contador').innerText = `Cliques: ${cliques}`;
    }
}

function prestigiar() {
    if (cliques >= cliquesParaPrestigio) {
        cliques = 0;
        nivel = 1;
        valorClique = 1;
        habilidadesCompradas1 = 0;
        habilidadesCompradas2 = 0;
        autoCliqueAtivo = false;
        multiplicadorPrestigio *= 1.5;
        cliquesParaPrestigio *= 2;
        document.getElementById('contador').innerText = `Cliques: ${cliques}`;
        document.getElementById('nivel').innerText = `Nível: ${nivel}`;
        document.getElementById('valorClique').innerText = `Valor do Clique: ${valorClique}`;
        adicionarConquista(`Prestígio realizado! Agora você tem um multiplicador de cliques de ${multiplicadorPrestigio}x.`);
        atualizarBotaoHabilidades();
    } else {
        alert(`Você precisa de ${cliquesParaPrestigio} cliques para prestigiar!`);
    }
}

function atualizarBotaoHabilidades() {
    if (cliques >= precoHabilidade1) {
        document.getElementById('comprarHabilidade1').disabled = false;
    } else {
        document.getElementById('comprarHabilidade1').disabled = true;
    }

    if (cliques >= precoHabilidade2) {
        document.getElementById('comprarHabilidade2').disabled = false;
    } else {
        document.getElementById('comprarHabilidade2').disabled = true;
    }

    if (cliques >= precoAutoClique && !autoCliqueAtivo) {
        document.getElementById('comprarAutoClique').disabled = false;
    } else {
        document.getElementById('comprarAutoClique').disabled = true;
    }
}

function comprarHabilidade1() {
    if (cliques >= precoHabilidade1) {
        cliques -= precoHabilidade1;
        habilidadesCompradas1++;
        precoHabilidade1 *= 2;  // O preço dobra a cada compra

        // Aumenta o valor do clique em 1 a cada compra
        valorClique += 1;

        document.getElementById('contador').innerText = `Cliques: ${cliques}`;
        document.getElementById('habilidadeStatus').innerText = `Habilidade 1 adquirida ${habilidadesCompradas1} vezes.`;
        document.getElementById('valorClique').innerText = `Valor do Clique: ${valorClique}`;
        document.getElementById('comprarHabilidade1').innerText = `Comprar Habilidade 1 (${precoHabilidade1} cliques)`;
        atualizarBotaoHabilidades();
        adicionarConquista(`Habilidade 1 comprada ${habilidadesCompradas1} vez(es), agora gera ${valorClique} cliques por vez.`);
        verificarConquistas();  // Verifica as conquistas após a compra de uma habilidade
    }
}


function comprarHabilidade2() {
    if (cliques >= precoHabilidade2) {
        cliques -= precoHabilidade2;
        habilidadesCompradas2++;
        precoHabilidade2 *= 2;  // O preço dobra a cada compra

        // Aumenta o valor do clique em 10 a cada compra
        valorClique += 10;

        document.getElementById('contador').innerText = `Cliques: ${cliques}`;
        document.getElementById('habilidadeStatus').innerText = `Habilidade 2 adquirida ${habilidadesCompradas2} vezes.`;
        document.getElementById('valorClique').innerText = `Valor do Clique: ${valorClique}`;
        document.getElementById('comprarHabilidade2').innerText = `Comprar Habilidade 2 (${precoHabilidade2} cliques)`;
        atualizarBotaoHabilidades();
        adicionarConquista(`Habilidade 2 comprada ${habilidadesCompradas2} vez(es), agora gera ${valorClique} cliques por vez.`);
        verificarConquistas();  // Verifica as conquistas após a compra de uma habilidade
    }
}


function comprarAutoClique() {
    if (cliques >= precoAutoClique) {
        cliques -= precoAutoClique;
        autoCliqueAtivo = true;
        precoAutoClique *= 2;
        document.getElementById('contador').innerText = `Cliques: ${cliques}`;
        document.getElementById('habilidadeStatus').innerText = `AutoClique Ativado!`;
        document.getElementById('comprarAutoClique').innerText = `Comprar AutoClique (${precoAutoClique} cliques)`;
        atualizarBotaoHabilidades();
        adicionarConquista(`AutoClique adquirido!`);
        iniciarAutoClique();
    }
}

function iniciarAutoClique() {
    setInterval(function() {
        if (autoCliqueAtivo) {
            cliques += valorClique;
            document.getElementById('contador').innerText = `Cliques: ${cliques}`;
        }
    }, autoCliqueIntervalo);
}

// Função para exibir as conquistas por 1 minuto e depois removê-las
function adicionarConquista(conquista) {
    let listaConquistas = document.getElementById('conquistasList');
    let li = document.createElement('li');
    li.textContent = conquista;
    li.classList.add('conquista-item');
    listaConquistas.appendChild(li);

    // Remove a conquista após 1 minuto
    setTimeout(() => {
        listaConquistas.removeChild(li);
    }, 60000);  // 60 segundos = 1 minuto
}

// Função para verificar conquistas avançadas e de longo prazo
function verificarConquistas() {
    // Conquistas avançadas
    if (cliques >= 10000 && !conquistasAvancadas.includes('10.000 cliques')) {
        adicionarConquista('Parabéns! Você atingiu 10.000 cliques!');
        conquistasAvancadas.push('10.000 cliques');
    }
    
    if (nivel >= 20 && !conquistasAvancadas.includes('Nível 20')) {
        adicionarConquista('Parabéns! Você atingiu o Nível 20!');
        conquistasAvancadas.push('Nível 20');
    }

    // Conquistas de longo prazo
    if (cliquesLongoPrazo >= 1000 && !conquistasLongoPrazo.includes('1.000 cliques acumulados')) {
        adicionarConquista('Você acumulou 1.000 cliques!');
        conquistasLongoPrazo.push('1.000 cliques acumulados');
    }

    if (habilidadesCompradas1 >= 10 && !conquistasLongoPrazo.includes('10 Habilidades 1 compradas')) {
        adicionarConquista('Você comprou 10 vezes a Habilidade 1!');
        conquistasLongoPrazo.push('10 Habilidades 1 compradas');
    }
}

// Função para limpar as conquistas
function limparConquistas() {
    let listaConquistas = document.getElementById('conquistasList');
    listaConquistas.innerHTML = '';
}