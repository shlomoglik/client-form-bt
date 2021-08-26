<script>
    import { onMount } from "svelte";

    import { fetchItems, prompt } from "../stores";
    import { objType } from "../utils/data";
    import { O_OBJECT } from "../utils/objTypes";

    import Icon from "./Icon.svelte";

    export let header, formDoc;
    let valid = true;
    let error = "";
    $: search = "";
    let listOpen = false;
    let displayValue = "";
    const getDisplayValue = () => {
        let value = "";
        if ($formDoc.docData[header]) {
            const field = $formDoc.headers[header];
            const options = field.options;
            if (field && options && Array.isArray(options)) {
                value = options
                    .filter((el) => el.id === $formDoc.docData[header])
                    .map((el) => el.text)
                    .join(",");
            }
        }
        return value;
    };
    const closeList = () => (listOpen = false);

    const handleChangeList = (elemID) => {
        $formDoc.docData[header] = elemID;
        displayValue = getDisplayValue();
        closeList();

        // set up attributes
        const field = $formDoc.headers[header];
        const itemField = field.options.find(({ id }) => id === elemID);
        if (itemField && itemField.attributes) {
            Object.entries(itemField.attributes).forEach(([header, value]) => {
                if (objType(value) === O_OBJECT) {
                    if (value.type === "text") {
                        $formDoc.docData[header] = value.text;
                    } else if (value.type === "subtasks") {
                        const data = [];
                        if (value.value) {
                            JSON.parse(value.value).linkedPulseIds.forEach(
                                (el) => data.push(el.linkedPulseId)
                            );
                        }
                        $formDoc.docData[header] = data;
                        if($formDoc.headers[header])$formDoc.headers[header].getData = new fetchItems(data).getData
                    } else if (value.type === "numeric") {
                        $formDoc.docData[header] = parseFloat(value.text);
                    }
                } else {
                    $formDoc.docData[header] = value;
                }
            });
        }
        validate();
    };

    onMount(async () => {
        if (
            $formDoc.headers[header].options &&
            $formDoc.headers[header].getData
        ) {
            try {
                // $formDoc.headers[header].options = [];
                // const result = await
                const data = await $formDoc.headers[header].getData();
                if (data)
                    $formDoc.headers[header].options = [...data];
            } catch (err) {
                console.error(err);
            }
        }
        validateField();
        displayValue = getDisplayValue();
    });

    function validate() {
        validateFormSubmission();
        validateField();
        console.log($formDoc.docData);
        console.log($formDoc.headers);
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

    $: isMatchSearchTerm = function (option) {
        if (search.length > 0) {
            return option.text.toString().indexOf(search.trim()) !== -1;
        }
        return true;
    };
</script>

<div class="input">
    {#if !valid}
        <Icon name="icon-warning" onClick={showError} />
    {/if}
    <label for={header} on:click={() => (listOpen = !listOpen)}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <div
        class="input__field"
        name={header}
        id={header}
        on:click={() => (listOpen = !listOpen)}
    >
        {displayValue}
        <Icon name={listOpen ? "icon-up" : "icon-down"} class="icon" />
        <ul class:active={listOpen} on:click|stopPropagation>
            {#if $formDoc.headers[header].withSearch}
                <input
                    type="search"
                    bind:value={search}
                    placeholder={$formDoc.headers[header].withSearch}
                />
            {/if}
            {#each $formDoc.headers[header].options as option (option.id)}
                {#if isMatchSearchTerm(option)}
                    <li
                        on:click|stopPropagation={() =>
                            handleChangeList(option.id)}
                    >
                        {option.text}
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
</div>

<style>
    .input__field {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    input[type="search"] {
        width: 100%;
        font-size: 18px;
        padding: 3px 10px;
        border: none;
        outline: none;
        border-bottom: 3px solid lightgray;
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: white;
    }
    ul {
        position: absolute;
        top: 100%;
        right: 0;
        visibility: hidden;
        opacity: 0;
        padding: 0;
        background-color: white;
        z-index: 1;
        box-shadow: 3px 2px 10px 0px rgb(0 0 0 / 20%);
        width: 100%;
        max-height: 300px;
        overflow-y: scroll;
    }
    ul.active {
        visibility: visible;
        opacity: 1;
    }
    li {
        padding: 3px;
    }
    li:hover {
        background-color: #e3e3e3;
    }
    .input__field :global(svg) {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
