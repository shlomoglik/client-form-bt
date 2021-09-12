<script>
  import { formGroups } from "../stores";
  import Input from "./Input.svelte";
  import CollapsibleGroup from "./CollapsibleGroup.svelte";

  export let title, shrinkable, isShrink, formGroup, formDoc;

  const handleShrink = () => {
    const updateFormGroup = { ...formGroup, isShrink: !isShrink };
    $formGroups = $formGroups.map((elem) =>
      elem.id === formGroup.id ? updateFormGroup : elem
    );
  };
</script>

<CollapsibleGroup {shrinkable} {title} {handleShrink} {isShrink} >
  {#each formGroup.fields as header}
    <Input {header} {formDoc} />
  {/each}
</CollapsibleGroup>
