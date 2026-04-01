// ─── Estado da aplicação ───────────────────────────────────────────────────
let carrinho = [];
let favoritos = [];
let likes = JSON.parse(localStorage.getItem('produtoLikes') || '{}');

// ─── Autenticação ──────────────────────────────────────────────────────────
function logar() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // Auto-preencher email no perfil se veio do login
    const emailLogin = document.getElementById('loginEmail').value;
    if(emailLogin && !document.getElementById('perfilEmail').value) {
        document.getElementById('perfilEmail').value = emailLogin;
    }

    const nomePerfil = document.getElementById('perfilNome').value;
    if (nomePerfil) {
        showToast(`Bem-vinda de volta, ${nomePerfil.split(' ')[0]}! 💄`);
    } else {
        showToast('Bem-vinda de volta! 💄');
    }
}

function mostrarAuthForm(formId) {
    document.getElementById('authMain').style.display = 'none';
    document.getElementById('authLogin').style.display = 'none';
    document.getElementById('authRecuperar').style.display = 'none';
    document.getElementById('authCadastro').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
}

function iniciarLoginGoogleReal() {
    const popup = window.open('', 'GoogleLogin', 'width=450,height=550,left=150,top=150');
    if(popup) {
        popup.document.write(`
            <html><head><title>Fazer login nas Contas do Google</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; text-align: center; padding: 40px 20px; background: #fff; color: #202124; }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid #4285F4; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 30px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
            </head><body>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="60">
            <h3>Conectando com o Google...</h3>
            <p style="font-size: 14px; color: #5f6368;">Aguarde enquanto autenticamos sua conta neste aparelho.</p>
            <div class="loader"></div>
            <script>
                setTimeout(() => {
                    window.opener.postMessage('google_login_success', '*');
                    window.close();
                }, 2000);
            </script>
            </body></html>
        `);
    } else {
        setTimeout(() => logarComGoogleSuccess(), 1500);
    }
}

window.addEventListener('message', (event) => {
    if(event.data === 'google_login_success') {
        logarComGoogleSuccess();
    }
});

function logarComGoogleSuccess() {
    document.getElementById('perfilNome').value = 'Usuário Google';
    document.getElementById('perfilEmail').value = 'usuario.google@gmail.com';
    logar();
}

function enviarRecuperacao() {
    const email = document.getElementById('recuperarEmail').value;
    if (!email || !email.includes('@')) return showToast('Informe um e-mail válido! 📧');
    showToast('Link de recuperação enviado para: ' + email);
    setTimeout(() => mostrarAuthForm('authLogin'), 2000);
}

function cadastrarConta() {
    const nome = document.getElementById('cadNome').value;
    const email = document.getElementById('cadEmail').value;
    const senha = document.getElementById('cadSenha').value;
    
    if (!nome || !email || !senha) return showToast('Preencha todos os campos! 📝');
    
    document.getElementById('perfilNome').value = nome;
    document.getElementById('perfilEmail').value = email;
    showToast('Conta criada com sucesso! 🎉');
    logar();
}

function fecharGoogleMock() { /* mock legado */ }

// ─── Toast notification ────────────────────────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── Vídeos ────────────────────────────────────────────────────────────────
function playVideo(url) {
    const iframe = document.getElementById('videoIframe');
    if (iframe) {
        iframe.src = url;
        document.getElementById('videoModal').style.display = 'flex';
    }
}

function fecharVideo(event, force = false) {
    if (!force && event && event.target.id !== 'videoModal') return;
    const iframe = document.getElementById('videoIframe');
    if (iframe) iframe.src = '';
    document.getElementById('videoModal').style.display = 'none';
}

