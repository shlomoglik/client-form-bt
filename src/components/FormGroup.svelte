<script>
  import { formGroups } from "../stores";
  import { slide } from "svelte/transition";
  import ArrowToggle from "./ArrowToggle.svelte";
  import Input from "./Input.svelte";

  export let title, shrinkable, isShrink, formGroup, formDoc;
  let group;

  const handleShrink = () => {
    const updateFormGroup = { ...formGroup, isShrink: !isShrink };
    $formGroups = $formGroups.map((elem) =>
      elem.id === formGroup.id ? updateFormGroup : elem
    );
    group.scrollIntoView(true);
  };
</script>

<div class="form-group" tabindex="0" bind:this={group}>
  {#if title}
    <div class="form-group-title" on:click={handleShrink}>
      <h3>{title}</h3>
      {#if shrinkable}
        <!-- <span class={isShrink ? "up" : "down"} /> -->
        <ArrowToggle direction={isShrink ? "up" : "down"} />
      {/if}
    </div>
  {/if}
  {#if !isShrink}
    <div transition:slide>
      {#each formGroup.fields as header}
        <Input {header} {formDoc} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .form-group {
    display: grid;
    align-items: center;
    font-size: 18px;
    gap: 2rem;
    cursor: pointer;
    border-top: 3px solid #ebebeb;
  }
  .form-group-title {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 5%;
    align-items: center;
  }
  .form-group-title:hover {
    background-color: #eee;
  }
  h3 {
    font-weight: 500;
    font-size: 32px;
  }
</style>
