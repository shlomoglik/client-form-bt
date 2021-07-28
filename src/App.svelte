<script>
  import FormGroup from "./components/FormGroup.svelte";
  import Input from "./components/Input.svelte";
  import { formDoc, formGroups } from "./stores";

  function handleOnSubmit(e) {
    e.preventDefault();
    console.log($formDoc.docData);
    
  }
</script>

<main>
  <h1>טופס הוספת לקוח חדש</h1>
  <p>להוספת לקוח חדש למערכת מונדיי יש למלא אחר הוראות הטופס:</p>
  <form class="form" on:submit={handleOnSubmit}>
    {#each $formGroups as formGroup}
      <FormGroup
        title={formGroup.title}
        {formGroup}
        shrinkable
        isShrink={formGroup.isShrink}
      >
        {#if !formGroup.isShrink}
          {#each formGroup.fields as header}
            <Input {header} />
          {/each}
        {/if}
      </FormGroup>
    {/each}
    <div class="form-actions">
      <button type="submit">צור</button>
    </div>
  </form>
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
