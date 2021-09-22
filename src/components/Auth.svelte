<!-- Auth.svelte -->
<script>
  import { userDoc } from "../stores";
  import { useLocation, useNavigate } from "svelte-navigator";
  const location = useLocation();
  const navigate = useNavigate();

  export let auth;
  let userDisplayValue = "...";
  $: {
    if ($userDoc && $userDoc.email) {
      userDisplayValue = $userDoc.email.substring(0, 3).replace("_", "");
    } else userDisplayValue = "...";
  }
  $: loggedIn = $userDoc !== null;

  // will be fired every time auth state changes
  auth.onAuthStateChanged((fbUser) => {
    if (fbUser === null) $userDoc = null;
    else {
      $userDoc = {
        displayName: fbUser.displayName,
        email: fbUser.email,
        phoneNumber: fbUser.phoneNumber,
        photoURL: fbUser.photoURL,
      };
      const from = ($location.state && $location.state.from) || "/";
      navigate(from, { replace: true });
    }
  });
</script>

<div>
  <slot {loggedIn} {userDisplayValue} />
</div>
