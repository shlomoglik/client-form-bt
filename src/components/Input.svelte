<script>
    import { formDoc } from "../stores";
    import DateInput from "./DateInput.svelte";
import FileInput from "./FileInput.svelte";
    import LongTextInput from "./LongTextInput.svelte";
    import SelectInput from "./SelectInput.svelte";
    import TextInput from "./TextInput.svelte";
    export let header;
</script>

{#if $formDoc.headers[header]}
    {#if $formDoc.headers[header].type === "date"}
        <DateInput {header} />
    {:else if $formDoc.headers[header].type === "list"}
        <SelectInput {header} />
    {:else if $formDoc.headers[header].type === "file"}
        <FileInput {header} />
    {:else if $formDoc.headers[header].type === "long"}
        <LongTextInput {header} />
    {:else}
        <TextInput {header} />
    {/if}
{/if}
