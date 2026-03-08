const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', async ()=>{
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginMsg = document.getElementById('login-msg');

  try {
    const res = await fetch("http://localhost:5000/login", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username,password})
    });
    const data = await res.json();
    if(res.status===200){
      localStorage.setItem("token", data.token);
      document.getElementById('login-container').style.display="none";
      document.getElementById('portfolio-container').style.display="block";
    } else {
      loginMsg.textContent = data.message;
      loginMsg.style.color = "red";
    }
  } catch(err){
    loginMsg.textContent = "Server error!";
    loginMsg.style.color = "red";
  }
});

const themeBtn = document.getElementById('toggle-theme');
themeBtn.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
});