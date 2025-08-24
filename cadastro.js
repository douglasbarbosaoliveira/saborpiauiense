document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const cepInput = document.getElementById('cep');

    // Mapeamento de todos os campos de endereço para fácil acesso
    const camposEndereco = {
        rua: document.getElementById('rua'),
        bairro: document.getElementById('bairro'),
        cidade: document.getElementById('cidade'),
        uf: document.getElementById('uf'),
        numero: document.getElementById('numero')
    };

    if (registrationForm) {
        // --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO (COM ENDEREÇO COMPLETO) ---
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem. Por favor, tente novamente.');
                return;
            }

            // Coleta todos os dados, incluindo o endereço completo
            const userData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: senha,
                cep: cepInput.value,
                rua: camposEndereco.rua.value,
                numero: camposEndereco.numero.value,
                complemento: document.getElementById('complemento').value,
                bairro: camposEndereco.bairro.value,
                cidade: camposEndereco.cidade.value,
                uf: camposEndereco.uf.value,
                cadastroCompleto: true
            };

            const userDataString = JSON.stringify(userData);
            localStorage.setItem('dadosUsuario', userDataString);

            alert('Parabéns. Você está cadastrado no Sabor Piauiense!');
            registrationForm.reset();
        });

        // --- LÓGICA DA API VIACEP (ATUALIZADA) ---
        if (cepInput) {
            const limparCamposEndereco = () => {
                camposEndereco.rua.value = '';
                camposEndereco.bairro.value = '';
                camposEndereco.cidade.value = '';
                camposEndereco.uf.value = '';
            };
            
            cepInput.addEventListener('blur', function() {
                const cep = cepInput.value.replace(/\D/g, '');

                if (cep.length !== 8) {
                    limparCamposEndereco();
                    return;
                }

                // Efeito de carregamento
                camposEndereco.rua.value = '...';
                camposEndereco.bairro.value = '...';
                camposEndereco.cidade.value = '...';
                camposEndereco.uf.value = '...';

                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.erro) {
                            alert('CEP não encontrado.');
                            limparCamposEndereco();
                        } else {
                            // Preenche os campos com os dados retornados
                            camposEndereco.rua.value = data.logradouro;
                            camposEndereco.bairro.value = data.bairro;
                            camposEndereco.cidade.value = data.localidade;
                            camposEndereco.uf.value = data.uf;
                            
                            // Move o foco para o campo de número para o usuário preencher
                            camposEndereco.numero.focus();
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar o CEP:', error);
                        alert('Ocorreu um erro ao buscar o CEP. Tente novamente.');
                        limparCamposEndereco();
                    });
            });
        }
    }
});