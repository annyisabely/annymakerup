const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

const dynamicCode = `
// ─── COMUNICAÇÃO COM O BACKEND (API) ───────────────────────────────────────
async function carregarProdutosBanco() {
    try {
        const res = await fetch('/api/produtos');
        const json = await res.json();
        if(json.message !== 'success') return;
        
        const grid = document.getElementById('productGrid');
        if(!grid) return;
        
        grid.innerHTML = '';
        json.data.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = "<img src='" + prod.imagem + "' alt='" + prod.nome + "'>" +
                "<h3>" + prod.nome + "</h3>" +
                "<p>R$ " + prod.preco.toFixed(2).replace('.', ',') + "</p>" +
                "<div class='actions'>" +
                    "<button onclick=\\"addCart('" + prod.nome + "', " + prod.preco + ", '" + prod.imagem + "')\\">Comprar</button>" +
                    "<button class='btn-fav'>❤️ <span class='like-count'>" + prod.likes + "</span></button>" +
                "</div>";
            
            const img = card.querySelector('img');
            const h3 = card.querySelector('h3');
            img.style.cursor = 'pointer'; h3.style.cursor = 'pointer';
            img.title = 'Ver detalhes do produto'; h3.title = 'Ver detalhes do produto';
            img.onclick = () => abrirProduto(prod.nome, prod.preco, prod.descricao, prod.imagem);
            h3.onclick = () => abrirProduto(prod.nome, prod.preco, prod.descricao, prod.imagem);
            
            const btnFav = card.querySelector('.btn-fav');
            btnFav.onclick = (e) => {
                e.stopPropagation();
                curtirBackEnd(prod.nome, btnFav);
            };
            
            grid.appendChild(card);
        });
    } catch(err) {
        console.error('Erro ao buscar produtos:', err);
    }
}

async function carregarPostsBanco() {
    try {
        const res = await fetch('/api/posts');
        const json = await res.json();
        if(json.message !== 'success') return;
        
        const feed = document.getElementById('socialFeed');
        if(!feed) return;
        
        feed.innerHTML = '';
        json.data.forEach(post => {
            feed.innerHTML += "<div class='social-post'>" +
                "<div class='post-header'>" +
                    "<img src='" + post.autor_foto + "' alt='" + post.autor_nome + "' class='post-avatar'>" +
                    "<div>" +
                        "<strong>" + post.autor_nome + "</strong>" +
                        "<span>" + post.autor_usuario + " • " + post.tempo_postado + "</span>" +
                    "</div>" +
                "</div>" +
                "<img src='" + post.imagem + "' alt='Post' class='post-image'>" +
                "<div class='post-actions'>" +
                    "<span class='post-btn' onclick='curtirPost(this)'>🤍 <small>" + post.curtidas + "</small></span>" +
                    "<span class='post-btn' onclick='comentarPost(this)'>💬 <small>" + post.comentarios + "</small></span>" +
                    "<span class='post-btn' onclick='compartilharPost()'>🔁 <small>Repost</small></span>" +
                    "<span class='post-btn' onclick='enviarPost()'>📩 <small>Enviar</small></span>" +
                "</div>" +
                "<p class='post-caption'><strong>" + post.autor_nome + "</strong> " + post.legenda + "</p>" +
                "<p class='post-time'>Ver todos os " + post.comentarios + " comentários</p>" +
            "</div>";
        });
    } catch(err) {
        console.error('Erro ao buscar posts:', err);
    }
}

async function curtirBackEnd(nome, btn) {
    try {
        const res = await fetch('/api/produtos/' + encodeURIComponent(nome) + '/like', { method: 'POST' });
        if(res.ok) {
            const countEl = btn.querySelector('.like-count');
            if(countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
            btn.classList.add('like-pulse');
            setTimeout(() => btn.classList.remove('like-pulse'), 400);
            showToast('❤️ ' + nome + ' curtido no banco!');
        }
    } catch(e) {
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosBanco();
    carregarPostsBanco();
`;

// Injeta as funções acima da declaração do DOMContentLoaded original
js = js.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => {/, dynamicCode);

// Modifica a função confirmarPedido
const confirmIndex = js.indexOf('function confirmarPedido() {');
if (confirmIndex !== -1) {
    js = js.replace(/function confirmarPedido\(\) \{[\s\S]*?fecharCheckout\(\);/, 
        "async function confirmarPedido() {\n" +
        "    const nome = document.getElementById('nomeCliente').value.trim();\n" +
        "    const cpf = document.getElementById('cpfCliente').value.trim();\n" +
        "    const email = document.getElementById('emailCliente').value.trim();\n" +
        "    const endereco = document.getElementById('endCliente').value.trim();\n\n" +
        "    if (!nome) return showToast('Informe seu nome completo! 📝');\n" +
        "    if (!cpf) return showToast('Informe seu CPF! 📝');\n" +
        "    if (!email || !email.includes('@')) return showToast('Informe um e-mail válido! 📧');\n" +
        "    if (!endereco) return showToast('Informe seu endereço! 📍');\n\n" +
        "    const total = carrinho.reduce((acc, i) => acc + i.preco, 0);\n\n" +
        "    try {\n" +
        "        await fetch('/api/comprar', {\n" +
        "            method: 'POST',\n" +
        "            headers: { 'Content-Type': 'application/json' },\n" +
        "            body: JSON.stringify({ usuario: nome, total: total })\n" +
        "        });\n" +
        "        showToast('Pedido enviado ao Backend! 📦');\n" +
        "    } catch(e) { console.warn('Erro ao salvar no banco', e); }\n\n" +
        "    fecharCheckout();"
    );
}

fs.writeFileSync('public/script.js', js);
console.log('Script refatorado com sucesso!');
