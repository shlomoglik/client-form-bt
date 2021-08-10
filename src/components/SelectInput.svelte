<script>
    import { onMount } from "svelte";

    import { prompt } from "../stores";

    import Icon from "./Icon.svelte";

    export let header, formDoc;
    let valid = true;
    let error = "";

    const handleChangeList = () => {
        const field = $formDoc.headers[header];
        const itemField = field.options.find(opt=>opt.id===header)
        if (itemField && itemField.attributes) {
            Object.entries(newItem.attributes).forEach(([header, value]) => {
                $formDoc.docData[header] = value;
            });
        }
        validate()
    };

    onMount(async () => {
        if (
            $formDoc.headers[header].options &&
            $formDoc.headers[header].getData
        ) {
            try {
                // $formDoc.headers[header].options = [];
                const result = await $formDoc.headers[header].getData();
                const json = await result.json();
                if (
                    json.data &&
                    json.data.boards[0].groups[0].items.length > 0
                ) {
                    const data = json.data.boards[0].groups[0].items.map(
                        ({ name, id }) => {
                            return { text: name, id };
                        }
                    );
                    $formDoc.headers[header].options = [...data]
                }
            } catch (err) {
                console.error(err);
            }
        }
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
        if ($formDoc.errors.length > 0) $formDoc.valid = false
        else $formDoc.valid = true
    }
    
    function showError() {
        $prompt = `<div><p>${error}</p></div>`;
    }
</script>

<div class="input">
    {#if !valid}
        <Icon name="icon-warning" onClick={showError} />
    {/if}
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <select
        class="input__field"
        name={header}
        id={header}
        bind:value={$formDoc.docData[header]}
        on:blur={handleChangeList}
    >
        <option value="null">--בחר--</option>
        {#each $formDoc.headers[header].options as option}
            <option value={option.id}>
                {option.text}
            </option>
        {/each}
    </select>
</div>