function abrirVideoDetalhes(url, title) {
    const iframe = document.getElementById('videoIframe');
    if (iframe) iframe.src = url;
    
    document.getElementById('videoInfoTitle').textContent = title;
    
    const descricoesVideos = {
        'Delineado Gatinho': { desc: 'Aprenda a fazer o delineado gatinho perfeito, ideal para iniciantes.', produtos: ['Delineador Caneta', 'Fita Adesiva', 'Cotonete'] },
        'Pele Glow Natural': { desc: 'Tutorial de uma pele iluminada e natural, perfeita para o dia a dia.', produtos: ['Base Cremosa', 'Iluminador Glow', 'Blush Pêssego'] },
        'Contorno Fácil': { desc: 'Descubra como contornar seu rosto de maneira simples e rápida.', produtos: ['Duo de Contorno', 'Kit Pincéis', 'Esponja de Make'] },
        'Make Madrinha': { desc: 'Maquiagem sofisticada para eventos especiais.', produtos: ['Base Matte HD', 'Paleta de Sombras', 'Batom Matte Velvet'] }
    };
    
    const detalhes = descricoesVideos[title] || {
        desc: 'Tutorial incrível para você aprimorar suas técnicas de maquiagem. Aprenda e arrase com este visual maravilhoso!',
        produtos: ['Base Matte HD', 'Máscara de Cílios', 'Iluminador Glow']
    };
    
    document.getElementById('videoInfoDesc').textContent = detalhes.desc;
    document.getElementById('videoInfoProducts').innerHTML = detalhes.produtos.map(p => `<li>✨ ${p}</li>`).join('');
    
    document.getElementById('videoModal').style.display = 'flex';
}

// ─── Carrinho ──────────────────────────────────────────────────────────────
function addCart(nome, preco, imgUrl = null) {
    if (!imgUrl) {
        // Buscar a imagem no DOM caso o clique venha da tela inicial original
        imgUrl = 'https://picsum.photos/seed/placeholder/90/90';
        const cards = document.querySelectorAll('.product-card');
        for (let card of cards) {
            const h3 = card.querySelector('h3');
            if (h3 && h3.innerText === nome) {
                imgUrl = card.querySelector('img').src;
                break;
            }
        }
    }
    
    carrinho.push({ nome, preco, imgUrl });
    document.getElementById('cart-count').innerText = carrinho.length;
    showToast(`✨ ${nome} adicionado ao carrinho!`);
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    document.getElementById('cart-count').innerText = carrinho.length;
    showToast('Item removido! 🗑️');
    if (carrinho.length === 0) {
        fecharCarrinho();
    } else {
        abrirCarrinho();
    }
}

function abrirCarrinho() {
    if (carrinho.length === 0) return showToast('Seu carrinho está vazio! 🛒');

    const lista = document.getElementById('lista-carrinho');
    lista.innerHTML = carrinho.map((i, index) => `
        <div class="cart-item">
            <img src="${i.imgUrl}" alt="${i.nome}">
            <div class="info">
                <p>✨ ${i.nome}</p>
                <p class="price">R$ ${i.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            <span onclick="removerDoCarrinho(${index})" title="Remover item" style="color:var(--text-muted); cursor:pointer; font-size:18px; padding-left:10px;">🗑️</span>
        </div>
    `).join('');

    // Calcular total
    const total = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const totalFormatado = 'R$ ' + total.toFixed(2).replace('.', ',');
    
    const valorCarrinho = document.getElementById('total-carrinho-valor');
    if (valorCarrinho) valorCarrinho.textContent = totalFormatado;
    
    const valorCheckout = document.getElementById('total-valor');
    if (valorCheckout) valorCheckout.textContent = totalFormatado;

    document.getElementById('carrinhoModal').style.display = 'flex';
}

function fecharCarrinho() {
    document.getElementById('carrinhoModal').style.display = 'none';
}

function irParaCadastroCompra() {
    fecharCarrinho();
    document.getElementById('checkoutModal').style.display = 'flex';
    document.getElementById('formaPagamento').value = 'cartao';
    verificarPix(); // Reseta valor sem/com desconto
}

function voltarParaCarrinho() {
    fecharCheckout();
    abrirCarrinho();
}

function fecharCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// ─── Pix / Comprovante ─────────────────────────────────────────────────────
function verificarPix() {
    const pag = document.getElementById('formaPagamento').value;
    const area = document.getElementById('areaComprovante');
    area.style.display = pag === 'pix' ? 'block' : 'none';

    // Atualizar total com desconto Pix
    const total = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const totalFinal = pag === 'pix' ? total * 0.9 : total;
    document.getElementById('total-valor').textContent =
        'R$ ' + totalFinal.toFixed(2).replace('.', ',') + (pag === 'pix' ? ' 🎉' : '');
}

// ─── Confirmar pedido ──────────────────────────────────────────────────────
let rotaInterval = null;
const INTERVALO_ROTA = 4 * 60 * 60 * 1000; // 4 horas em milissegundos

function confirmarPedido() {
    const nome = document.getElementById('nomeCliente').value.trim();
    const cpf = document.getElementById('cpfCliente').value.trim();
    const email = document.getElementById('emailCliente').value.trim();
    const endereco = document.getElementById('endCliente').value.trim();

    if (!nome) return showToast('Informe seu nome completo! 📝');
    if (!cpf) return showToast('Informe seu CPF! 📝');
    if (!email || !email.includes('@')) return showToast('Informe um e-mail válido! 📧');
    if (!endereco) return showToast('Informe seu endereço! 📍');

    fecharCheckout();

    // Salvar dados do pedido e timestamp no localStorage
    const pedido = {
        timestamp: Date.now(),
        email: email,
        endereco: endereco
    };
    localStorage.setItem('pedidoAtivo', JSON.stringify(pedido));

    // Atualiza Modal Rota de Entrega
    document.getElementById('entregaEmail').innerText = email;
    document.getElementById('entregaEnd').innerText = endereco;

    // Limpar carrinho e campos
    carrinho = [];
    document.getElementById('cart-count').innerText = 0;
    document.getElementById('nomeCliente').value = '';
    document.getElementById('cpfCliente').value = '';
    document.getElementById('emailCliente').value = '';
    document.getElementById('endCliente').value = '';
    
    const listaResumo = document.getElementById('lista-resumo');
    if (listaResumo) listaResumo.innerHTML = '';
    
    const listaCarrinho = document.getElementById('lista-carrinho');
    if (listaCarrinho) listaCarrinho.innerHTML = '';
    
    document.getElementById('formaPagamento').value = 'cartao';
    document.getElementById('areaComprovante').style.display = 'none';

    // Atualizar rota e abrir modal
    atualizarRota();
    iniciarTimerRota();
    document.getElementById('entregaModal').style.display = 'flex';
}

