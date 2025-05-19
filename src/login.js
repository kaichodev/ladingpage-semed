document.addEventListener('DOMContentLoaded', function() {
  console.log('Login script carregado');

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.querySelector('.login-btn');
  const togglePassword = document.querySelector('.toggle-password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  if (!loginForm || !emailInput || !passwordInput || !loginBtn || !togglePassword) {
    console.error('Elementos do formulário não encontrados');
    return;
  }

  // Alternar visibilidade da senha
  togglePassword.addEventListener('click', function() {
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
    this.setAttribute('aria-label', isPasswordVisible ? 'Mostrar senha' : 'Ocultar senha');
  });

  // Validação do formulário
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Formulário submetido');

    let hasError = false;

    // Validação do e-mail
    if (!emailInput.value) {
      emailError.textContent = 'Por favor, insira seu e-mail.';
      emailInput.setAttribute('aria-invalid', 'true');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailError.textContent = 'Por favor, insira um e-mail válido.';
      emailInput.setAttribute('aria-invalid', 'true');
      hasError = true;
    } else {
      emailError.textContent = '';
      emailInput.setAttribute('aria-invalid', 'false');
    }

    // Validação da senha
    if (!passwordInput.value) {
      passwordError.textContent = 'Por favor, insira sua senha.';
      passwordInput.setAttribute('aria-invalid', 'true');
      hasError = true;
    } else if (passwordInput.value.length < 6) {
      passwordError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      passwordInput.setAttribute('aria-invalid', 'true');
      hasError = true;
    } else {
      passwordError.textContent = '';
      passwordInput.setAttribute('aria-invalid', 'false');
    }

    if (!hasError) {
      // Simula envio do formulário
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;

      setTimeout(() => {
        console.log('Simulando login:', {
          email: emailInput.value,
          password: passwordInput.value
        });
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        alert('Login simulado com sucesso! Integre com seu backend aqui.');
      }, 2000);
    }
  });

  // Limpar mensagens de erro ao digitar
  emailInput.addEventListener('input', function() {
    if (emailError.textContent) {
      emailError.textContent = '';
      emailInput.setAttribute('aria-invalid', 'false');
    }
  });

  passwordInput.addEventListener('input', function() {
    if (passwordError.textContent) {
      passwordError.textContent = '';
      passwordInput.setAttribute('aria-invalid', 'false');
    }
  });
});