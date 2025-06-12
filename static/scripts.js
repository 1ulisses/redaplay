document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os itens de lição
    const itensLicao = document.querySelectorAll('.item-licao');

    // Função para atualizar o status visual da lição
    const atualizarStatusLicao = (idLicao, estaConcluido, estaDesabilitado, estaBloqueado) => {
        // Encontra o item da lição pelo seu ID
        const itemLicao = document.querySelector(`.item-licao[data-id-licao="${idLicao}"]`);
        if (!itemLicao) return; // Sai se o item não for encontrado

        if (estaConcluido) {
            itemLicao.classList.add('concluido');
            itemLicao.classList.remove('desabilitado', 'bloqueado');
            itemLicao.style.pointerEvents = 'auto'; // Garante que seja clicável mesmo se concluído
            itemLicao.href = `licao${idLicao}.html`; // Garante que o link esteja definido
        } else if (estaDesabilitado && estaBloqueado) {
            itemLicao.classList.remove('concluido');
            itemLicao.classList.add('desabilitado', 'bloqueado');
            itemLicao.style.pointerEvents = 'none'; // Desabilita o clique
            itemLicao.href = '#'; // Previne navegação
        } else { // Este é o estado da lição "ativa" ou "próxima"
            itemLicao.classList.remove('concluido', 'desabilitado', 'bloqueado');
            itemLicao.style.pointerEvents = 'auto'; // Habilita o clique
            itemLicao.href = `licao${idLicao}.html`; // Restaura o link
        }
    };

    // Carrega os status iniciais das lições do localStorage e aplica as classes corretas
    const carregarStatusLicoes = () => {
        // Primeiro, marca todas as lições como desabilitadas/bloqueadas por padrão, exceto a primeira
        itensLicao.forEach(item => {
            const idLicao = parseInt(item.dataset.idLicao);
            if (idLicao > 1) { // Todas as lições após a primeira são inicialmente bloqueadas
                atualizarStatusLicao(idLicao, false, true, true);
            }
        });

        // Em seguida, verifica e habilita as lições com base no localStorage
        for (let i = 1; i <= itensLicao.length; i++) {
            const estaConcluido = localStorage.getItem(`licao-${i}-concluido`) === 'true';
            if (estaConcluido) {
                atualizarStatusLicao(i, true, false, false); // Marca como concluída
            } else {
                // Se a lição atual NÃO está concluída, verifica se a anterior ESTÁ concluída
                // Isso significa que a lição atual deve ser ativa (não bloqueada)
                if (i === 1 || localStorage.getItem(`licao-${i-1}-concluido`) === 'true') {
                    atualizarStatusLicao(i, false, false, false); // Marca como ativa/próxima
                }
            }
        }
    };

    carregarStatusLicoes(); // Chama ao carregar a página

    // Adiciona o evento de clique a cada item de lição
    itensLicao.forEach(item => {
        item.addEventListener('click', (evento) => {
            const idLicao = parseInt(item.dataset.idLicao);

            // Somente prossegue se a lição NÃO estiver desabilitada/bloqueada
            if (!item.classList.contains('desabilitado') && !item.classList.contains('bloqueado')) {
                // Marca a lição atual como concluída no localStorage
                localStorage.setItem(`licao-${idLicao}-concluido`, 'true');
                atualizarStatusLicao(idLicao, true, false, false); // Atualiza visualmente a lição atual

                // Habilita a próxima lição
                const proximoIdLicao = idLicao + 1;
                if (proximoIdLicao <= itensLicao.length) {
                    // Marca a próxima lição como ativa/próxima (não concluída, não desabilitada, não bloqueada)
                    atualizarStatusLicao(proximoIdLicao, false, false, false);
                }
            } else {
                // Previne a navegação se desabilitado
                evento.preventDefault();
            }
        });
    });
});