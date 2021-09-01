<script>
    import DateInput from "./DateInput.svelte";
    import FileInput from "./FileInput.svelte";
    import LongTextInput from "./LongTextInput.svelte";
    import NumberInput from "./NumberInput.svelte";
    import SelectInput from "./SelectInput.svelte";
    import SignatureInput from "./SignatureInput.svelte";
    import TextInput from "./TextInput.svelte";
    export let formDoc;
    export let header;
    $: show = true;
    $: {
        if ($formDoc.headers[header].depend) {
            Object.entries($formDoc.headers[header].depend).forEach(
                ([depKey, depValue]) => {
                    if (depValue === "EXIST")
                        show = $formDoc.docData[depKey] ? true : false;
                }
            );
        }
    }
</script>

{#if $formDoc.headers[header] && show}
    {#if $formDoc.headers[header].type === "date"}
        <DateInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "number"}
        <NumberInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "list"}
        <SelectInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "file"}
        <FileInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "signature"}
        <SignatureInput {header} {formDoc} />
    {:else if $formDoc.headers[header].type === "long"}
        <LongTextInput {header} {formDoc} />
    {:else}
        <TextInput {header} {formDoc} />
    {/if}
{/if}

<style>
    :global(label) {
        display: block;
    }

    :global(.input__field) {
        font-family: inherit;
        font-size: inherit;
        -webkit-padding: 0.4em 0;
        padding: 0.4em;
        box-sizing: border-box;
        border: 1px solid rgba(204, 204, 204, 0.5);
        border-radius: 2px;
        min-width: 280px;
        max-width: 90vw;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    :global(.input__field:disabled) {
        color: #ccc;
    }
    :global(.input[data-error="true"]) {
        color: var(--color-danger);
    }
    :global(.input[data-error="true"] .input__field) {
        border: 1px solid var(--color-danger);
    }
    :global(.input[data-error="true"] label) {
        color: inherit;
    }

    :global(.input) {
        display: grid;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }
</style>
