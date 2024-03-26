document
  .getElementById('loginForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission
    const usernameEmail = document.getElementById('login-usernameEmail').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('login-rememberMe').checked;
    const errorSection = document.getElementById('errorAlert');
    document.getElementById('errorAlert').classList.add('d-none');

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameEmail,
        email: usernameEmail,
        password: password,
        rememberMe: rememberMe,
      }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        errorSection.classList.remove('d-none');
        errorSection.innerHTML = data.error;
        return;
      }
      console.log(data);
      location.reload();
    });
  });
