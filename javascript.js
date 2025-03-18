// Simulação de teste de velocidade
document.getElementById('test-speed').addEventListener('click', () => {
    const speed = (Math.random() * 100).toFixed(2); // Gera um valor aleatório
    document.getElementById('speed-result').textContent = `Velocidade: ${speed} Mbps`;
});

// Simulação de consulta de saldo
document.getElementById('check-balance').addEventListener('click', () => {
    const balance = (Math.random() * 100).toFixed(2); // Gera um valor aleatório
    document.getElementById('balance-result').textContent = `Saldo: R$ ${balance}`;
});

// Redirecionamento para suporte
document.getElementById('contact-support').addEventListener('click', () => {
    window.open('https://t.me/bot_itnetworkbot', '_blank'); // Substitua pelo link do seu bot de suporte
});

// Integração com o Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia