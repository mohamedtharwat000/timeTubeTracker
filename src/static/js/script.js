document
  .getElementById('loginForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    const usernameOrEmail = document.getElementById(
      'login-usernameOrEmail',
    ).value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('login-rememberMe').checked;
    const errorSection = document.getElementById('errorAlert');
    errorSection.classList.add('d-none');

    fetch('http://localhost:5000/login', {
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
        console.log(data);
        errorSection.classList.remove('d-none');
        errorSection.innerHTML = data.error;
        return;
      }
      console.log(data);
    });
  });
