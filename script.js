/// Configuração - USE A MESMA PLANILHA DO BOT
const config = {
  SHEET_ID: '1vQVluNIwNQO0RbsQEFBYfxtDdGmzk3JBKWzTZv-rCUc', // Mesmo ID do bot
  SHEET_NAME: 'Cadastro_MiniApp_Testes',         // Mesma aba do bot
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxEmQ7FW8YCug3IxvtNsi5IzsU6iuAIkd3VNPi5rLZAnKMgeRQSOtCLysfFmeYX5-bB/exec'  // Novo Web App (veja Passo 3)
};

// Função para enviar dados ao Google Sheets (similar ao bot)
async function saveToSheet(dados) {
  try {
    const response = await fetch(config.WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return { success: false };
  }
}

// Exemplo de uso no checkout.html:
document.getElementById('btnConfirmar').addEventListener('click', async () => {
  const dados = JSON.parse(localStorage.getItem('dadosCliente'));
  const result = await saveToSheet(dados);
  
  if (result.success) {
    alert('Cadastro realizado!');
    if (window.Telegram?.WebApp) Telegram.WebApp.close();
  }
});
// Integração com o Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia