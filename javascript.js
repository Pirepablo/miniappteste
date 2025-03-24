document.querySelectorAll('.select-plan').forEach(button => {
    button.addEventListener('click', () => {
        const plan = button.getAttribute('data-plan');
        const price = button.getAttribute('data-price');

        // Redireciona para a página de checkout com os parâmetros do plano
        window.location.href = `checkout.html?plan=${encodeURIComponent(plan)}&price=${encodeURIComponent(price)}`;
    });
});
document.getElementById('cadastro-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;

    // Envia os dados para o Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbxEmQ7FW8YCug3IxvtNsi5IzsU6iuAIkd3VNPi5rLZAnKMgeRQSOtCLysfFmeYX5-bB/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, telefone }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Cadastro realizado com sucesso!');
    } else {
        alert('Erro ao cadastrar. Tente novamente.');
    }
});
// Integração com o Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia