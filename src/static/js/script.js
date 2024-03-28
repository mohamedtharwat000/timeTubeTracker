async function login(password, usernameOrEmail, rememberMe, showMsg = false) {
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
    if (showMsg) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Welcome!',
        text: 'Account created successfully! You are now logged in',
        icon: 'success',
      }).then(() => {
        window.location.href = '/';
      });
    } else {
      window.location.href = '/';
    }
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

    // const errors = await login(password, usernameOrEmail, false);
    await fetch('/signup', {
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
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
        if (data.error) {
          if (data.error.password) {
            document
              .getElementById('signup-password')
              .classList.add('is-invalid');
            document.getElementById('signup-passwordValidation').innerHTML =
              data.error.password;
          }
          if (data.error.username) {
            document
              .getElementById('signup-username')
              .classList.add('is-invalid');
            document.getElementById('signup-usernameValidation').innerHTML =
              data.error.username;
          }
          if (data.error.email) {
            document.getElementById('signup-email').classList.add('is-invalid');
            document.getElementById('signup-emailValidation').innerHTML =
              data.error.email;
          }
        }
      }
      await login(password, username, false, true);
      return null;
    });
  });
