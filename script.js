document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================
    // SEÇÃO 1: FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
    // ==========================================================

    function atualizarCabecalho() {
        const areaLogin = document.getElementById('login-area-dinamica');
        const sessaoAtiva = sessionStorage.getItem('sessaoAtiva');

        if (!areaLogin) {
            return; // Sai da função se a área de login não existir na página atual
        }

        if (sessaoAtiva === 'true') {
            // --- Sessão ativa do usuário ---
            const dadosUsuarioString = localStorage.getItem('dadosUsuario');
            if (dadosUsuarioString) {
                const dadosUsuario = JSON.parse(dadosUsuarioString);
                const primeiroNome = dadosUsuario.nome.split(' ')[0];
                areaLogin.innerHTML = `
                    <div class="welcome-message">
                        <span>Olá, <strong>${primeiroNome}</strong>!</span>
                        <a href="#" id="logout-button">Sair</a>
                    </div>
                `;
            } else {
                sessionStorage.removeItem('sessaoAtiva');
                window.location.reload();
            }
        } else {
            // --- Usuário sem sessão ativa ---
            areaLogin.innerHTML = `
                <form id="login-form">
                    <label for="login">login:</label>
                    <input type="text" id="login" name="login" placeholder="Seu e-mail">
                    <label for="senha">senha:</label>
                    <input type="password" id="senha" name="senha" placeholder="Sua senha">
                    <button type="submit" class="login-button">Entrar</button>
                    <a href="cadastro.html" class="register-link">Ainda não é assinante? Cadastre-se</a>
                </form>
            `;
        }
    }

    // ==========================================================
    // SEÇÃO 2: "ESCUTADORES" DE EVENTOS (CLIQUE, SUBMIT)
    // ==========================================================
    
    // Lógica de login (quando o formulário de cadastro/login é enviado)
    document.addEventListener('submit', function(event) {
        if (event.target && event.target.id === 'login-form') {
            event.preventDefault();

            const emailDigitado = document.getElementById('login').value;
            const senhaDigitada = document.getElementById('senha').value;

            if (emailDigitado === '' || senhaDigitada === '') {
                alert('Por favor, verifique e-mail e senha.');
                return;
            }

            const dadosUsuarioString = localStorage.getItem('dadosUsuario');
            if (!dadosUsuarioString) {
                alert('Usuário não encontrado. Por favor, realize o cadastro em nossa plataforma.');
                return;
            }

            const dadosCadastrados = JSON.parse(dadosUsuarioString);

            if (emailDigitado.toLowerCase() === dadosCadastrados.email.toLowerCase() && senhaDigitada === dadosCadastrados.senha) {
                sessionStorage.setItem('sessaoAtiva', 'true');
                alert('Login realizado com sucesso! Bem vindo ao Sabor Piauiense.');
                window.location.reload();
            } else {
                alert('E-mail ou senha incorretos. Por favor, tente novamente.');
            }
        }
    });

    // Lógica de logout (botão sair)
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'logout-button') {
            event.preventDefault();
            sessionStorage.removeItem('sessaoAtiva');
            alert('Logout realizado com sucesso. Volte sempre ao Sabor Piauiense!');
            window.location.href = 'index.html';
        }
    });


    // ==========================================================
    // SEÇÃO 3: LÓGICAS ESPECÍFICAS DE CADA PÁGINA
    // ==========================================================

    // PÁGINA DE PERFIL
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        const dadosUsuarioString = localStorage.getItem('dadosUsuario');
        if (dadosUsuarioString) {
            const userData = JSON.parse(dadosUsuarioString);
            document.getElementById('display-nome').textContent = userData.nome;
            document.getElementById('display-email').textContent = userData.email;
            document.getElementById('display-cidade').textContent = `${userData.cidade} - ${userData.uf}`;
        } else {
            userInfoDiv.innerHTML = '<p>Nenhum dado de cadastro encontrado. Por favor, <a href="cadastro.html">cadastre-se</a>.</p>';
        }
    }

    // PÁGINA DE ENVIO DE SUGESTÃO (Controle de Acesso)
    const formSugestao = document.getElementById('form-sugestao');
    const avisoLogin = document.getElementById('aviso-login');
    if (formSugestao && avisoLogin) {
        const sessaoAtiva = sessionStorage.getItem('sessaoAtiva');

        if (sessaoAtiva === 'true') {
            // Para usuário logado: mostra o formulário e preenche o nome
            formSugestao.style.display = 'block';
            avisoLogin.style.display = 'none';

            const dadosUsuarioString = localStorage.getItem('dadosUsuario');
            if (dadosUsuarioString) {
                const dadosUsuario = JSON.parse(dadosUsuarioString);
                document.getElementById('usuario').value = dadosUsuario.nome;
            }
        } else {
            // Usuário não logado: esconde o formulário e mostra o aviso
            formSugestao.style.display = 'none';
            avisoLogin.style.display = 'block';
        }

        // NOVO CÓDIGO A SER ADICIONADO: Lógica de envio do formulário de sugestão
        formSugestao.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o recarregamento da página

            // Oculta o formulário
            formSugestao.style.display = 'none';

            // Cria um novo elemento para a mensagem de sucesso
            const mensagemSucesso = document.createElement('div');
            
            // Adiciona uma classe para que possamos estilizá-la com CSS
            mensagemSucesso.classList.add('mensagem-sucesso');
            
            // Define o conteúdo da mensagem (pode ser com HTML)
            mensagemSucesso.innerHTML = '<h2>Obrigado!</h2><p>Agradecemos pela sugestão. Em breve publicaremos no Sabor Piauiense.</p>';

            // Insere a mensagem logo antes do formulário, dentro da caixa principal
            const formBox = document.querySelector('.form-box-sugestao');
            formBox.appendChild(mensagemSucesso);

            // Limpa o formulário
            formSugestao.reset();
        });
    }

    // ==========================================================
    // SEÇÃO 4: EXECUÇÃO INICIAL
    // ==========================================================

    // Chama a função para montar o cabeçalho assim que a página carrega
    atualizarCabecalho();

});