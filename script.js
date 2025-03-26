/// Configuração
const config = {
  SHEET_ID: '1vQVluNIwNQO0RbsQEFBYfxtDdGmzk3JBKWzTZv-rCUc',
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxEmQ7FW8YCug3IxvtNsi5IzsU6iuAIkd3VNPi5rLZAnKMgeRQSOtCLysfFmeYX5-bB/exec'
};

// Objeto para armazenar os dados
let dadosCliente = {
  plano: '',
  valor: '',
  cpf: '',
  nome: '',
  telefone: '',
  email: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: ''
};

// Inicialização do Telegram WebApp
if (typeof Telegram !== 'undefined') {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

// Função para salvar dados
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
    return { success: false, error: error.message };
  }
}

// ----- PÁGINA DE PLANOS -----
if (document.querySelector('.planos')) {
  const botoes = document.querySelectorAll('.btn-escolher');
  console.log('Número de botões encontrados:', botoes.length); // Depuração

  botoes.forEach(botao => {
    botao.addEventListener('click', function() {
      const plano = this.closest('.plano');
      dadosCliente = {
        ...dadosCliente,
        plano: plano.getAttribute('data-nome'),
        valor: plano.getAttribute('data-valor')
      };
      
      localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
      window.location.href = './cadastro.html'; // Caminho relativo explícito
    });
  });
}

// ----- PÁGINA DE CADASTRO -----
if (document.getElementById('formCadastro')) {
  // Carrega dados salvos
  const savedData = JSON.parse(localStorage.getItem('dadosCliente')) || {};
  dadosCliente = { ...dadosCliente, ...savedData };
  
  // Máscaras
  const aplicarMascara = (elemento, pattern) => {
    elemento.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '')
        .replace(...pattern);
    });
  };
  
  aplicarMascara(document.getElementById('cpf'), 
    [/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4']);
  
  aplicarMascara(document.getElementById('telefone'),
    [/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3']);
  
  aplicarMascara(document.getElementById('cep'),
    [/(\d{5})(\d{3})/, '$1-$2']);

  // Submit do formulário
  document.getElementById('formCadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Atualiza dados
    dadosCliente = {
      ...dadosCliente,
      cpf: document.getElementById('cpf').value,
      nome: document.getElementById('nome').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('email').value,
      cep: document.getElementById('cep').value,
      endereco: document.getElementById('endereco').value,
      numero: document.getElementById('numero').value,
      complemento: document.getElementById('complemento').value,
      bairro: document.getElementById('bairro').value,
      municipio: document.getElementById('municipio').value
    };
    
    console.log('Dados do formulário:', dadosCliente);
    localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
    window.location.href = 'checkout.html';
  });
}

// ----- PÁGINA DE CHECKOUT -----
if (document.getElementById('resumoPedido')) {
  // Carrega dados
  const dados = JSON.parse(localStorage.getItem('dadosCliente')) || {};
  
  if (!dados.plano) {
    document.getElementById('resumoPedido').innerHTML = `
      <div class="error">
        <p>Dados do pedido não encontrados!</p>
        <p>Por favor, inicie o processo novamente.</p>
      </div>
    `;
    return;
  }

  // Exibe resumo
  document.getElementById('resumoPedido').innerHTML = `
    <h3>Resumo do Pedido</h3>
    <p><strong>Plano:</strong> ${dados.plano} (R$ ${dados.valor}/mês)</p>
    <p><strong>Nome:</strong> ${dados.nome || 'Não informado'}</p>
    <p><strong>CPF:</strong> ${dados.cpf || 'Não informado'}</p>
    <p><strong>Endereço:</strong> ${dados.endereco || ''}, ${dados.numero || ''} 
    ${dados.complemento ? ' - ' + dados.complemento : ''}</p>
    <p><strong>Bairro:</strong> ${dados.bairro || ''}</p>
    <p><strong>Cidade:</strong> ${dados.municipio || ''}</p>
    <p><strong>CEP:</strong> ${dados.cep || ''}</p>
    <p><strong>Contato:</strong> ${dados.telefone || ''} | ${dados.email || ''}</p>
  `;

  // Confirmação
  document.getElementById('btnConfirmar').addEventListener('click', async function() {
    this.disabled = true;
    this.textContent = 'Processando...';
    
    const result = await saveToSheet(dados);
    
    if (result.success) {
      alert('Cadastro realizado com sucesso!');
      localStorage.removeItem('dadosCliente');
      
      if (window.Telegram?.WebApp) {
        Telegram.WebApp.close();
      } else {
        window.location.href = 'obrigado.html';
      }
    } else {
      alert(`Erro: ${result.error || 'Falha ao salvar dados'}`);
      this.disabled = false;
      this.textContent = 'Tentar novamente';
    }
  });
}