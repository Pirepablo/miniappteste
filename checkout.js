// Obtém os parâmetros da URL (plano e preço)
const urlParams = new URLSearchParams(window.location.search);
const plan = urlParams.get('plan');
const price = urlParams.get('price');

// Atualiza o resumo do pedido
document.getElementById('plan-name').textContent = plan;
document.getElementById('plan-price').textContent = price;

// Validação do formulário de pagamento
document.getElementById('payment-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio do formulário

    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    // Validação simples
    if (cardNumber && expiryDate && cvv) {
        alert('Pagamento processado com sucesso!');
        // Aqui você pode enviar os dados para o back-end ou finalizar a compra
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});