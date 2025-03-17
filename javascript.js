document.getElementById('btn').addEventListener('click', () => {
    alert('Botão clicado!');
});

// Integração com a API do Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia