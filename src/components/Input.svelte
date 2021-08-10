<script>
import { onMount } from "svelte";

    // import { formDoc } from "../stores";
    import DateInput from "./DateInput.svelte";
    import FileInput from "./FileInput.svelte";
    import LongTextInput from "./LongTextInput.svelte";
    import SelectInput from "./SelectInput.svelte";
    import TextInput from "./TextInput.svelte";
    export let formDoc;
    export let header;
</script>

{#if $formDoc.headers[header]}
    {#if $formDoc.headers[header].type === "date"}
        <DateInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "list"}
        <SelectInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "file"}
        <FileInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "long"}
        <LongTextInput {header} {formDoc} />
    {:else}
        <TextInput {header} {formDoc} />
    {/if}
{/if}
