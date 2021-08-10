<script>
  import {loginWithEmailPassword} from "../auth" 
  let email, password;

  let error = "";

  const loginHandler = async (event) => {
    try {
      error = "";
      await loginWithEmailPassword(email, password);
    } catch (err) {
      error = err;
    }
  };
</script>

<form class="form" on:submit|preventDefault={(e) => e.preventDefault()}>
  <div class="input">
    <label for="email">אימייל</label>
    <input
      class="input__field"
      id="email"
      type="email"
      bind:value={email}
      required
    />
  </div>
  <div class="input">
    <label for="password">סיסמא</label>
    <input
      class="input__field"
      id="password"
      type="password"
      bind:value={password}
      required
    />
  </div>
  <button on:click={loginHandler}>התחבר</button
  >
</form>
