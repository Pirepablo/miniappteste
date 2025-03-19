document.querySelectorAll('.select-plan').forEach(button => {
    button.addEventListener('click', () => {
        const plan = button.getAttribute('data-plan');
        alert(`Você selecionou o ${plan}. Redirecionando para o checkout...`);
        // Aqui você pode redirecionar para uma página de checkout ou enviar os dados para o back-end
    });
});

// Integração com o Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia