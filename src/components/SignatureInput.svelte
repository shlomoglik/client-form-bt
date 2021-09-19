<script>
    import { onMount } from "svelte";
    import firebase from "firebase/app";
    import "firebase/storage";
    import FileThumb from "./FileThumb.svelte";
    import { fade } from "svelte/transition";
    import { uuid } from "../utils/data";
    import Icon from "./Icon.svelte";
    import { prompt } from "../stores";
    import Prompt from "./Prompt.svelte";
    import { assign } from "svelte/internal";

    export let header,
        formDoc,
        dataOptions = {};

    let valid = true;
    let attachments = [];

    let showPanel = true;
    let canvas;
    let globalWindow;
    let clickX = [];
    let clickY = [];
    let clickDrag = [];
    let paint = false;
    let isBlank = true;

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
                if ((field.type === "file"||field.type==="list_multiple") && value.length === 0) isEmpty = true;
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

    function clearCanvas() {
        clickX = [];
        clickY = [];
        clickDrag = [];
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.width;
        canvas.style.backgroundImage = "url(/signaturePen.png)";
        isBlank = true;
    }

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function isCanvasBlank() {
        return !canvas
            .getContext("2d")
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some((channel) => channel !== 0);
    }

    function redraw() {
        const context = canvas.getContext("2d");
        canvas.width = canvas.width; // Clears the canvas
        canvas.style.backgroundImage = "none";

        context.strokeStyle = "#0000CD";
        context.lineJoin = "round";
        context.lineWidth = 1.5;

        for (var i = 1; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i], clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
        if (isCanvasBlank()) isBlank = true;
        else isBlank = false;
    }

    function saveSignature() {
        if (isCanvasBlank()) return alert("לא ניתן לשמור חתימה ריקה");
        canvas.toBlob(function (blob) {
            Promise.resolve(handleAddFile(blob)).then(() => {
                clearCanvas();
                validate();
                showPanel = false;
            });
        });
    }
    async function handleRemoveFile(id) {
        try {
            const child = firebase.storage().ref(header).child(id);
            await child.delete();
            attachments = attachments.filter((file) => file.id !== id);
            $formDoc.docData[header] = attachments;
            if (attachments.length === 0) showPanel = true;
        } catch (err) {
            console.error("error on FileDoc.remove() \n", err);
        }
    }

    const handleAddFile = async (file) => {
        const field = $formDoc.headers[header];
        const id = uuid();
        const child = firebase.storage().ref(header).child(id);
        const metadata = {
            customMetadata: {
                fileName: `${id}.png`,
                createdAt: +new Date(),
                createdBy: firebase.auth().currentUser.uid,
            },
        };
        const task = child.put(file, metadata);

        const next = (_snap) => {
            const progress = (_snap.bytesTransferred / _snap.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
        };
        const error = (_error) => {
            console.error("error on file upload: ", _error);
        };
        const complete = async () => {
            try {
                const url = await task.snapshot.ref.getDownloadURL();
                const docData = Object.assign(
                    {
                        id,
                        url,
                        file,
                        created: +new Date(),
                        title: field.label,
                        contentType: file.type,
                        size: file.size,
                        type: file.type,
                    },
                    dataOptions
                );
                attachments = [...attachments, docData];
                $formDoc.docData[header] = attachments;
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
    };

    onMount(() => {
        validateField();
        canvas.onpointerdown = (e = new PointerEvent("down")) => {
            e.preventDefault();
            e.stopPropagation();
            const x = e.pageX - canvas.offsetLeft;
            const y = e.pageY - canvas.offsetTop;
            paint = true;
            addClick(x, y, false);
            // console.log(x, y);
            redraw(canvas);
        };
        canvas.onpointermove = (e = new PointerEvent("move")) => {
            e.preventDefault();
            e.stopPropagation();

            document.addEventListener(
                "touchmove",
                (event) => {
                    if (event.cancelable && paint) event.preventDefault();
                },
                { passive: false }
            );

            const x = e.pageX - canvas.offsetLeft;
            const y = e.pageY - canvas.offsetTop;
            if (paint) {
                addClick(x, y, true);
                redraw(canvas);
            }
        };
        canvas.onpointerup = (e) => (paint = false);
        canvas.onpointerleave = (e) => (paint = false);
    });

    function togglePanel() {
        showPanel = !showPanel;
    }
</script>

<div class="input" data-error={!valid}>
    {#if !valid}
        <Icon name="icon-warning" onClick={showError} />
    {/if}
    <label for={header}>
        {$formDoc.headers[header] ? $formDoc.headers[header].label : ""}
    </label>
    <div class="signature" class:hidden={!showPanel}>
        <canvas width="300" height="120" bind:this={canvas} />
        {#if !isBlank}
            <div class="actions" transition:fade>
                <div class="action clear" on:click={clearCanvas}>נקה</div>
                <div class="action save" on:click={saveSignature}>שמור</div>
            </div>
        {/if}
    </div>
    {#if attachments && attachments.length > 0}
        <div class="input-files input__field">
            {#each attachments as attachment, ind (attachment.id)}
                <FileThumb
                    attachment={Object.assign(attachment, { title: "" })}
                    {handleRemoveFile}
                />
            {/each}
        </div>
    {/if}
</div>

<style>
    .actions {
        display: grid;
        grid-auto-flow: column;
        gap: 3px;
        justify-items: center;
        width: 100%;
    }
    .action {
        cursor: pointer;
        padding: 3px 5px;
        border-radius: 10px;
        font-size: 20px;
        font-weight: 500;
    }
    .clear {
        color: orangered;
    }
    .save {
        color: navy;
    }
    .signature {
        visibility: visible;
        opacity: 1;
        height: auto;
        display: grid;
        justify-content: center;
        justify-items: center;
        gap: 5px;
        transition: all 0.2s ease-in-out;
    }

    .signature.hidden {
        visibility: hidden;
        opacity: 0;
        height: 0;
    }
    .signature canvas {
        background-image: url(/signaturePen.png);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        background-color: #eaecee;
        cursor: default !important;
        border: 6px double #80008036;
    }
</style>
