<script>
    import { formDoc } from "../stores";
    export let header;
</script>

<div class="input">
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <textarea
        class="input__field"
        name={header}
        id={header}
        bind:value={$formDoc.docData[header]}
        placeholder={$formDoc.headers[header].placeholder || "---"}
    />
</div>
