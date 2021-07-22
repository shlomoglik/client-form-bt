<script>
    import { formDoc } from "../stores";
    export let header;
    $: {
        if ($formDoc.docData[header]) {
        }
    }
</script>

{#if $formDoc.headers[header]}
    {#if $formDoc.headers[header].type === "date"}
        <div class="input">
            <label for={header}>
                {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
            </label>
            <input
                type="date"
                name={header}
                id={header}
                bind:value={$formDoc.docData[header]}
            />
        </div>
    {:else if $formDoc.headers[header].type === "list"}
        <div class="input">
            <label for={header}>
                {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
            </label>
            <select
                name={header}
                id={header}
                bind:value={$formDoc.docData[header]}
            >
                <option value="null" selected disabled>--בחר--</option>
                {#each $formDoc.headers[header].options as option}
                    <option value={option}>
                        {option.text}
                    </option>
                {/each}
            </select>
        </div>
    {:else if $formDoc.headers[header].type === "long"}
        <label for={header}>
            {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
        </label>
        <div class="input">
            <textarea
                name={header}
                id={header}
                bind:value={$formDoc.docData[header]}
                placeholder={$formDoc.headers[header].placeholder || "---"}
            />
        </div>
    {:else}
        <div class="input">
            <label for={header}>
                {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
            </label>
            <input
                type="text"
                name={header}
                id={header}
                bind:value={$formDoc.docData[header]}
            />
        </div>
    {/if}
{/if}

<style>
    .input {
        display: grid;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    }
    .input label,
    .input input,
    .input select,
    .input textarea {
        font-size: 24px;
        min-width: 300px;
    }
</style>
