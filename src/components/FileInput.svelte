<script>
    import { formDoc } from "../stores";
    import { uuid } from "../utils/data";
    export let header,
        fileInput,
        files,
        attachments = [],
        loader = false,
        dataOptions = {};

    $: {
        if (files && files[0]) handleFileChange();
    }
    const handleRemoveFile = ({ id }) => {
        attachments = attachments.filter((file) => file.id !== id);
        $formDoc.docData[header] = attachments;
    };
    const handleFileChange = () => {
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            const file = files[i];
            // reader.onload = () => {
            // };
            reader.onprogress = (evt) => {
                loader = { total: evt.total };
                console.log("load in progress ", evt.total);
            };
            reader.onloadend = (evt) => {
                loader = false;
                const docData = Object.assign(
                    {
                        id: uuid(),
                        title: file.name,
                        contentType: file.type,
                        size: file.size,
                        url: reader.result,
                        type: file.type,
                        created: +new Date(),
                        file,
                    },
                    dataOptions
                );
                attachments = [...attachments, docData];
                $formDoc.docData[header] = attachments;
                console.log("load end");
            };
            reader.readAsDataURL(file);
        }
    };
</script>

<div class="input">
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <input
        bind:this={fileInput}
        type="file"
        hidden
        name={header}
        id={header}
        bind:files
        onChange={handleFileChange}
    />
    <div class="input-files input__field" on:click={() => fileInput.click()}>
        {#if files && files[0]}
            <div hidden>{files[0].name}</div>
        {/if}
        {#each attachments as attachment}
            <div class="file-thumb" on:click|preventDefault|stopPropagation>
                <span
                    class="close"
                    on:click|preventDefault|stopPropagation={handleRemoveFile(
                        attachment
                    )}>X</span
                >
                <span>{attachment.title}</span>
                {#if attachment.type === "application/pdf"}
                    <iframe
                        on:click|preventDefault|stopPropagation
                        title="תצוגה מקדימה"
                        name="תצוגה מקדימה"
                        src={attachment.url}
                        height="300"
                        align="center"
                        allow="fullscreen"
                        frameborder="0"
                    />
                {:else if attachment.type.startsWith("image/")}
                    <image src={attachment.url} alt={attachment.title} />
                {/if}
            </div>
        {/each}
        <button>+ קובץ</button>
    </div>
</div>

<style>
    label {
        cursor: pointer;
    }
    .input-files {
        display: grid;
        gap: 5px;
        background-color: rgb(255, 253, 253);
    }
    .input-files image {
        object-fit: contain;
    }
    .input-files > div {
        padding: 15px 15px;
        background-color: #e9e9e9;
        border-radius: 10px;
        position: relative;
    }
    .input-files .file-thumb {
        display: grid;
        gap: 5px;
        align-items: center;
        justify-content: center;
    }
    .input-files .close {
        position: absolute;
        border-radius: 50%;
        left: 3px;
        top: 3px;
        width: 5px;
        height: 5px;
        color: lightgray;
        transition: color 0.2s ease-in-out;
        cursor: pointer;
    }
    .input-files .close:hover {
        color: orangered;
        transform: scale(1.1);
    }
    .input-files .close:active {
        transform: scale(1);
    }
    button {
        color: gray;
        background-color: transparent;
        transition: all 0.2s ease-in-out;
    }
    button:hover {
        transform: scale(1.1);
    }
</style>
