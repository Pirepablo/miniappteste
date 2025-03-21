document.querySelectorAll('.select-plan').forEach(button => {
    button.addEventListener('click', () => {
        const plan = button.getAttribute('data-plan');
        const price = button.getAttribute('data-price');

        // Redireciona para a página de checkout com os parâmetros do plano
        window.location.href = `checkout.html?plan=${encodeURIComponent(plan)}&price=${encodeURIComponent(price)}`;
    });
});

// Integração com o Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia