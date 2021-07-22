<script>
    import { formDoc } from "../stores";
    export let header;
</script>

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
