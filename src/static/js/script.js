async function login(usernameOrEmail, password, rememberMe) {
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
    return res.json();
  });
}

async function signup(username, email, password) {
  return fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  }).then(async (res) => {
    return res.json();
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

    const res = await login(usernameOrEmail, password, rememberMe);

    if (res.token) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Welcome!',
        text: 'You are now logged in',
        icon: 'success',
      }).then(() => {
        window.location.href = '/';
      });
    } else {
      if (res.error.usernameOrEmail) {
        document
          .getElementById('login-usernameOrEmail')
          .classList.add('is-invalid');
        document.getElementById('login-usernameOrEmailValidation').innerHTML =
          res.error.usernameOrEmail;
      }

      if (res.error.password) {
        document.getElementById('login-password').classList.add('is-invalid');
        document.getElementById('login-passwordValidation').innerHTML =
          res.error.password;
      }
    }
  });

document
  .getElementById('signupForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    document.getElementById('signup-username').classList.remove('is-invalid');
    document.getElementById('signup-email').classList.remove('is-invalid');
    document.getElementById('signup-password').classList.remove('is-invalid');

    const res = await signup(username, email, password);

    if (res.registered) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Welcome!',
        text: 'You are now registered',
        icon: 'success',
      }).then(async () => {
        await login(username, password, false);
        window.location.href = '/';
      });
    } else {
      if (res.error.username) {
        document.getElementById('signup-username').classList.add('is-invalid');
        document.getElementById('signup-usernameValidation').innerHTML =
          res.error.username;
      }

      if (res.error.email) {
        document.getElementById('signup-email').classList.add('is-invalid');
        document.getElementById('signup-emailValidation').innerHTML =
          res.error.email;
      }

      if (res.error.password) {
        document.getElementById('signup-password').classList.add('is-invalid');
        document.getElementById('signup-passwordValidation').innerHTML =
          res.error.password;
      }
    }
  });
