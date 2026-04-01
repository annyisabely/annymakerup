const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conecta ou cria o arquivo do banco no disco
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

function initDatabase() {
    db.serialize(() => {
        // Tabela de Produtos
        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT,
            imagem TEXT NOT NULL,
            likes INTEGER DEFAULT 0
        )`);

        // Tabela de Posts da Comunidade
        db.run(`CREATE TABLE IF NOT EXISTS comunidade_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            autor_nome TEXT NOT NULL,
            autor_usuario TEXT NOT NULL,
            autor_foto TEXT NOT NULL,
            imagem TEXT NOT NULL,
            legenda TEXT,
            curtidas INTEGER DEFAULT 0,
            comentarios INTEGER DEFAULT 0,
            tempo_postado TEXT
        )`);

        // Tabela de Pedidos
        db.run(`CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT DEFAULT 'Visitante',
            status TEXT DEFAULT 'Preparando',
            total REAL,
            data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed: Inserir produtos Iniciais se estiver vazio
        db.get("SELECT COUNT(*) AS count FROM produtos", (err, row) => {
            if (row.count === 0) {
                console.log('Populando banco com produtos iniciais...');
                const stmt = db.prepare("INSERT INTO produtos (nome, preco, descricao, imagem, likes) VALUES (?, ?, ?, ?, ?)");
                
                const produtos = [
                    ['Batom Matte Velvet', 35.90, 'Batom de alta fixação com acabamento matte aveludado.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 120],
                    ['Base Matte HD', 59.90, 'Cobertura incrível que disfarça imperfeições.', 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=400', 450],
                    ['Paleta de Sombras', 89.90, '12 cores super pigmentadas.', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', 890],
                    ['Máscara de Cílios', 45.90, 'Efeito cílios postiços.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 310],
                    ['Iluminador Glow', 49.90, 'Brilho radiante que reflete a luz.', 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400', 215],
                    ['Blush Rosé', 39.90, 'Tom rosado natural para dar aquele ar de saúde.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', 505],
                    ['Kit Pincéis', 119.90, 'Conjunto com 10 pincéis.', 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400', 1050],
                    ['Corretivo 24h', 42.90, 'Alta cobertura.', 'https://plus.unsplash.com/premium_photo-1677510444641-f620eb580b06?w=400', 78],
                    ['Gloss Labial Shine', 29.90, 'Brilho maravilhoso sem ficar grudento.', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400', 234],
                    ['Delineador Caneta', 38.90, 'Delineado gatinho perfeito.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 667],
                    ['Pó Translúcido', 44.90, 'Sela a maquiagem deixando a pele matificada.', 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?w=400', 123]
                ];

                produtos.forEach(p => stmt.run(p));
                stmt.finalize();
            }
        });

        // Seed: Inserir Posts
        db.get("SELECT COUNT(*) AS count FROM comunidade_posts", (err, row) => {
            if (row.count === 0) {
                console.log('Populando banco com posts iniciais da comunidade...');
                const stmt = db.prepare("INSERT INTO comunidade_posts (autor_nome, autor_usuario, autor_foto, imagem, legenda, curtidas, comentarios, tempo_postado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                
                const posts = [
                    ['Mari Maria', '@marimaria', 'https://randomuser.me/api/portraits/women/44.jpg', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 'Testando a nova paleta de outono 🍂 Olha esse esfumado! Quem quer tutorial? 💜', 324, 48, '2h'],
                    ['Boca Rosa', '@bocarosa', 'https://randomuser.me/api/portraits/women/68.jpg', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600', 'Minha rotina de skincare antes da make! Pele preparada = make perfeita 🧖‍♀️✨', 1200, 203, '5h'],
                    ['Bruna Tavares', '@brunatavares', 'https://randomuser.me/api/portraits/women/65.jpg', 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600', 'Nova coleção delineadores que não borram! Testem e me contem 🖊️💕', 891, 127, '8h'],
                    ['Franciny Ehlke', '@francinyehlke', 'https://randomuser.me/api/portraits/women/21.jpg', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600', 'Antes x Depois dessa transformação! 😱💖 O poder da maquiagem!', 5100, 489, '1d']
                ];

                posts.forEach(p => stmt.run(p));
                stmt.finalize();
            }
        });
    });
}

initDatabase();

module.exports = db;