function formatarHora(timestamp) {
    const data = new Date(timestamp);
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatarContagem(ms) {
    const horas = Math.floor(ms / (60 * 60 * 1000));
    const minutos = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${horas}h ${minutos}min`;
}

function atualizarRota() {
    const pedidoStr = localStorage.getItem('pedidoAtivo');
    if (!pedidoStr) return;

    const pedido = JSON.parse(pedidoStr);
    const agora = Date.now();
    const decorrido = agora - pedido.timestamp;

    // Determinar passo atual (muda a cada 4 horas)
    // 0-4h: passo 1 (Preparando) | 4-8h: passo 2 (Em trânsito) | 8h+: passo 3 (Entregue)
    let passoAtual;
    if (decorrido >= INTERVALO_ROTA * 2) {
        passoAtual = 3;
    } else if (decorrido >= INTERVALO_ROTA) {
        passoAtual = 2;
    } else {
        passoAtual = 1;
    }

    // Atualizar info no modal
    document.getElementById('entregaEmail').innerText = pedido.email;
    document.getElementById('entregaEnd').innerText = pedido.endereco;

    // Atualizar os 3 passos visualmente
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('dot' + i);
        const label = document.getElementById('label' + i);
        const hora = document.getElementById('hora' + i);

        // Limpar classes
        dot.className = 'rota-dot';
        label.className = 'rota-label';

        if (i < passoAtual) {
            // Passo já concluído
            dot.classList.add('rota-completo');
            label.classList.add('rota-label-completo');
            const timestampPasso = pedido.timestamp + INTERVALO_ROTA * (i - 1);
            hora.textContent = '✓ ' + formatarHora(timestampPasso);
        } else if (i === passoAtual) {
            // Passo atual (ativo)
            dot.classList.add('rota-ativo');
            label.classList.add('rota-label-ativo');
            if (i === 1) {
                hora.textContent = 'Iniciado: ' + formatarHora(pedido.timestamp);
            } else {
                const timestampPasso = pedido.timestamp + INTERVALO_ROTA * (i - 1);
                hora.textContent = 'Desde: ' + formatarHora(timestampPasso);
            }
        } else {
            // Passo futuro
            hora.textContent = 'Previsto em breve...';
        }
    }

    // Timer de contagem regressiva para o próximo passo
    const timerEl = document.getElementById('rotaTimer');
    if (passoAtual < 3) {
        const proximoPasso = pedido.timestamp + INTERVALO_ROTA * passoAtual;
        const faltam = proximoPasso - agora;
        timerEl.textContent = '⏱ Próxima atualização em: ' + formatarContagem(faltam);
    } else {
        timerEl.textContent = '🎉 Pedido entregue com sucesso!';
        // Limpar pedido do localStorage quando entregue
        pararTimerRota();
    }
}

function iniciarTimerRota() {
    pararTimerRota();
    // Atualizar a cada 30 segundos
    rotaInterval = setInterval(() => {
        atualizarRota();
    }, 30000);
}

function pararTimerRota() {
    if (rotaInterval) {
        clearInterval(rotaInterval);
        rotaInterval = null;
    }
}

function abrirEntrega() {
    const pedidoStr = localStorage.getItem('pedidoAtivo');
    if (!pedidoStr) return showToast('Nenhum pedido ativo! 📦');
    atualizarRota();
    iniciarTimerRota();
    document.getElementById('entregaModal').style.display = 'flex';
}

function fecharEntrega() {
    document.getElementById('entregaModal').style.display = 'none';
    pararTimerRota();
}

function abrirSobre() {
    document.getElementById('sobreModal').style.display = 'flex';
}

function fecharSobre() {
    document.getElementById('sobreModal').style.display = 'none';
}

// ─── Curtidas (Likes) ──────────────────────────────────────────────────────
function curtir(nome, btn) {
    if (!likes[nome]) likes[nome] = 0;
    likes[nome]++;
    localStorage.setItem('produtoLikes', JSON.stringify(likes));

    // Atualizar contador no botão
    const countEl = btn.querySelector('.like-count');
    if (countEl) countEl.textContent = likes[nome];

    // Animação de pulse
    btn.classList.add('like-pulse');
    setTimeout(() => btn.classList.remove('like-pulse'), 400);

    // Atualizar contagem no header
    const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0);
    document.getElementById('fav-count').innerText = totalLikes;

    showToast(`❤️ ${nome} curtido! (${likes[nome]}x)`);

    // Reordenar produtos
    reordenarProdutos();
}

function reordenarProdutos() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
        const nomeA = a.querySelector('h3').innerText;
        const nomeB = b.querySelector('h3').innerText;
        return (likes[nomeB] || 0) - (likes[nomeA] || 0);
    });

    cards.forEach(card => grid.appendChild(card));
}

function abrirFavoritos() {
    const lista = document.getElementById('lista-favoritos-salvos');

    // Pegar produtos com curtidas e ordenar
    const ranking = Object.entries(likes)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);

    if (ranking.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Nenhum produto curtido ainda.</p>';
    } else {
        const medals = ['🥇', '🥈', '🥉'];
        lista.innerHTML = ranking.map(([nome, count], i) => {
            const medal = i < 3 ? medals[i] : '⭐';
            return `<p>${medal} <strong>${nome}</strong> — ${count} curtida${count > 1 ? 's' : ''}</p>`;
        }).join('');
    }
    document.getElementById('favoritosModal').style.display = 'flex';
}

function fecharFavoritos() {
    document.getElementById('favoritosModal').style.display = 'none';
}

// ─── Normalizar texto (remover acentos) ─────────────────────────────────────
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// ─── Verificar se o termo combina com o texto ───────────────────────────────
function textoCorresponde(texto, termo) {
    const textoNorm = normalizarTexto(texto);
    const termoNorm = normalizarTexto(termo);

    // Busca direta (substring)
    if (textoNorm.includes(termoNorm)) return true;

    // Busca por palavras: cada palavra do termo precisa aparecer no texto
    const palavrasTermo = termoNorm.split(/\s+/).filter(p => p.length > 0);
    if (palavrasTermo.length > 1) {
        return palavrasTermo.every(palavra => textoNorm.includes(palavra));
    }

    return false;
}

// ─── Busca de produtos e vídeos ─────────────────────────────────────────────
function filtrarProdutos() {
    const termo = document.getElementById('input-busca').value.trim();
    let encontrouProduto = false;
    let encontrouVideo = false;
    let primeiroVideoMatch = null;

    const produtos = document.querySelectorAll('.product-card');
    produtos.forEach(produto => {
        const nomeProduto = produto.querySelector('h3').innerText;
        const match = !termo || textoCorresponde(nomeProduto, termo);

        produto.style.display = match ? 'block' : 'none';

        if (match && termo) {
            produto.style.borderColor = 'rgba(233, 30, 140, 0.5)';
            produto.style.boxShadow = '0 0 15px rgba(233, 30, 140, 0.2)';
            encontrouProduto = true;
        } else {
            produto.style.borderColor = '';
            produto.style.boxShadow = '';
        }
    });

    const videos = document.querySelectorAll('.video-item');
    videos.forEach(video => {
        const nomeVideo = video.querySelector('p').innerText;
        const match = !termo || textoCorresponde(nomeVideo, termo);
        video.style.display = match ? '' : 'none';

        if (match && termo) {
            encontrouVideo = true;
            // Destaque visual no vídeo encontrado
            video.style.borderColor = 'rgba(233, 30, 140, 0.7)';
            video.style.boxShadow = '0 0 20px rgba(233, 30, 140, 0.4), 0 0 40px rgba(189, 110, 209, 0.2)';
            video.style.transform = 'scale(1.04)';
            if (!primeiroVideoMatch) primeiroVideoMatch = video;
        } else {
            video.style.borderColor = '';
            video.style.boxShadow = '';
            video.style.transform = '';
        }
    });

    // Scroll automático até o primeiro vídeo encontrado
    if (primeiroVideoMatch) {
        primeiroVideoMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Encontrar as seções pelo conteúdo interno (mais robusto)
    const secaoTutoriais = document.querySelector('.video-grid')?.closest('section');
    const secaoProdutos = document.querySelector('.product-grid')?.closest('section');

    // Ocultar a seção inteira se não tiver resultado nela
    if (termo) {
        if (secaoTutoriais) secaoTutoriais.style.display = encontrouVideo ? 'block' : 'none';
        if (secaoProdutos) secaoProdutos.style.display = encontrouProduto ? 'block' : 'none';
    } else {
        if (secaoTutoriais) secaoTutoriais.style.display = 'block';
        if (secaoProdutos) secaoProdutos.style.display = 'block';
    }

    if (termo && !encontrouProduto && !encontrouVideo) {
        showToast('Nenhum resultado encontrado! 🔍');
    }
}

// ─── Produtos e Perfil (Modais) ────────────────────────────────────────────
function abrirProduto(nome, preco, desc, imgUrl) {
    document.getElementById('modalProdutoNome').textContent = nome;
    document.getElementById('modalProdutoPreco').textContent = 'R$ ' + preco.toFixed(2).replace('.', ',');
    document.getElementById('modalProdutoDesc').textContent = desc;
    document.getElementById('modalProdutoImg').src = imgUrl;
    
    document.getElementById('btnModalComprar').onclick = () => {
        addCart(nome, preco, imgUrl);
        fecharProduto();
    };
    
    document.getElementById('produtoModal').style.display = 'flex';
}

function fecharProduto() {
    document.getElementById('produtoModal').style.display = 'none';
}

function abrirPerfil() {
    document.getElementById('perfilModal').style.display = 'flex';
}

function fecharPerfil() {
    document.getElementById('perfilModal').style.display = 'none';
}

function sairDaConta() {
    fecharPerfil();
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('perfilNome').value = '';
    document.getElementById('perfilSenha').value = '';
    carrinho = [];
    document.getElementById('cart-count').innerText = 0;
    mostrarAuthForm('authLogin');
    showToast('Você saiu da conta! 👋');
}

function trocarConta() {
    sairDaConta();
    mostrarAuthForm('authMain');
}

function salvarPerfil() {
    const nome = document.getElementById('perfilNome').value;
    if(!nome) return showToast('Preencha seu nome para salvar! 📝');
    showToast('Dados salvos com sucesso! ✨');
    fecharPerfil();
}

// ─── Enter na busca ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Descrições para os produtos existentes
    const descricoes = {
        'Batom Matte Velvet': 'Batom de alta fixação com acabamento matte aveludado, ideal para o dia a dia e não transfere.',
        'Base Matte HD': 'Cobertura incrível que disfarça imperfeições e deixa a pele com efeito HD o dia todo sem derreter.',
        'Paleta de Sombras': '12 cores super pigmentadas entre opacas e cintilantes para você criar os melhores looks.',
        'Máscara de Cílios': 'Efeito cílios postiços: alonga, dá volume e é resistente à água e borrões.',
        'Iluminador Glow': 'Brilho radiante que reflete a luz com partículas ultrafinas, realçando seus traços perfeitamente.',
        'Blush Rosé': 'Tom rosado natural para dar aquele ar de saúde, com textura em pó super macia e esfumável.',
        'Kit Pincéis': 'Conjunto com 10 pincéis profissionais essenciais para rosto e olhos com cerdas macias.',
        'Corretivo 24h': 'Alta cobertura para olheiras e manchinhas, dura até 24h sem craquelar ou acumular.',
        'Gloss Labial Shine': 'Brilho intenso maravilhoso sem deixar os lábios grudentos, com leve efeito de volume.',
        'Delineador Caneta': 'Ponta ultrafina para aquele delineado gatinho perfeito e traço preto super pigmentado.',
        'Pó Translúcido': 'Sela a maquiagem deixando a pele matificada, sem estourar no flash das fotos e rende muito.'
    };

    // Adicionar eventos nos cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const img = card.querySelector('img');
        const h3 = card.querySelector('h3');
        const btnFav = card.querySelector('.btn-fav');
        const nome = h3.innerText;
        const precoStr = card.querySelector('p').innerText;
        const preco = parseFloat(precoStr.replace('R$ ', '').replace(',', '.'));
        const desc = descricoes[nome] || 'Produto maravilhoso para completar sua rotina de maquiagem. Compre já e arrase!';
        
        img.style.cursor = 'pointer';
        img.title = 'Ver detalhes do produto';
        img.onclick = () => abrirProduto(nome, preco, desc, img.src);
        
        h3.style.cursor = 'pointer';
        h3.title = 'Ver detalhes do produto';
        h3.onclick = () => abrirProduto(nome, preco, desc, img.src);

        if (btnFav) {
            btnFav.removeAttribute('onclick');
            // Configurar botão de curtida com contador
            const currentLikes = likes[nome] || 0;
            btnFav.innerHTML = `❤️ <span class="like-count">${currentLikes}</span>`;
            btnFav.onclick = (e) => {
                e.stopPropagation();
                curtir(nome, btnFav);
            };
        }
    });

    // Atualizar contador total no header
    const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0);
    document.getElementById('fav-count').innerText = totalLikes;

    // Reordenar produtos pelo ranking de curtidas
    reordenarProdutos();

    // Adicionar eventos nos vídeos
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(video => {
        const p = video.querySelector('p');
        const title = p ? p.innerText : 'Vídeo Tutorial';
        const originalOnClick = video.getAttribute('onclick');
        if (originalOnClick) {
            const urlMatch = originalOnClick.match(/'([^']+)'/);
            const url = urlMatch ? urlMatch[1] : '';
            video.removeAttribute('onclick');
            video.onclick = () => abrirVideoDetalhes(url, title);
        }
    });

    const inputBusca = document.getElementById('input-busca');
    if (inputBusca) {
        inputBusca.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                this.value = '';
                filtrarProdutos();
            }
        });
    }

    // Fechar modais com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharVideo(null, true);
            if (typeof fecharCarrinho === 'function') fecharCarrinho();
            fecharCheckout();
            fecharProduto();
            fecharPerfil();
            fecharGoogleMock();
            if (typeof fecharFavoritos === 'function') fecharFavoritos();
            if (typeof fecharEntrega === 'function') fecharEntrega();
            if (typeof fecharSobre === 'function') fecharSobre();
            if (typeof fecharSocial === 'function') fecharSocial();
            if (typeof fecharStory === 'function') fecharStory(null, true);
            if (typeof fecharDMs === 'function') fecharDMs();
            if (typeof fecharConversa === 'function') fecharConversa();
        }
    });
});

// ─── SOCIAL / COMUNIDADE ───────────────────────────────────────────────────

function abrirSocial() {
    document.getElementById('socialModal').style.display = 'flex';
}

function fecharSocial() {
    document.getElementById('socialModal').style.display = 'none';
}

// ─── Stories
let storyTimer;
function verStory(index) {
    const stories = [
        { nome: 'Mari Maria', img: 'https://randomuser.me/api/portraits/women/44.jpg', bg: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=700&fit=crop', text: 'Bom dia amores! ✨ Preparando novidades!' },
        { nome: 'Boca Rosa', img: 'https://randomuser.me/api/portraits/women/68.jpg', bg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=700&fit=crop', text: 'Skincare time 🧖‍♀️' },
        { nome: 'Bruna T.', img: 'https://randomuser.me/api/portraits/women/65.jpg', bg: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=700&fit=crop', text: 'Testando paleta nova! 🎨' },
        { nome: 'Camila C.', img: 'https://randomuser.me/api/portraits/women/33.jpg', bg: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=700&fit=crop', text: 'Look da noite 🌙' },
        { nome: 'Franciny', img: 'https://randomuser.me/api/portraits/women/21.jpg', bg: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=700&fit=crop', text: 'Delineado gatinho sempre! 😻' },
        { nome: 'Alice S.', img: 'https://randomuser.me/api/portraits/women/50.jpg', bg: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=700&fit=crop', text: 'Glow up ✨' },
        { nome: 'Letícia', img: 'https://randomuser.me/api/portraits/women/12.jpg', bg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=700&fit=crop', text: 'Dica do dia: Beba água!' },
        { nome: 'Gabi', img: 'https://randomuser.me/api/portraits/women/90.jpg', bg: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=700&fit=crop', text: 'Nova coleção quase pronta...' }
    ];

    if (index >= stories.length) return;
    const story = stories[index];

    document.getElementById('storyAvatar').src = story.img;
    document.getElementById('storyNome').innerText = story.nome;
    document.getElementById('storyImagem').src = story.bg;
    document.getElementById('storyTexto').innerText = story.text;
    document.getElementById('storyResposta').value = '';

    document.getElementById('storyModal').style.display = 'flex';

    // Barra de progresso (5 segundos)
    const bar = document.getElementById('storyProgressBar');
    bar.style.transition = 'none';
    bar.style.width = '0%';
    
    setTimeout(() => {
        bar.style.transition = 'width 5s linear';
        bar.style.width = '100%';
    }, 50);

    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => {
        fecharStory(null, true);
    }, 5000);
}

function fecharStory(event, force = false) {
    if (!force && event && event.target.id !== 'storyModal') return;
    document.getElementById('storyModal').style.display = 'none';
    clearTimeout(storyTimer);
}

function enviarRespostaStory() {
    const input = document.getElementById('storyResposta');
    if (!input.value.trim()) return;
    showToast('Mensagem enviada com sucesso! 💌');
    input.value = '';
    fecharStory(null, true);
}

// ─── Feed Interactions
function curtirPost(btn) {
    const ico = btn.childNodes[0];
    const numEl = btn.querySelector('small');
    if (ico.textContent.includes('🤍')) {
        ico.textContent = '❤️ ';
        btn.style.color = 'var(--pink)';
        let count = parseInt(numEl.innerText.replace('k', '000').replace('.', ''));
        if (numEl.innerText.includes('k')) {
            numEl.innerText = ((count + 1) / 1000).toFixed(1) + 'k';
        } else {
            numEl.innerText = count + 1;
        }
        // Pulse animation
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    } else {
        ico.textContent = '🤍 ';
        btn.style.color = '';
        let count = parseInt(numEl.innerText.replace('k', '000').replace('.', ''));
        if (numEl.innerText.includes('k')) {
            numEl.innerText = ((count - 1) / 1000).toFixed(1) + 'k';
        } else {
            numEl.innerText = count - 1;
        }
    }
}

function comentarPost() { showToast('Abrindo comentários... 💬'); }
function compartilharPost() { showToast('Post repostado no seu perfil! 🔁'); }
function enviarPost() { showToast('Enviado para seus amigos! 📩'); }

// ─── DMs (Mensagens Diretas)
const chats = [
    { id: 1, nome: 'Mari Maria', info: 'Visto há 2h', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, nome: 'Boca Rosa', info: 'Online', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 3, nome: 'Ana (Amiga)', info: 'Digitando...', img: 'https://randomuser.me/api/portraits/women/30.jpg' },
    { id: 4, nome: 'Franciny', info: 'Visto ontem', img: 'https://randomuser.me/api/portraits/women/21.jpg' },
    { id: 5, nome: 'Júlia Lopes', info: 'Há 5m', img: 'https://randomuser.me/api/portraits/women/15.jpg' }
];

function abrirDMs() {
    const lista = document.getElementById('dmLista');
    lista.innerHTML = chats.map(chat => `
        <div class="dm-item" onclick="abrirConversa('${chat.nome}', '${chat.img}', ${chat.id})">
            <img src="${chat.img}" alt="${chat.nome}">
            <div class="dm-item-info">
                <strong>${chat.nome}</strong>
                <span style="${chat.info === 'Online' || chat.info === 'Digitando...' ? 'color: var(--pink); font-weight:600;' : ''}">${chat.info}</span>
            </div>
            <span style="font-size: 10px; color: var(--border);">📷</span>
        </div>
    `).join('');
    
    document.getElementById('dmModal').style.display = 'flex';
}

function fecharDMs() {
    document.getElementById('dmModal').style.display = 'none';
}

function abrirConversa(nome, img, id) {
    document.getElementById('dmConversaNome').innerText = nome;
    document.getElementById('dmConversaAvatar').src = img;
    
    // Simular conversa vazia ou com saudação
    const msgs = document.getElementById('dmMensagens');
    msgs.innerHTML = `
        <div class="dm-msg recebida">
            Oi! Vi seu comentário no post! ✨
            <small>10:23</small>
        </div>
    `;
    
    document.getElementById('dmConversaModal').style.display = 'flex';
}

function fecharConversa() {
    document.getElementById('dmConversaModal').style.display = 'none';
}

function enviarDM() {
    const input = document.getElementById('dmInputMsg');
    const texto = input.value.trim();
    if (!texto) return;
    
    const d = new Date();
    const hora = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    
    const msgs = document.getElementById('dmMensagens');
    msgs.innerHTML += `
        <div class="dm-msg enviada">
            ${texto}
            <small>${hora}</small>
        </div>
    `;
    
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight; // Scroll to bottom
}
