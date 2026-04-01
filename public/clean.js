const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Substituir product-grid (remove estático)
html = html.replace(
    /<div class="product-grid">[\s\S]*?<\/div>\s*<\/section>/,
    '<div class="product-grid" id="productGrid"></div>\n            </section>'
);

// Substituir social-feed (remove estático)
html = html.replace(
    /<div class="social-feed" id="socialFeed">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- STORY VIEWER MODAL -->/,
    '<div class="social-feed" id="socialFeed"></div>\n        </div>\n    </div>\n\n    <!-- STORY VIEWER MODAL -->'
);

fs.writeFileSync('public/index.html', html);
console.log('HTML Limpo com sucesso!');
