<script>
    import { formDoc } from "../stores";
    export let header;

    const handleChangeList = () => {
        const newItem = $formDoc.docData[header];
        if (newItem.attributes) {
            Object.entries(newItem.attributes).forEach(([header, value]) => {
                $formDoc.docData[header] = value
            });
        }
        console.log($formDoc.docData);
    };
</script>

<div class="input">
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <select
        name={header}
        id={header}
        bind:value={$formDoc.docData[header]}
        on:blur={handleChangeList}
    >
        <option value="null" selected disabled>--בחר--</option>
        {#each $formDoc.headers[header].options as option}
            <option value={option}>
                {option.text}
            </option>
        {/each}
    </select>
</div>
