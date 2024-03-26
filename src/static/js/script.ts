document
  .getElementById('loginForm')
  .addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    const usernameOrEmail = (
      document.getElementById('login-usernameOrEmail') as HTMLInputElement
    ).value;
    const password = (
      document.getElementById('login-password') as HTMLInputElement
    ).value;
    const rememberMe = (
      document.getElementById('login-rememberMe') as HTMLInputElement
    ).checked;
    const errorSection = document.getElementById('errorAlert') as HTMLElement;
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
