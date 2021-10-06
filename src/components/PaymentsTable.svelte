<script>
    import {
        addDays,
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
    export let serviceStartDate = formatDateDisplay(new Date(), {
        outputFormat: "yyyy-MM-dd",
    });
    export let servicePeriod = 12;
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
            fromDate: "",
            toDate: "",
        },
        headers: {
            price: { type: "number", label: "סכום" },
            fromDate: { type: "date", label: "כיסוי תקופת שירות - התחלה" },
            toDate: { type: "date", label: "כיסוי תקופת שירות - סיום" },
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
        priceData.docData.price = totalDeal / defatultPayments || defaultPrice;
        priceData.docData.date = defaultDate;
        priceData.docData.fromDate = serviceStartDate;

        let payDate = new Date(priceData.docData.date);
        let sDate = new Date(serviceStartDate);
        const monthsIncludeInPayment = servicePeriod / defatultPayments;
        let eDate = addDays(-1, addMonths(monthsIncludeInPayment, sDate));
        priceData.docData.fromDate = formatDateDisplay(sDate, {
            outputFormat: "yyyy-MM-dd",
        });
        priceData.docData.toDate = formatDateDisplay(eDate, {
            outputFormat: "yyyy-MM-dd",
        });

        for (let i = 0; i < defatultPayments; i++) {
            const currentPayment = Object.assign({}, priceData.docData);
            if (i > 0 && priceData.docData.date) {
                payDate = addMonths(monthsIncludeInPayment, payDate);
                sDate = addMonths(monthsIncludeInPayment, sDate);
                eDate = addDays(-1, addMonths(monthsIncludeInPayment, sDate));
                currentPayment.date = formatDateDisplay(payDate, {
                    outputFormat: "yyyy-MM-dd",
                });
                currentPayment.fromDate = formatDateDisplay(sDate, {
                    outputFormat: "yyyy-MM-dd",
                });
                currentPayment.toDate = formatDateDisplay(eDate, {
                    outputFormat: "yyyy-MM-dd",
                });
            }
            $formDoc.docData.payments[i] = { ...currentPayment, id: i };
        }
    };
    const handleAddPayment = () => {
        const lastPayment = payments.reduce((prev, next) =>
            next.docData.date > prev.docData.date ? next : prev
        );
        let payDate = new Date(lastPayment.docData.date);
        payDate = addMonths(monthsIncludeInPayment, payDate);
        let sDate = new Date(lastPayment.docData.sDate);
        const monthsIncludeInPayment = servicePeriod / defatultPayments;
        let eDate = addDays(
            -1,
            addMonths(
                monthsIncludeInPayment,
                new Date(lastPayment.docData.eDate)
            )
        );

        const currentPayment = Object.assign({}, priceData.docData);
        currentPayment.id = payments.length;
        currentPayment.date = formatDateDisplay(payDate, {
            outputFormat: "yyyy-MM-dd",
        });
        currentPayment.fromDate = formatDateDisplay(sDate, {
            outputFormat: "yyyy-MM-dd",
        });
        currentPayment.toDate = formatDateDisplay(eDate, {
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
                        bind:value={payment.fromDate}
                    />
                </div>
                <div class="input">
                    <input
                        class="input__field"
                        type="date"
                        bind:value={payment.toDate}
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
