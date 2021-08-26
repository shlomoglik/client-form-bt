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
  import { logout } from "./auth";
  import { formDoc, formGroups, prompt } from "./stores";
  import Prompt from "./components/Prompt.svelte";
  import { fade, fly } from "svelte/transition";
  import SignatureInput from "./components/SignatureInput.svelte";
  import ContractTitle from "./components/ContractTitle.svelte";
  import { getDisplayValue } from "./utils/data";
  import ContractSides from "./components/contractSides/ContractSides.svelte";
  import { onMount } from "svelte";

  $: valid = $formDoc.valid;
  $: errors = $formDoc.errors;
  $: currentAddress = "";
  let contractElem;
  onMount(() => {
    fetchCurrentLocation();
  });
  function fetchCurrentLocation() {
    navigator.geolocation.getCurrentPosition((res) => {
      const apiKey = "tXCWToa7qnKQz1pHe4P8ap3XUQ0kdRt9";
      const { latitude, longitude } = res.coords;
      const url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=${latitude},${longitude}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (
            data &&
            data.results &&
            data.results[0] &&
            data.results[0].locations &&
            data.results[0].locations[0]
          ) {
            const { street, adminArea5 } = data.results[0].locations[0];
            currentAddress = `${adminArea5} , ${street}`;
          }
        });
    });
  }

  function removeError(item) {
    $formDoc.errors = errors.filter((el) => el !== item);
  }

  async function handleOnSubmit() {
    try {
      const url =
        "https://hook.integromat.com/95nczekdzhsagsr4s8fypa1e9p9booly";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify($formDoc.docData),
        contentType: "application/json",
      });
      if (response.status == 200) {
        $prompt = `<div><p>לקוח נוסף בהצלחה למערכת</p><br><p>תודה<p/></div>`;
        formDoc.reset();
      }
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
  {#if $prompt}
    <Prompt />
  {/if}
  <main>
    <div class="top">
      {#if loggedIn}
        <span class="logout" on:click={logout}>התנתק</span>
      {/if}
      <div class="userAvatar">{userDisplayValue}</div>
    </div>
    {#if loggedIn}
      <section transition:fade>
        <h1>טופס הוספת לקוח חדש</h1>
        <p>להוספת לקוח חדש למערכת מונדיי יש למלא אחר הוראות הטופס:</p>
        <form
          class="form"
          on:submit|preventDefault={(e) => e.preventDefault()}
          autocomplete="off"
        >
          {#each $formGroups as formGroup}
            <FormGroup
              title={formGroup.title}
              {formGroup}
              {formDoc}
              shrinkable
              isShrink={formGroup.isShrink}
            />
          {/each}
        </form>
        {#if contractElem}
          <pre hidden>{contractElem.innerHTML}</pre>
        {/if}
        <div class="contract" bind:this={contractElem}>
          <!-- <div class="errors">
            {#each errors as error}
              <div transition:fly>
                {error.text}
                <span on:click={(e) => removeError(error)}>x</span>
              </div>
            {/each}
          </div> -->
          <ContractTitle
            text={`הסכם התקשרות ומתן שירותים ${getDisplayValue(
              $formDoc.docData.package,
              "list",
              $formDoc.headers.package
            )}`}
          />
          <div>
            <p contenteditable>
              {`הסכם זה נערך בתאריך${new Date().toDateString()}, בכתובת ${currentAddress}`}
            </p>
          </div>
          <ContractSides
            client={{
              name: $formDoc.docData.clientName,
              id: $formDoc.docData.companyNumber,
              type: $formDoc.docData.companyType
                ? $formDoc.docData.companyType.id
                : "",
            }}
          />
          <SignatureInput header="clientSignature" {formDoc} />
          {#if valid}
            <button
              type="button"
              on:click={handleOnSubmit}
              data-disabled={!valid}
            >
              בצע הזמנת עבודה
            </button>
          {/if}
        </div>
      </section>
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
    color: var(--color-primary);
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 300;
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
    align-items: center;
    height: 45px;
    width: 45px;
    user-select: none;
    display: flex;
    justify-content: center;
  }
  .form {
    padding: 5px;
    display: grid;
  }
  .contract {
    display: grid;
    gap: 2rem;
    align-items: center;
    padding: 3rem;
    border: 10px solid #9f00ff12;
    margin-top: 15px;
  }

  .errors {
    display: grid;
    gap: 5px;
  }
  .errors > div {
    background-color: #ffe2de;
    color: red;
    font-size: 20px;
    padding: 5px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 3rem;
  }
  .errors span {
    font-weight: 600;
    font-size: 20px;
    cursor: pointer;
  }
  .errors span:hover {
    transform: scale(1.3);
  }
  .errors span:active {
    transform: scale(1);
  }
  button {
    justify-self: center;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
