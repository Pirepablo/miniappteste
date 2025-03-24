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
// Objeto para armazenar os dados
const dadosCliente = {
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

// Página de Planos
if (document.querySelector('.planos')) {
    document.querySelectorAll('.btn-escolher').forEach(botao => {
        botao.addEventListener('click', function() {
            const plano = this.closest('.plano');
            dadosCliente.plano = plano.getAttribute('data-nome');
            dadosCliente.valor = plano.getAttribute('data-valor');
            
            // Salva no localStorage e redireciona
            localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
            window.location.href = 'cadastro.html';
        });
    });
}

// Página de Planos - Código Corrigido
if (document.querySelector('.planos')) {
    document.querySelectorAll('.btn-escolher').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault(); // Impede comportamento padrão
            
            const plano = this.closest('.plano');
            dadosCliente.plano = plano.getAttribute('data-nome');
            dadosCliente.valor = plano.getAttribute('data-valor');
            
            // Debug: Verifique no console
            console.log('Dados antes do redirecionamento:', dadosCliente);
            
            // Salva e redireciona CORRETAMENTE
            localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
            window.location.href = 'cadastro.html'; // Caminho relativo
        });
    });
}
    
    // Máscaras de campos
    document.getElementById('cpf').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    });
    
    document.getElementById('telefone').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    });
    
    document.getElementById('cep').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    });
    
    // Envio do formulário
    document.getElementById('formCadastro').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Atualiza o objeto dadosCliente
        dadosCliente.cpf = document.getElementById('cpf').value;
        dadosCliente.nome = document.getElementById('nome').value;
        dadosCliente.telefone = document.getElementById('telefone').value;
        dadosCliente.email = document.getElementById('email').value;
        dadosCliente.cep = document.getElementById('cep').value;
        dadosCliente.endereco = document.getElementById('endereco').value;
        dadosCliente.numero = document.getElementById('numero').value;
        dadosCliente.complemento = document.getElementById('complemento').value;
        dadosCliente.bairro = document.getElementById('bairro').value;
        dadosCliente.municipio = document.getElementById('municipio').value;
        
        // Salva e redireciona
        localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
        window.location.href = 'checkout.html';
    });
}

// Página de Checkout - Código Corrigido
if (document.getElementById('resumoPedido')) {
    // Debug: Mostra todos os itens no localStorage
    console.log('Conteúdo do localStorage:', localStorage);
    
    // Recupera os dados com tratamento de erro
    let dados;
    try {
        dados = JSON.parse(localStorage.getItem('dadosCliente'));
        if (!dados) throw new Error('Dados não encontrados no localStorage');
        
        console.log('Dados recuperados:', dados); // Debug
        
        // Exibe os dados no resumo
        document.getElementById('resumoPedido').innerHTML = `
            <h3>Resumo do Pedido</h3>
            <p><strong>Plano:</strong> ${dados.plano || 'Não informado'} (R$ ${dados.valor || '0,00'}/mês)</p>
            <p><strong>Cliente:</strong> ${dados.nome || 'Não informado'}</p>
            <p><strong>CPF:</strong> ${dados.cpf || 'Não informado'}</p>
            <p><strong>Endereço:</strong> 
                ${dados.endereco || 'Não informado'}, 
                ${dados.numero || 'S/N'} 
                ${dados.complemento ? '- ' + dados.complemento : ''}
            </p>
            <p><strong>Bairro:</strong> ${dados.bairro || 'Não informado'}</p>
            <p><strong>Cidade:</strong> ${dados.municipio || 'Não informado'}</p>
            <p><strong>CEP:</strong> ${dados.cep || 'Não informado'}</p>
            <p><strong>Contato:</strong> 
                ${dados.telefone || 'Não informado'} | 
                ${dados.email || 'Não informado'}
            </p>
        `;
        
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
        document.getElementById('resumoPedido').innerHTML = `
            <div class="error">
                <p>Erro ao carregar os dados do pedido.</p>
                <p>Por favor, volte e preencha o formulário novamente.</p>
            </div>
        `;
    }

    // Botão de confirmação (atualizado)
    document.getElementById('btnConfirmar').addEventListener('click', async function() {
        if (!dados) {
            alert('Dados do pedido não encontrados!');
            return;
        }

        try {
            const response = await fetch(config.WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Pedido confirmado com sucesso!');
                // Limpa o localStorage após confirmação
                localStorage.removeItem('dadosCliente');
                
                // Fecha se for no Telegram Web App
                if (window.Telegram?.WebApp) {
                    Telegram.WebApp.close();
                } else {
                    // Redireciona para uma página de obrigado se for navegador
                    window.location.href = 'obrigado.html';
                }
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao confirmar pedido: ' + error.message);
        }
    });
}
// Integração com o Telegram
Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Expande o app para tela cheia