const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite ler JSON enviado pelo front

// Servir os arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// === ROTAS DA API ===

// 1. Obter todos os Produtos
app.get('/api/produtos', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// 2. Dar Like em um Produto
app.post('/api/produtos/:id/like', (req, res) => {
    const { id } = req.params;
    db.run(
        "UPDATE produtos SET likes = likes + 1 WHERE nome = ?",
        [id], // Aqui usando nome, ideal seria usar ID numérico, mas o front manda nome.
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Like registrado com sucesso!" });
        }
    );
});

// 3. Obter todos os Posts da Comunidade
app.get('/api/posts', (req, res) => {
    db.all("SELECT * FROM comunidade_posts", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// 4. Confirmar um Pedido (Compra)
app.post('/api/comprar', (req, res) => {
    const { usuario, total } = req.body;
    db.run(
        "INSERT INTO pedidos (usuario, total) VALUES (?, ?)",
        [usuario || 'Visitante', total],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                message: "Pedido inserido com sucesso!",
                pedido_id: this.lastID 
            });
        }
    );
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando lindamente na porta ${PORT}!`);
    console.log(`🌐 Acesse o site no navegador: http://localhost:${PORT}`);
});
