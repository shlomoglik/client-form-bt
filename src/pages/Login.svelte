<script>
  import {loginWithEmailPassword} from "../services/auth" 
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
  <button on:click={loginHandler} >התחבר</button>
  {#if error}
    <div class="error">{error}</div>
  {/if}
</form>

<style>
  form{
    display: grid;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
  .error{
    color:var(--color-danger);

  }
</style>
