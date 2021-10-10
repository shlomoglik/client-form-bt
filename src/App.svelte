<script>
  import "./services/initFirebase";
  import { Route, Router, Link, useLocation } from "svelte-navigator";
  import { prompt } from "./stores";
  import { auth, logout } from "./services/auth";
  import { userDoc } from "./stores";
  import Auth from "./components/Auth.svelte";
  import Prompt from "./components/Prompt.svelte";
  import EditContract from "./pages/EditContract.svelte";
  import FinishAdd from "./pages/FinishAdd.svelte";
  import Login from "./pages/Login.svelte";
  import ClientForm from "./pages/ClientForm.svelte";
  import Clients from "./pages/Clients.svelte";
  import ClientFormDraft from "./pages/ClientFormDraft.svelte";
  import NavLink from "./components/NavLink.svelte";
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
            <NavLink to="/edit-contract" text="עריכת מבנה חוזה" />
            <NavLink to="/finish-add" text="סיום הוספת לקוח" />
          {/if}
          <NavLink to="/clients" text="לקוחות / טיוטות" />
          <NavLink to="/" text="לקוח חדש" />
          <NavLink text="התנתק" action={logout} />
        {/if}
        <div class="userAvatar">{userDisplayValue}</div>
      </div>
      {#if loggedIn}
        <Route path="/" component={ClientForm} />
        <Route path="/drafts/:docID" component={ClientFormDraft} />
        <Route path="/clients" component={Clients} />
        <Route path="/edit-contract" component={EditContract} />
        <Route path="/finish-add" component={FinishAdd} />
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
    grid-template-rows: min-content 1fr;
    align-items: center;
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
