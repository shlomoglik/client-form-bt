<script>
    import { formDoc } from "../stores";
    export let header,
        files,
        attachments = [],
        loader = false,
        dataOptions = {};

    const handleFileChange = (e) => {
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            const file = files[i];
            reader.onload = () => {
                const docData = Object.assign(
                    {
                        title: file.name,
                        contentType: file.type,
                        size: file.size,
                        url: reader.result,
                        created: +new Date(),
                        file,
                    },
                    dataOptions
                );
                attachments = [...attachments, docData];
            };
            reader.onprogress = (evt) => {
                loader = { total: evt.total };
                console.log("load in progress ", evt.total);
            };
            reader.onloadend = (evt) => {
                loader = false;
                console.log("load end");
            };
            reader.readAsDataURL(file);
        }
    };
</script>

<div class="input">
    <label for={header}>
        {#if !attachments[0] }
            "העלה קובץ +"
        {:else}
            {#each attachments as attachment}
                <img src={attachment.url} alt="image" />
            {/each}
        {/if}
    </label>
    <input
        type="file"
        hidden="true"
        name={header}
        id={header}
        bind:files
        onchange={handleFileChange}
    />
</div>
