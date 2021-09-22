<script>
  import firebase from "firebase/app";
  import "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyDHpUO08qfO43u78AVHS8MKi8Wt6Tnd3jc",
    authDomain: "files-directory.firebaseapp.com",
    projectId: "files-directory",
    storageBucket: "files-directory.appspot.com",
    messagingSenderId: "399103769387",
    appId: "1:399103769387:web:7343fe2ed8c3561d86a36e",
  };
  const app = firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth(app);

  import { Route, Router, Link } from "svelte-navigator";

  import { prompt } from "./stores";
  import { logout } from "./auth";
  import { userDoc } from "./stores";
  import Auth from "./components/Auth.svelte";
  import Login from "./components/Login.svelte";
  import ClientForm from "./components/ClientForm.svelte";
  import Prompt from "./components/Prompt.svelte";
  import EditContract from "./components/EditContract.svelte";
</script>

<Router>
  <Auth {auth} let:loggedIn let:userDisplayValue>
    {#if $prompt}
      <Prompt />
    {/if}
    <main>
      <div class="top">
        {#if loggedIn}
          {#if $userDoc?.email === "g_shlomo@business-time.co.il"}
            <Link to="/edit-contract"
              ><span class="nav-link">עריכת מבנה חוזה</span></Link
            >
          {/if}
          <span class="nav-link" on:click={logout}>התנתק</span>
        {/if}
        <div class="userAvatar">{userDisplayValue}</div>
      </div>
      {#if loggedIn}
        <Route path="/" component={ClientForm} />
        <Route path="/edit-contract" component={EditContract} />
      {:else}
        <Login />
      {/if}
    </main>
  </Auth>
</Router>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    display: grid;
    min-height: 100vh;
  }

  .nav-link {
    cursor: pointer;
    padding: 10px;
  }
  .nav-link:hover {
    background-color: #80808059;
  }
  .top {
    background-color: #333;
    color: #f0f0f0;
    display: grid;
    grid-auto-flow: column;
    height: 80px;
    padding: 5px;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }
  .userAvatar {
    border-radius: 50%;
    border: 1px solid lightgray;
    text-transform: uppercase;
    font-size: 24px;
    padding: 10px;
    justify-self: end;
    align-items: center;
    height: 45px;
    width: 45px;
    user-select: none;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
