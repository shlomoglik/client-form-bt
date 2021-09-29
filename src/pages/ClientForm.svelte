<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { formatDateDisplay, getDisplayValue } from "../utils/data";
  import { formDoc, formGroups, prompt } from "../stores";
  import FormGroup from "../components/FormGroup.svelte";
  import SignatureInput from "../components/SignatureInput.svelte";
  import ContractTitle from "../components/ContractTitle.svelte";
  import ContractSides from "../components/contractSides/ContractSides.svelte";
  import ContractWhereas from "../components/ContractWhereas.svelte";
  import Subs from "../components/Subs.svelte";
  import CollapsibleGroup from "../components/CollapsibleGroup.svelte";
  import PaymentsTable from "../components/PaymentsTable.svelte";
  import ContractProducts from "../components/ContractProducts.svelte";
  import Input from "../components/Input.svelte";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();

  $: valid = $formDoc.valid;
  $: errors = $formDoc.errors;
  $: currentAddress = "";

  //form automation
  $: {
    if ($formDoc.docData.price) {
      $formDoc.docData.priceIncludeVAT = parseInt(
        $formDoc.docData.price * 1.17
      );
    }
  }

  let contractElem;
  onMount(() => {
    fetchCurrentLocation();
  });

  function fetchCurrentLocation() {
    navigator.geolocation.getCurrentPosition((res) => {
      const apiKey = "tXCWToa7qnKQz1pHe4P8ap3XUQ0kdRt9";
      const { latitude, longitude } = res.coords;
      const url = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=${latitude},${longitude}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (
            data &&
            data.results &&
            data.results[0] &&
            data.results[0].locations &&
            data.results[0].locations[0]
          ) {
            const { street, adminArea5 } = data.results[0].locations[0];
            currentAddress = `${adminArea5} , ${street}`;
          }
        });
    });
  }

  function removeError(item) {
    $formDoc.errors = errors.filter((el) => el !== item);
  }

  async function handleOnSubmit() {
    try {
      const url =
        "https://hook.integromat.com/95nczekdzhsagsr4s8fypa1e9p9booly";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(
          Object.assign({}, $formDoc.docData, {
            contractHTML: contractElem.innerHTML,
          })
        ),
        contentType: "application/json",
      });
      if (response.status == 200) {
        // TODO: add -> newClientID to state
        const result = await response.json();
        const newClientID = result?.newClientID || "";
        formDoc.reset();
        navigate("/finish-add", { replace: true, state: { newClientID } });
      }
    } catch (e) {
      console.error(e);
    }
  }

  const appendix = {
    1: {
      text: "פירוט תכולת השירות",
      id: "serviceContent",
      size: "M",
      subText: "להלן: נספח תכולת השירות",
    },
    2: {
      text: "הצעת מחיר ומבנה ההתקשרות",
      size: "M",
      id: "priceQuote",
      subText: "להלן: נספח הצעת מחיר",
    },
    3: {
      text: "תנאים מסחריים",
      id: "terms",
      size: "M",
    },
  };

  const wheres = [
    {
      text: `והוסכם כי נותנת השירותים תספק שירות ללקוח כמפורט בנספחים לעיל 
      (להלן: נספח <strong>"הצעת מחיר"</strong> ונספח <strong>"תכולת השירות"</strong> );
      יצויין כי נספחים אלה הינם חלק בלתי נפרד מהסכם זה;`,
      prefix: "הואיל",
    },
    {
      text: "וברצון הצדדים להתקשר בהסכם התקשרות זה תוך שהצדדים מצהירים כי אין בינם ולא התקיימו בינם ולא יתקיימו בינם יחסי עובד מעביד;",
    },
    {
      text: "והלקוח מאשר כי קרא והבין את כלל מרכיבי חבילת השירות כפי המפורט בקטלוג החברה שהוצג בפניו;",
    },
  ];

  const subs = [
    {
      id: 1,
      index: 1,
      editable: true,
      text: `השירותים שיסופקו ע"י נותנת השירות הם כפי שסוכמו טרם הסכם זה <strong>והמפורטים כנספח להסכם זה</strong> ("תכולת השירות"). 
      יחד עם זאת אין נותנת השירותים מתחייבת לתוצאה של שירותיה הואיל וקיימים גורמים שונים המשפיעים על סיכויי ההצלחה לרבות התנהלות והתנהגות הלקוח.`,
    },
    {
      id: 2,
      index: 2,
      editable: false,
      text: `הלקוח מתחייב לשתף פעולה עם נותנת השירותים ומאשר כי ידוע לו שככל ולא יהא שיתוף פעולה אזי תפגע עבודת נותנת השירותים ופועל יוצא מכך – התמורה שיקבל הלקוח. הלקוח מוותר בזאת על כל טענה שתעלה אצלו כנגד נותנת השירותים בעניין ההתקשרות עם נותנת השירותים.`,
    },
    {
      id: "3A",
      index: 3,
      groupCompany: "A",
      editable: false,
      text: `מוסכם על הצדדים כי חבילת השירות שנבחרה על ידי הלקוח הנה בעלות ובאמצעות אמצעי התשלום כפי שפורט בהצעת המחיר.`,
    },
    {
      id: "3B",
      index: 3,
      groupCompany: "B",
      editable: false,
      text: `מוסכם על הצדדים כי חבילת המוצר שנבחרה על ידי הלקוח הנה בעלות ובאמצעות אמצעי התשלום כפי שפורט בהצעת המחיר.`,
    },
    {
      id: 4,
      index: 4,
      editable: false,
      text: "הלקוח מאשר בחתימתו על הסכם זה ומצהיר כי ניתנה לו האפשרות לעיין בהסכם זה טרם חתימתו וכי עיין וקרא והבין הסכם זה טרם חתם עליו ואף מאשר כי קיבל לידו העתק של ההסכם ולא נמנע ממנו לקבל ייעוץ משפטי לגביו ולגבי תוצאותיו והשלכותיו המשפטיות.",
    },
    {
      id: 5,
      index: 5,
      editable: false,
      text: "כל סיכום ואו מסמך שנחתם ואו הבטחה ואו מצג שבוצעו בין הצדדים טרם חתימת הסכם זה והנוגע להסכם זה (ולא הוכנסו להסכם זה) בטלים, ולא תעמוד בהווה או בעתיד טענה למי מהצדדים על כך.",
    },
    {
      id: 6,
      index: 6,
      editable: false,
      text: "הצדדים מצהירים כי אין כל מניעה מהם על פי כל דין, הסכם ו/או סיבה אחרת מליטול על עצמם את ההתחייבויות ותנאי הסכם התקשרות זה.",
    },
    {
      id: 7,
      index: 7,
      editable: false,
      text: "הצדדים לא יהיו רשאים להסב או להמחות לאחר את זכויותיהם ו/או התחייבויותיהם על פי ההסכם או כל חלק מהן, אלא באישור מראש ובכתב מאת הצדדים האחרים.",
    },
    {
      id: 8,
      index: 8,
      editable: false,
      text: "התנהגות מי מהצדדים לא תחשב כוויתור על זכות מזכויותיו על פי הסכם זה או על פי כל דין, לרבות בקשר להפרה או אי-קיום תנאי כלשהו, אלא אם הוויתור, ההסכמה, הדחייה, השינוי, הביטול או התוספת, נעשו במפורש ובכתב.",
    },
    {
      id: "9A",
      index: 9,
      groupCompany: "A",
      editable: false,
      text: "מועד תחילת ההתקשרות הינו במועד חתימת הסכם התקשרות זה כל עוד לא הוסכם אחרת בין הצדדים. זאת תוך התחייבות של הלקוח לתקופה כפי המצויין בנספח הצעת המחיר.",
    },
    {
      id: "10A",
      groupCompany: "A",
      index: 10,
      editable: false,
      text: `משך ההסכם הינו ל#_contractPeriod_# חודשים 
      (קרי, כ#_contractPeriod_# תשלומים חודשיים),
      החל מיום ההתקשרות.
      עם זאת, באם יבחר הלקוח לסיים את  ההתקשרות בחלון היציאה (היה והוגדר כזה בנספח הצעת המחיר), יישא הלקוח בעלות אותם החודשים בלבד.`,
    },
    {
      id: "11A",
      groupCompany: "A",
      index: 11,
      editable: false,
      text: `מוסכם על הצדדים כי חרף המוסכם בסעיף &_1_& לעיל (תקופת ההתקשרות), 
      כל אחד מהצדדים יוכל להביא הסכם זה לסיומו בהתראה בכתב לצד הנשגר, שלושים (30) יום לפני חלון היציאה (היה והוגדר כזה) כפי המפורט בנספח הצעת המחיר.
      ההתראה תימסר לכתובת נותנת השירותים או הלקוח, טעמי הביטול יכול ויימסרו לצד הנשגר. 
      `,
    },
    {
      id: "12A",
      groupCompany: "A",
      index: 12,
      editable: true,
      text: `מוסכם כי הארכת הסכם זה תיעשה בכתב בהודעה בת שלושים (30) ימי עסקים טרם סיום תקופת הסכם זה, ובחירת חבילת השירות הנדרשת ללקוח.`,
    },

    {
      id: "9B",
      groupCompany: "B",
      index: 9,
      editable: true,
      text: `סעיף "קורונה" – מוסכם על הצדדים כי בתקופת מגפה ו\או כוח עליון ו\או סגר ו\או החלטה ממשלתית שתמנע מהמשק לעבוד ("סגר"), לא תשמש עילה לביטול הסכם זה ו\או ביטול תשלום מצד הלקוח בהתאם להסכם זה ולא תשמע כל טענה מהלקוח בעניין זה.`,
    },
    {
      id: "10B",
      groupCompany: "B",
      index: 10,
      editable: true,
      text: `מוסכם על הצדדים כי ביטול הסכם זה על ידי הלקוח בכל עת ושלב לא יגרום להחזר תשלום, ואם לא שולם לביטול תשלום לפי המדיניות הבאה:
      <br>עד ביצוע אפיון – החזר מלא
      <br>מביצוע אפיון ועד תיאום יום צילום – 50% החזר/תשלום
      <br>מיום הצילומים ואילך – 100% תשלום.`,
    },
    {
      id: "11B",
      groupCompany: "B",
      index: 11,
      editable: true,
      text: `מוסכם על הצדדים כי איחור בהגשת המוצר המוגמר ללקוח מעבר לשלושים (30) ימי עסקים מיום הצילום יזכה את הלקוח בהחזר כספי של כ1% על כל יום איחור מהמועד שנקבע..`,
    },
    {
      id: "12B",
      groupCompany: "B",
      index: 12,
      editable: true,
      text: `אולם ככל והאיחור נובע מסגר ו\או השבתת פעילות החברה ו\או צו או תקנה או החלטת ממשלה אזי לא יהא כל החזר ללקוח והמוצר יוגש מיד כשתתקיים פעילות עסקית בחברה.`,
    },

    {
      id: 13,
      index: 13,
      editable: true,
      text: `מוסכם על הצדדים כי תשלומים לספקים צדדי ג' נדרשים ישולמו על ידי הלקוח והם אינם חלק מהתשלומים שיועברו למשרדנו. ביאור: תשלומים לספקים צדדי ג' הם כלל השירותים שאינם מופיעים בנספח תכולת השירות.
במידה וחבילת השירות כוללת ניהול קמפיינים ללקוח - על הלקוח לספק פרטי כרטיס אשראי לטובת ניהול תקציבי הקמפיינים ככל שיידרש. הלקוח מודע לכך כי במידה ולא ניתן יהיה לחייב את כרטיס האשראי שלו עבור תקציב הפרסום , הדבר עלול לפגוע בקיום הקמפיינים.`,
    },
    {
      id: "14A",
      groupCompany: "A",
      index: 14,
      editable: true,
      text: `הצדדים מתחייבים התחייבות הדדית אחד לשני לשמור על סודיות הנתונים המתקבלים אצלם במסגרת התקשרות זו ואף שנתיים בסיומה, מוסכם על הצדדים כי הפרה של סעיף זה הנה הפרה יסודית של הסכם זה המזכה את הצד הנפגע בפיצוי כספי מוסכם המוערך יחד על ידי הצדדים בסך <strong>סכום ליווי של שלושה חודשים</strong>, מבלי הצורך בניהול הליך משפטי.`,
    },
    {
      id: "14B",
      groupCompany: "B",
      index: 14,
      editable: true,
      text: `הצדדים מתחייבים התחייבות הדדית אחד לשני לשמור על סודיות הנתונים המתקבלים אצלם במסגרת התקשרות זו ואף שנתיים בסיומה, מוסכם על הצדדים כי הפרה של סעיף זה הנה הפרה יסודית של הסכם זה המזכה את הצד הנפגע בפיצוי כספי מוסכם המוערך יחד על ידי הצדדים בסך <strong>סכום העסקה</strong>, מבלי הצורך בניהול הליך משפטי.`,
    },
    {
      id: 15,
      index: 15,
      editable: true,
      text: `מוסכם על הצדדים כי אי עמידה בתשלום מאפשרים לנותנת השירותים להפסיק את ההתקשרות לאלתר/ לרבות העלאת דרישה לתשלום יתרת התשלום`,
    },
    {
      id: 16,
      index: 16,
      editable: true,
      text: "מוסכם כי בכל סכסוך הנוגע להסכם זה תהיה גם בסמכות בתי המשפט בישראל וסמכות השיפוט הבלעדית נתונה לבית המשפט המוסמך בראשון לציון.",
    },
    {
      id: 17,
      index: 17,
      editable: false,
      text: "כל שינוי ו/או ביטול של סעיף מסעיפי הסכם זה, ייעשה אך ורק במסמך בכתב אשר יהיה חתום על ידי שני הצדדים.",
    },
    {
      id: 18,
      index: 18,
      editable: false,
      text: "כל ההסכמות האמורות בהסכם זה תלויות ושלובות זו בזה.",
    },
    {
      id: 19,
      index: 19,
      editable: false,
      text: "הודעה שתישלח על פי כתובות הצדדים במבוא להסכם זה בדואר רשום, תחשב כאילו הגיעה לצד הנשגר ולידיעתו תוך שלושה (3) ימים מעת שיגורה בדואר רשום מבית דואר בישראל ואם נמסרה ביד-בעת מסירתה, ואם שוגרה באימייל - תוך 24 שעות ממועד שיגורה.",
    },
  ];
