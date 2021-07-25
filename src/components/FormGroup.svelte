<script>
  import { formGroups } from "../stores";

  export let title, shrinkable, isShrink, formGroup;
  const handleShrink = () => {
    const updateFormGroup = { ...formGroup, isShrink: !isShrink };
    $formGroups = $formGroups.map((elem) =>
      elem.id === formGroup.id ? updateFormGroup : elem
    );
  };
</script>

<div class="form-group" tabindex="0">
  {#if title}
    <div class="form-group-title" on:click={handleShrink}>
      <h3>{title}</h3>
      {#if shrinkable}
        <span class={isShrink ? "up" : "down"} />
      {/if}
    </div>
  {/if}
  <slot />
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
  .form-group-title span {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #555;
    transition: all 0.2s ease-in-out;
  }
  .form-group-title span.up {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #555;
  }
  .form-group-title span.down {
    transform: rotate(-180deg);
  }
  h3 {
    font-weight: 500;
    font-size: 32px;
  }
</style>
