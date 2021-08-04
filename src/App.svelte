<script>
  import FormGroup from "./components/FormGroup.svelte";
  import Input from "./components/Input.svelte";
  import { formDoc, formGroups, userDoc } from "./stores";

  import firebase from "firebase/app";
  const app = firebase.initializeApp({
    apiKey: "AIzaSyDHpUO08qfO43u78AVHS8MKi8Wt6Tnd3jc",
    authDomain: "files-directory.firebaseapp.com",
    projectId: "files-directory",
    storageBucket: "files-directory.appspot.com",
    messagingSenderId: "399103769387",
    appId: "1:399103769387:web:7343fe2ed8c3561d86a36e",
  });
  export const db = firebase.firestore(app);
  export const auth = app.auth();
  auth.onAuthStateChanged((user) => {
    if (user === null) $userDoc = null;
    else {
      $userDoc = user;
    }
  });

  async function handleOnSubmit() {
    const url = "https://hook.integromat.com/95nczekdzhsagsr4s8fypa1e9p9booly";
    const formData = new FormData();
    Object.entries($formDoc.docData).forEach(([header, value]) => {
      const field = $formDoc.headers[header];
      if (field) {
        switch (field.type) {
          case "file":
            value.forEach((fileObj, ind) =>
              formData.append(`${header}_${ind}`, fileObj.file)
            );
            break;
          case "list":
            formData.append(header, value.id || "");
            break;
          default:
            formData.append(header, value);
        }
      } else {
        throw `field ${header} not found`;
      }
    });
    console.log($formDoc.docData);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        contentType: "multipart/form-data",
      });
      console.log(response.status, response.statusText);
    } catch (e) {
      console.error(e);
    }
  }
</script>

<main>
  {#if $userDoc}
    <div>{$userDoc.displayName}</div>
    <h1>טופס הוספת לקוח חדש</h1>
    <p>להוספת לקוח חדש למערכת מונדיי יש למלא אחר הוראות הטופס:</p>
    <form class="form" on:submit|preventDefault={(e) => e.preventDefault()}>
      {#each $formGroups as formGroup}
        <FormGroup
          title={formGroup.title}
          {formGroup}
          shrinkable
          isShrink={formGroup.isShrink}
        >
          {#if !formGroup.isShrink}
            {#each formGroup.fields as header}
              <Input {header} {formDoc} />
            {/each}
          {/if}
        </FormGroup>
      {/each}
      <div class="form-actions">
        <button type="button" on:click={handleOnSubmit}>צור</button>
      </div>
    </form>
  {:else}
    <form class="form" on:submit|preventDefault={(e) => e.preventDefault()} >
      
      <button>התחבר</button>
    </form>

  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  .form {
    margin: 5rem auto;
    padding: 5px;
    display: grid;
    gap: 2rem;
  }
  .form-actions {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
