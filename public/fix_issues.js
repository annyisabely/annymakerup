const fs = require('fs');

// Fix style.css
let css = fs.readFileSync('public/style.css', 'utf8');
css = css.replace(/--purple: #bd6ed1;/g, '--cyan: #00bcd4;');
css = css.replace(/--purple-dark: #ffffff;/g, '--cyan-dark: #ffffff;');
css = css.replace(/--purple-light: #bd6ed1;/g, '--cyan-light: #4dd0e1;');
css = css.replace(/glow-purple/g, 'glow-cyan');
css = css.replace(/--purple/g, '--cyan');
css = css.replace(/box-shadow: 0 0 60px rgb\(255, 255, 255\), 0 20px 60px rgba\(0,0,0,0\.5\);/g, 'box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.5);');
css = css.replace(/box-shadow: 1 12px 40px var\(--glow-cyan\);/g, 'box-shadow: 0 12px 40px var(--glow-cyan), 0 4px 10px rgba(0,0,0,0.1);');
css = css.replace(/box-shadow: 0 8px 30px var\(--glow-cyan\);/g, 'box-shadow: 0 10px 30px var(--glow-cyan), 0 4px 10px rgba(0,0,0,0.05);');
css = css.replace(/box-shadow: 0 6px 30px var\(--glow-pink\);/g, 'box-shadow: 0 10px 30px var(--glow-pink), 0 4px 10px rgba(0,0,0,0.1);');
css = css.replace(/--glow-cyan: rgb\(0, 0, 0\);/g, '--glow-cyan: rgba(0, 188, 212, 0.4);');
fs.writeFileSync('public/style.css', css);

// Fix index.html
let html = fs.readFileSync('public/index.html', 'utf8');
const ogTags = 
    <meta property="og:title" content="ANYVV MAKES - Sua Loja de Maquiagem">
    <meta property="og:description" content="Encontre os melhores produtos para realçar a sua beleza.">
    <meta property="og:image" content="https://picsum.photos/1200/630">
    <meta property="og:url" content="https://annymakerup.com">
    <meta property="og:type" content="website">
</head>;
html = html.replace(/<\/head>/, ogTags);

html = html.replace(/<img id="storyAvatar" src="" alt=""/g, '<img id="storyAvatar" src="" alt="Story Avatar"');
html = html.replace(/<img id="dmConversaAvatar" src="" alt=""/g, '<img id="dmConversaAvatar" src="" alt="DM Avatar"');
fs.writeFileSync('public/index.html', html);
console.log('Fixed UX and SEO issues!');
