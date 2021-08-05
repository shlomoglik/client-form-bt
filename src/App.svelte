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

  import Auth from "./components/Auth.svelte";
  import Login from "./components/Login.svelte";
  import FormGroup from "./components/FormGroup.svelte";
  import Input from "./components/Input.svelte";
  import { logout } from "./auth";
  import { formDoc, formGroups, userDoc } from "./stores";

  async function handleOnSubmit() {
    const url = "https://hook.integromat.com/95nczekdzhsagsr4s8fypa1e9p9booly";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify($formDoc.docData),
        contentType: "application/json",
      });
      console.log(response.status);
    } catch (e) {
      console.error(e);
    }
  }
  //OLD:
  // async function handleOnSubmit() {
  //   const url = "https://hook.integromat.com/95nczekdzhsagsr4s8fypa1e9p9booly";
  //   const formData = new FormData();
  //   Object.entries($formDoc.docData).forEach(([header, value]) => {
  //     const field = $formDoc.headers[header];
  //     const filesCount = {};
  //     if (field) {
  //       switch (field.type) {
  //         case "file":
  //           value.forEach((fileObj, ind) => {
  //             formData.append(`${header}_${ind}`, fileObj.file);
  //             filesCount[header] = Number(ind) + 1;
  //           });
  //           break;
  //         case "list":
  //           formData.append(header, value.id || "");
  //           break;
  //         default:
  //           formData.append(header, value);
  //       }
  //     } else {
  //       throw `field ${header} not found`;
  //     }
  //   });
  //   formData.append("filesCount", JSON.stringify(filesCount));
  //   // console.log($formDoc.docData);
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       body: formData,
  //       contentType: "multipart/form-data",
  //     });
  //     console.log(response.status, response.statusText);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
</script>

<Auth {auth} let:loggedIn let:userDisplayValue>
  <main>
    <div class="top">
      {#if loggedIn}
        <span class="logout" on:click={logout}>התנתק</span>
      {/if}
      <div class="userAvatar">{userDisplayValue}</div>
    </div>
    {#if loggedIn}
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
      </form>
      <div class="form-actions">
        <button type="button" on:click={handleOnSubmit}>צור</button>
      </div>
    {:else}
      <Login />
    {/if}
  </main>
</Auth>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    display: grid;
    min-height: 100vh;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  .logout {
    cursor: pointer;
    padding: 10px;
  }
  .logout:hover {
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
    width: 35px;
    height: 35px;
    user-select: none;
  }
  .form {
    padding: 5px;
    display: grid;
    gap: 2rem;
  }
  .form-actions {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background-color: #ff3e0012;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
