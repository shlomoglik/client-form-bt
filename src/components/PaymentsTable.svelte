<script>
    import {
        addMonths,
        formatDateDisplay,
        getDisplayValue,
    } from "../utils/data";
    import IconButton from "./IconButton.svelte";

    export let formDoc;
    export let defaultPrice = 0;
    export let defaultDate = formatDateDisplay(new Date(), {
        outputFormat: "yyyy-MM-dd",
    });
    export let defatultPayments = 12;

    $: totalDeal =
        parseFloat($formDoc.docData.priceIncludeVAT || 0) *
        parseInt($formDoc.docData.contractPeriod || 1);
    $: priceData = {
        docData: {
            price: defaultPrice,
            date: defaultDate,
            paymentType: "check",
            received: "true",
        },
        headers: {
            price: { type: "number", label: "סכום" },
            date: { type: "date", label: "תאריך פירעון" },
            paymentType: {
                type: "list",
                label: "אמצעי תשלום",
                options: [
                    { id: "check", text: "שיק" },
                    { id: "credit", text: "אשראי" },
                    { id: "cash", text: "מזומן" },
                    { id: "bankTransfer", text: "העברה" },
                    { id: "other", text: "אחר" },
                ],
            },
            received: {
                type: "list",
                label: "שולם",
                options: [
                    { id: "true", text: "התקבל" },
                    { id: "false", text: "עתידי" },
                ],
            },
        },
    };
    $: payments = $formDoc.docData.payments;
    const createPaymentsTable = () => {
        $formDoc.docData.payments = [];
        priceData.docData.price = (totalDeal / defatultPayments) || defaultPrice
        priceData.docData.date = defaultDate;

        let lastDate = new Date(priceData.docData.date);
        for (let i = 0; i < defatultPayments; i++) {
            const currentPayment = Object.assign({}, priceData.docData);
            if (i > 0 && priceData.docData.date) {
                lastDate = addMonths(1, lastDate);
                currentPayment.date = formatDateDisplay(lastDate, {
                    outputFormat: "yyyy-MM-dd",
                });
            }
            $formDoc.docData.payments[i] = { ...currentPayment, id: i };
        }
    };
    const handleAddPayment = () => {
        let lastDate = new Date(
            payments.reduce(
                (acc, curr) => Math.max(acc, new Date(curr.date)),
                +new Date()
            )
        );
        lastDate = addMonths(1, lastDate);
        const currentPayment = Object.assign({}, priceData.docData);
        currentPayment.id = payments.length;
        currentPayment.date = formatDateDisplay(lastDate, {
            outputFormat: "yyyy-MM-dd",
        });
        $formDoc.docData.payments = [...payments, currentPayment];
    };
    const handleRemovePayment = (index) => {
        if (payments.length > 1) {
            $formDoc.docData.payments = $formDoc.docData.payments.filter(
                (el, ind) => ind !== index
            );
        }
    };
    
</script>

<div class="wrrapper">
    <div class="deal">
        <div>
            מחיר עסקה כולל : {getDisplayValue(totalDeal, "currency")}
        </div>
        <div>
            תשלומים בפועל : {getDisplayValue(
                payments.reduce((acc, curr) => parseInt(curr.price) + acc, 0),
                "currency"
            )}
        </div>
        <div>
            הפרש : {getDisplayValue(
                totalDeal -
                    payments.reduce(
                        (acc, curr) => parseInt(curr.price) + acc,
                        0
                    ),
                "currency"
            )}
        </div>
        <div>
            כמות תשלומים : {payments.length}
        </div>
    </div>

    <div class="tableActions">
        <button on:click={createPaymentsTable}
            >{payments.length > 0 ? "רענן לוח תשלומים" : "צור לוח תשלומים"}
        </button>
        <button on:click={handleAddPayment}>הוסף תשלום</button>
    </div>
    {#if payments.length > 0}
        <div
            class="payments"
            style={`grid-template-columns:${Object.keys(priceData.headers)
                .map(() => "1fr")
                .join(" ")} max-content`}
        >
            {#each Object.entries(priceData.headers) as [headerKey, header] (headerKey)}
                <div>{header.label}</div>
            {/each}
            <div>&nbsp;</div>
            {#each payments as payment, index}
                <div class="input">
                    <input
                        class="input__field"
                        type="number"
                        bind:value={payment.price}
                    />
                </div>
                <div class="input">
                    <input
                        class="input__field"
                        type="date"
                        bind:value={payment.date}
                    />
                </div>
                <div class="input">
                    <select
                        class="input__field"
                        bind:value={payment.paymentType}
                    >
                        {#each priceData.headers.paymentType.options as opt}
                            <option value={opt.id}>{opt.text}</option>
                        {/each}
                    </select>
                </div>
                <div class="input">
                    <select class="input__field" bind:value={payment.received}>
                        {#each priceData.headers.received.options as opt}
                            <option value={opt.id}>{opt.text}</option>
                        {/each}
                    </select>
                </div>
                <div class="rowActions">
                    {#if payments.length > 1}
                        <IconButton
                            action={(e) => handleRemovePayment(index)}
                            icon="icon-trash"
                            color="var(--color-danger)"
                            withConfirm="למחוק?"
                        />
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .wrrapper {
        display: grid;
        gap: 1rem;
    }
    .deal {
        display: grid;
        gap: 5px;
        border: 4px double gray;
        justify-self: center;
        padding: 1.5rem;
    }
    .payments {
        display: grid;
    }
    .input {
        justify-content: stretch;
    }
    .tableActions {
        display: grid;
        grid-auto-flow: column;
        place-items: center;
    }
    .rowActions {
        display: grid;
        place-items: center;
        grid-auto-flow: column;
        padding: 3px;
    }
</style>
