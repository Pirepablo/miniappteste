/// Configuração
const config = {
  SHEET_ID: '1vQVluNIwNQO0RbsQEFBYfxtDdGmzk3JBKWzTZv-rCUc',
  SHEET_NAME: 'Cadastro_MiniApp_Testes',
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxEmQ7FW8YCug3IxvtNsi5IzsU6iuAIkd3VNPi5rLZAnKMgeRQSOtCLysfFmeYX5-bB/exec'
};

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
        return { success: false };
    }
}

// Página de Planos (Versão Única Corrigida)
if (document.querySelector('.planos')) {
    document.querySelectorAll('.btn-escolher').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            const plano = this.closest('.plano');
            dadosCliente.plano = plano.getAttribute('data-nome');
            dadosCliente.valor = plano.getAttribute('data-valor');
            
            console.log('Dados do plano selecionado:', dadosCliente);
            
            // Verificação EXTRA para ver se os dados estão sendo salvos
            localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
            console.log('Dados no localStorage:', localStorage.getItem('dadosCliente'));
            
            // Redirecionamento FORÇADO
            window.location.href = 'cadastro.html';
            
            // Se estiver no Telegram (opcional)
            if (window.Telegram?.WebApp) {
                Telegram.WebApp.openTelegramLink('https://pirepablo.github.io/miniappteste/cadastro.html');
            }
        });
    });
}

// Página de Cadastro
if (document.getElementById('formCadastro')) {
    // Recupera dados
    const dadosSalvos = JSON.parse(localStorage.getItem('dadosCliente'));
    if (dadosSalvos) {
        document.getElementById('planoEscolhido').value = dadosSalvos.plano;
        document.getElementById('valorPlano').value = dadosSalvos.valor;
    }
    
    // Máscaras
    const aplicarMascara = (elemento, padrao) => {
        elemento.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '')
                .replace(...padrao);
        });
    };
    
    aplicarMascara(document.getElementById('cpf'), [/(\d{3})(\d)/, '$1.$2']);
    aplicarMascara(document.getElementById('telefone'), [/(\d{2})(\d)/, '($1) $2']);
    aplicarMascara(document.getElementById('cep'), [/(\d{5})(\d)/, '$1-$2']);
    
    // Formulário
    document.getElementById('formCadastro').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Atualiza objeto
        Object.keys(dadosCliente).forEach(key => {
            if (key !== 'plano' && key !== 'valor') {
                dadosCliente[key] = document.getElementById(key)?.value || '';
            }
        });
        
        localStorage.setItem('dadosCliente', JSON.stringify(dadosCliente));
        window.location.href = 'checkout.html';
    });
}

// Página de Checkout (Versão Aprimorada)
if (document.getElementById('resumoPedido')) {
    const dados = JSON.parse(localStorage.getItem('dadosCliente')) || {};
    const resumo = document.getElementById('resumoPedido');
    
    if (!dados.plano) {
        resumo.innerHTML = `
            <div class="error">
                <p>Erro: Dados do plano não encontrados</p>
                <p>Por favor, inicie o processo novamente</p>
            </div>
        `;
        return;
    }
    
    // Exibe resumo
    resumo.innerHTML = `
        <h3>Resumo do Pedido</h3>
        <p><strong>Plano:</strong> ${dados.plano} (R$ ${dados.valor}/mês)</p>
        <p><strong>Cliente:</strong> ${dados.nome}</p>
        <p><strong>CPF:</strong> ${dados.cpf}</p>
        <p><strong>Endereço:</strong> ${dados.endereco}, ${dados.numero}</p>
        ${dados.complemento ? `<p><strong>Complemento:</strong> ${dados.complemento}</p>` : ''}
        <p><strong>Bairro:</strong> ${dados.bairro}</p>
        <p><strong>Cidade:</strong> ${dados.municipio}</p>
    `;
    
    // Confirmação
    document.getElementById('btnConfirmar').addEventListener('click', async () => {
        const loading = '<div class="loading">Enviando dados...</div>';
        resumo.innerHTML += loading;
        
        try {
            const result = await saveToSheet(dados);
            
            if (result.success) {
                localStorage.removeItem('dadosCliente');
                alert('Cadastro realizado com sucesso!');
                
                if (window.Telegram?.WebApp) {
                    Telegram.WebApp.close();
                } else {
                    window.location.href = 'obrigado.html';
                }
            } else {
                throw new Error(result.error || 'Erro no servidor');
            }
        } catch (error) {
            console.error('Falha:', error);
            resumo.querySelector('.loading')?.remove();
            alert(`Falha: ${error.message}`);
        }
    });
}