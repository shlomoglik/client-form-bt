<script>
    //THINK: use https://developers.google.com/web/fundamentals/media/capturing-images to grap images directly from camera!
    import { prompt } from "../stores";
    import { uuid } from "../utils/data";
    import firebase from "firebase/app";
    import "firebase/storage";
    import Icon from "./Icon.svelte";
    import { onMount } from "svelte";
    import FileThumb from "./FileThumb.svelte";

    export let header,
        formDoc,
        dataOptions = {};

    $: load = 0;
    let valid = true;
    let error = "";
    let fileInput;
    let files;
    let attachments = [];

    onMount(() => {
        validateField();
        // if('mediaDevices' in navigator){
        //     console.log("TODO: add option to grap from device")
        // }
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
                if (
                    (field.type === "file" || field.type === "list_multiple" || field.type === "signature") &&
                    value.length === 0
                )
                    isEmpty = true;
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

    $: {
        if (files && files[0]) handleFileChange();
    }

    async function handleRemoveFile(id) {
        try {
            const child = firebase.storage().ref(header).child(id);
            await child.delete();
            attachments = attachments.filter((file) => file.id !== id);
            $formDoc.docData[header] = attachments;
            validate();
        } catch (err) {
            console.error("error on FileDoc.remove() \n", err);
        }
    }

    const handleFileChange = async () => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const id = uuid();
            const child = firebase.storage().ref(header).child(id);
            const metadata = {
                customMetadata: {
                    fileName: file.name,
                    createdAt: +new Date(),
                    createdBy: firebase.auth().currentUser.uid,
                },
            };
            const task = child.put(file, metadata);

            const next = (_snap) => {
                const progress =
                    (_snap.bytesTransferred / _snap.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                load = parseInt(progress);
            };
            const error = (_error) => {
                console.error("error on file upload: ", _error);
            };
            const complete = async () => {
                try {
                    load = 0
                    const url = await task.snapshot.ref.getDownloadURL();
                    const docData = Object.assign(
                        {
                            id,
                            url,
                            file,
                            created: +new Date(),
                            title: file.name,
                            contentType: file.type,
                            size: file.size,
                            type: file.type,
                        },
                        dataOptions
                    );
                    attachments = [...attachments, docData];
                    $formDoc.docData[header] = attachments;
                    validate();
                    console.log("load end", url);
                } catch (err) {
                    console.error(err);
                }
            };
            task.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                next,
                error,
                complete
            );
        }
    };
    //OLD: *local only*
    // const handleRemoveFile = ({ id }) => {
    //     attachments = attachments.filter((file) => file.id !== id);
    //     $formDoc.docData[header] = attachments;
    // };
    // const handleFileChange = () => {
    //     for (let i = 0; i < files.length; i++) {
    //         const reader = new FileReader();
    //         const file = files[i];
    //         // reader.onload = () => {
    //         // };
    //         reader.onprogress = (evt) => {
    //             loader = { total: evt.total };
    //             console.log("load in progress ", evt.total);
    //         };
    //         reader.onloadend = (evt) => {
    //             loader = false;
    //             const docData = Object.assign(
    //                 {
    //                     id: uuid(),
    //                     title: file.name,
    //                     contentType: file.type,
    //                     size: file.size,
    //                     url: reader.result,
    //                     type: file.type,
    //                     created: +new Date(),
    //                     file,
    //                 },
    //                 dataOptions
    //             );
    //             attachments = [...attachments, docData];
    //             $formDoc.docData[header] = attachments;
    //             console.log("load end");
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
</script>

<div class="input" data-error={!valid} tabindex="0" on:blur={validate}>
    {#if !valid}
        <Icon name="icon-warning" onClick={showError} />
    {/if}
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    {#if load}
        <div>loading {load}%</div>
    {/if}
    <input
        bind:this={fileInput}
        type="file"
        hidden
        name={header}
        id={header}
        bind:files
        multiple
        onChange={handleFileChange}
        required={$formDoc.docData[header].required}
    />
    <div class="input-files input__field" on:click={() => fileInput.click()}>
        {#if files && files[0]}
            <div hidden>{files[0].name}</div>
        {/if}
        {#each attachments as attachment, ind (attachment.id)}
            <FileThumb {attachment} {handleRemoveFile} />
        {/each}
        <button>+ קובץ</button>
    </div>
</div>

<style>
    label {
        cursor: pointer;
    }
    :global(.input-files) {
        display: grid;
        gap: 5px;
        background-color: rgb(255, 253, 253);
    }

    :global(.input-files button) {
        color: gray;
        background-color: transparent;
        transition: all 0.2s ease-in-out;
    }
    :global(.input-files button:hover) {
        transform: scale(1.1);
    }
</style>
