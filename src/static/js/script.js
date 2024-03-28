async function login(password, usernameOrEmail, rememberMe) {
  return fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
      rememberMe,
    }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      return data.error;
    }
    window.location.href = '/';
    return {};
  });
}

document
  .getElementById('loginForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameOrEmail = document.getElementById(
      'login-usernameOrEmail',
    ).value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('login-rememberMe').checked;

    document
      .getElementById('login-usernameOrEmail')
      .classList.remove('is-invalid');
    document.getElementById('login-password').classList.remove('is-invalid');
    const errors = await login(password, usernameOrEmail, rememberMe);

    if (errors) {
      if (errors.password) {
        document.getElementById('login-password').classList.add('is-invalid');
        document.getElementById('login-passwordValidation').innerHTML =
          errors.password;
      }
      if (errors.usernameOrEmail) {
        document
          .getElementById('login-usernameOrEmail')
          .classList.add('is-invalid');
        document.getElementById('login-usernameOrEmailValidation').innerHTML =
          errors.usernameOrEmail;
      }
    }
  });
