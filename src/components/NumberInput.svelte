<script>
    import { onMount } from "svelte";

    import { prompt } from "../stores";
import { getDisplayValue } from "../utils/data";
    import Icon from "./Icon.svelte";

    export let header, formDoc;
    let valid = true;
    let error = "";

    onMount(() => {
        validateField();
    });

    function validate() {
        validateFormSubmission();
        validateField();
    }
    function validateField() {
        const hasErrors = $formDoc.errors.filter(
            (err) => err.header === header
        );
        if (hasErrors.length > 0) {
            valid = false;
            error = hasErrors.map((err) => err.text).join("\n");
        } else {
            valid = true;
        }
    }

    function validateFormSubmission() {
        $formDoc.errors = [];
        for (const [header, value] of Object.entries($formDoc.docData)) {
            const field = $formDoc.headers[header];
            if (field && field.required) {
                let isEmpty = false;
                if (field.type === "file" && value.length === 0) isEmpty = true;
                else if (value === "") isEmpty = true;
                if (isEmpty) {
                    $formDoc.errors.push({
                        header,
                        type: "required",
                        text: `חסר ערך בשדה חובה - ${field.label}`,
                    });
                }
            }
        }
        if ($formDoc.errors.length > 0) $formDoc.valid = false;
        else $formDoc.valid = true;
    }
    function showError() {
        $prompt = `<div><p>${error}</p></div>`;
    }
</script>

<div class="input" data-error={!valid}>
    {#if !valid}
        <Icon name="icon-warning" onClick={showError} />
    {/if}
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    {#if !$formDoc.headers[header].disabled}
        <input
            class="input__field"
            type="number"
            name={header}
            id={header}
            bind:value={$formDoc.docData[header]}
            on:blur={validate}
            required={$formDoc.docData[header].required}
        />
    {:else}
        <div class="input__field">
            {getDisplayValue($formDoc.docData[header], "number")}
        </div>
    {/if}
</div>