</script>

<section transition:fade>
  <h1>טופס הוספת לקוח חדש</h1>
  <p>להוספת לקוח חדש למערכת מונדיי יש למלא אחר הוראות הטופס:</p>
  <form
    class="form"
    on:submit|preventDefault={(e) => e.preventDefault()}
    autocomplete="off"
  >
    <CollapsibleGroup title="כללי" shrinkable={false}>
      <Input header="groupCompanyName" {formDoc} />
    </CollapsibleGroup>
    {#each $formGroups as formGroup}
      <FormGroup
        title={formGroup.title}
        {formGroup}
        {formDoc}
        shrinkable
        isShrink={formGroup.isShrink}
      />
    {/each}
  </form>
  <CollapsibleGroup title="נספח חלוקת תשלומים" isShrink shrinkable>
    <PaymentsTable
      {formDoc}
      defaultDate={$formDoc.docData.feeStartDate}
      defaultPrice={$formDoc.docData.priceIncludeVAT}
      defatultPayments={$formDoc.docData.noOfPayments}
    />
  </CollapsibleGroup>
  {#if contractElem}
    <pre hidden>{contractElem.innerHTML}</pre>
  {/if}
  <div class="contract" bind:this={contractElem}>
    <!-- <div class="errors">
                {#each errors as error}
                  <div transition:fly>
                    {error.text}
                    <span on:click={(e) => removeError(error)}>x</span>
                  </div>
                {/each}
              </div> -->
    <ContractTitle
      size="L"
      text={`הסכם התקשרות ומתן שירותים ${
        $formDoc.docData.package
          ? "חבילת " +
            getDisplayValue($formDoc.docData.package, "list", {
              field: $formDoc.headers.package,
              attributes: ["productTitle"],
            })
          : ""
      }`}
    />
    <div>
      <p contenteditable>
        {`הסכם זה נערך בתאריך ${formatDateDisplay(new Date(), {
          outputFormat: "dd=>mm",
        })}, בכתובת ${currentAddress}`}
      </p>
    </div>
    <ContractSides
      company={{
        name: $formDoc.docData.groupCompanyName,
        id: $formDoc.docData.groupCompanyNumber,
        type: "חברה בעמ",
        signers: [
          {
            prefix: "",
            name: $formDoc.docData.salesAgentName,
            id: $formDoc.docData.salseAgentID,
          },
        ],
      }}
      client={{
        name: $formDoc.docData.companyName,
        id: $formDoc.docData.companyNumber,
        type: $formDoc.docData.companyType,
        signers: [
          {
            id: $formDoc.docData.clientNumber,
            name: $formDoc.docData.clientName,
          },
        ],
      }}
    />
    <ContractTitle
      text={appendix[1].text}
      size={appendix[1].size}
      subText={appendix[1].subText}
    />
    <ContractProducts {formDoc} />
    <ContractTitle
      text={appendix[2].text}
      size={appendix[2].size}
      subText={appendix[2].subText}
    />
    <div class="priceQuote">
      <span>חבילת שירות</span>
      <div>
        {getDisplayValue($formDoc.docData.package, "list", {
          field: $formDoc.headers.package,
        }) || "_____"}
      </div>
      {#if $formDoc.docData.retainerOrDeal === "ריטיינר"}
        <span>עלות חודשית</span>
      {:else}
        <span>עלות</span>
      {/if}
      <div>
        {$formDoc.docData.price
          ? getDisplayValue($formDoc.docData.price, "currency")
          : "_____"}
      </div>
      {#if $formDoc.docData.retainerOrDeal === "ריטיינר"}
        <span>משך זמן ליווי</span>
        <div>
          {$formDoc.docData.contractPeriod
            ? getDisplayValue($formDoc.docData.contractPeriod, "number", {}) +
              " חודשים"
            : "_____"}
        </div>
        <span>תאריך תחילת ההתקשרות</span>
        <div>
          {$formDoc.docData.contractStartDate
            ? getDisplayValue($formDoc.docData.contractStartDate, "date")
            : "_____"}
        </div>
        <span>חלון יציאה</span>
        <div contenteditable>כל 3 חודשים</div>
      {/if}
      <span>עלות נוספת</span>
      <div contenteditable />
      <span>הערות</span>
      <div contenteditable>{$formDoc.docData.notes}</div>
    </div>
    <ContractTitle
      text={appendix[3].text}
      size={appendix[3].size}
      subText={appendix[3].subText}
    />
    {#each wheres as { text, prefix }, ind}
      <ContractWhereas {text} {prefix} />
    {/each}
    <Subs {subs} {formDoc} />
    <SignatureInput header="clientSignature" {formDoc} />
  </div>
  {#if valid}
    <button type="button" on:click={handleOnSubmit} data-disabled={!valid}>
      בצע הזמנת עבודה
    </button>
  {/if}
</section>

<style>
  .priceQuote {
    display: grid;
    justify-content: center;
    grid-template-columns: max-content 1fr;
    justify-self: center;
    min-width: 50vw;
    align-content: center;
  }
  .priceQuote div,
  .priceQuote span {
    padding: 8px;
    border: 1px solid rgba(204, 204, 204, 0.5);
  }
  .priceQuote span {
    font-weight: 700;
  }

  h1 {
    color: var(--color-primary);
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 300;
  }
  .form {
    padding: 5px;
    display: grid;
  }
  .contract {
    display: grid;
    gap: 2rem;
    align-items: center;
    padding: 5%;
    border: 10px solid #9f00ff12;
    margin-top: 15px;
  }
  /* ol .sub {
    text-align: justify;
  }
  ol.subs {
    display: grid;
    gap: 5px;
    padding: 0 10vw;
  } */
  /* 
  .errors {
    display: grid;
    gap: 5px;
  }
  .errors > div {
    background-color: #ffe2de;
    color: red;
    font-size: 20px;
    padding: 5px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 3rem;
  }
  .errors span {
    font-weight: 600;
    font-size: 20px;
    cursor: pointer;
  }
  .errors span:hover {
    transform: scale(1.3);
  }
  .errors span:active {
    transform: scale(1);
  } */
  button {
    justify-self: center;
  }
</style>
