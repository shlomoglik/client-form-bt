<script>
  import firebase from "firebase/app";
  import "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyDHpUO08qfO43u78AVHS8MKi8Wt6Tnd3jc",
    authDomain: "files-directory.firebaseapp.com",
    projectId: "files-directory",
    storageBucket: "files-directory.appspot.com",
    messagingSenderId: "399103769387",
    appId: "1:399103769387:web:7343fe2ed8c3561d86a36e",
  };
  const app = firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth(app);

  import Auth from "./components/Auth.svelte";
  import Login from "./components/Login.svelte";
  import FormGroup from "./components/FormGroup.svelte";
  import { logout } from "./auth";
  import { formDoc, formGroups, prompt } from "./stores";
  import Prompt from "./components/Prompt.svelte";
  import { fade, fly } from "svelte/transition";
  import SignatureInput from "./components/SignatureInput.svelte";
  import ContractTitle from "./components/ContractTitle.svelte";
  import { getDisplayValue } from "./utils/data";
  import ContractSides from "./components/contractSides/ContractSides.svelte";
  import { onMount } from "svelte";
  import ContractWhereas from "./components/ContractWhereas.svelte";

  $: valid = $formDoc.valid;
  $: errors = $formDoc.errors;
  $: currentAddress = "";
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
      const url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=${latitude},${longitude}`;
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
        body: JSON.stringify($formDoc.docData),
        contentType: "application/json",
      });
      if (response.status == 200) {
        $prompt = `<div><p>לקוח נוסף בהצלחה למערכת</p><br><p>תודה<p/></div>`;
        formDoc.reset();
      }
    } catch (e) {
      console.error(e);
    }
  }
  //OLD:
  // async function handleOnSubmit() {
  //   const url = "https://hook.integromat.com/95nczekdzhsagsr4s8fypa1e9p9booly";
  //   const formData = new FormData();
  //   Object.entries($formDoc.docData).forEach(([header, value]) => {
  //     const field = $formDoc.headers[header];
  //     const filesCount = {};
  //     if (field) {
  //       switch (field.type) {
  //         case "file":
  //           value.forEach((fileObj, ind) => {
  //             formData.append(`${header}_${ind}`, fileObj.file);
  //             filesCount[header] = Number(ind) + 1;
  //           });
  //           break;
  //         case "list":
  //           formData.append(header, value.id || "");
  //           break;
  //         default:
  //           formData.append(header, value);
  //       }
  //     } else {
  //       throw `field ${header} not found`;
  //     }
  //   });
  //   formData.append("filesCount", JSON.stringify(filesCount));
  //   // console.log($formDoc.docData);
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       body: formData,
  //       contentType: "multipart/form-data",
  //     });
  //     console.log(response.status, response.statusText);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

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
      size: "priceQuote",
      subText: "להלן: נספח הצעת מחיר",
    },
    3: {
      text: "תנאים מסחריים",
      size: "M",
    },
  };

  const serviceContent = {
    DP: {
      groups: [
        {
          id: "managing",
          text: "ניהול שוטף",
        },
        {
          id: "biz",
          text: "ניהול עסקי וארגוני",
        },
        {
          id: "digital",
          text: "ניהול וביצוע דיגיטל",
        },
      ],
      items: [],
    },
  };

  const wheres = [
    {
      text: `והוסכם כי נותנת השירותים תספק שירות ללקוח כמפורט בנספחים לעיל 
      (להלן: נספח <strong>"הצעת מחיר"</strong> ונספח <strong>"תכולת שירותים"</strong> );
      יצויין כי נספחים אלה הינם חלק בלתי נפרד מהסכם זה;`,
      prefix: "הואיל",
    },
    {
      text: "וברצון הצדדים להתקשר בהסכם התקשרות ומתן שירותים זה;",
    },
  ];

  const subs = [
    {
      index: 1,
      editable: false,
      text: "מועד תחילת ההתקשרות הינו במועד חתימת הסכם התקשרות זה כל עוד לא הוסכם אחרת בין הצדדים. זאת תוך התחייבות של הלקוח לתקופה כפי המצויין בנספח הצעת המחיר.",
    },
    {
      index: 2,
      editable: false,
      text: `משך ההסכם הינו ל#_contractPeriod_# חודשים 
      (קרי, כ#_contractPeriod_# תשלומים חודשיים),
       החל מיום ההתקשרות.
       עם זאת, באם יבחר הלקוח לסיים את  ההתקשרות בחלון היציאה (היה והוגדר כזה בנספח הצעת המחיר), יישא הלקוח בעלות אותם החודשים בלבד.`,
    },
    {
      index: 3,
      editable: false,
      text: `מוסכם על הצדדים כי חרף המוסכם בסעיף &_1_& לעיל (תקופת ההתקשרות), 
      כל אחד מהצדדים יוכל להביא הסכם זה לסיומו בהתראה בכתב לצד הנשגר, שלושים (30) יום לפני חלון היציאה (היה והוגדר כזה) כפי המפורט בנספח הצעת המחיר.
      ההתראה תימסר לכתובת נותנת השירותים או הלקוח, טעמי הביטול יכול ויימסרו לצד הנשגר. 
      `,
    },
    {
      index: 4,
      editable: true,
      text: `מוסכם כי הארכת הסכם זה תיעשה בכתב בהודעה בת שלושים (30) ימי עסקים טרם סיום תקופת הסכם זה, ובחירת חבילת השירות הנדרשת ללקוח.`,
    },
    {
      index: 5,
      editable: true,
      text: `השירותים שיסופקו ע"י נותנת השירות הם כפי שסוכמו טרם הסכם זה <strong>והמפורטים כנספח להסכם זה</strong> ("תכולת השירות"). 
      יחד עם זאת אין נותנת השירותים מתחייבת לתוצאה של שירותיה הואיל וקיימים גורמים שונים המשפיעים על סיכויי ההצלחה לרבות התנהלות והתנהגות הלקוח.`,
    },
    {
      index: 6,
      editable: false,
      text: `מוסכם על הצדדים כי חבילת השירות שנבחרה על ידי הלקוח הנה בעלות ובאמצעות אמצעי התשלום כפי שפורט בהצעת המחיר.`,
    },
    {
      index: 7,
      editable: true,
      text: `מוסכם על הצדדים כי תשלומים לספקים צדדי ג' נדרשים ישולמו על ידי הלקוח והם אינם חלק מהתשלומים שיועברו למשרדנו. ביאור: תשלומים לספקים צדדי ג' הם כלל השירותים שאינם מופיעים בנספח תכולת השירות.
      <br>
      במידה וחבילת השירות כוללת ניהול קמפיינים ללקוח - על הלקוח לספק פרטי כרטיס אשראי לטובת ניהול תקציבי הקמפיינים ככל שיידרש. הלקוח מודע לכך כי במידה ולא ניתן יהיה לחייב את כרטיס האשראי שלו עבור תקציב הפרסום , הדבר עלול לפגוע בקיום הקמפיינים.`,
    },
    {
      index: 8,
      editable: false,
      text: `הלקוח מתחייב לשתף פעולה עם נותנת השירותים ומאשר כי ידוע לו שככל ולא יהא שיתוף פעולה אזי תפגע עבודת נותנת השירותים ופועל יוצא מכך – התמורה שיקבל הלקוח. הלקוח מוותר בזאת על כל טענה שתעלה אצלו כנגד נותנת השירותים בעניין ההתקשרות עם נותנת השירותים.`,
    },
    {
      index: 9,
      editable: true,
      text: `הצדדים מתחייבים התחייבות הדדית אחד לשני לשמור על סודיות הנתונים המתקבלים אצלם במסגרת התקשרות זו ואף שנתיים בסיומה, מוסכם על הצדדים כי הפרה של סעיף זה הנה הפרה יסודית של הסכם זה המזכה את הצד הנפגע בפיצוי כספי מוסכם המוערך יחד על ידי הצדדים בסך סכום ליווי של שלושה חודשים, מבלי הצורך בניהול הליך משפטי.`,
    },
    {
      index: 10,
      editable: true,
      text: `הצדדים מתחייבים התחייבות הדדית אחד לשני לשמור על סודיות הנתונים המתקבלים אצלם במסגרת התקשרות זו ואף שנתיים בסיומה, מוסכם על הצדדים כי הפרה של סעיף זה הנה הפרה יסודית של הסכם זה המזכה את הצד הנפגע בפיצוי כספי מוסכם המוערך יחד על ידי הצדדים בסך סכום ליווי של שלושה חודשים, מבלי הצורך בניהול הליך משפטי.`,
    },
    {
      index: 11,
      editable: true,
      text: "מוסכם כי בכל סכסוך הנוגע להסכם זה תהיה גם בסמכות בתי המשפט בישראל וסמכות השיפוט הבלעדית נתונה לבית המשפט המוסמך בראשון לציון.",
    },
    {
      index: 12,
      editable: false,
      text: "כל שינוי ו/או ביטול של סעיף מסעיפי הסכם זה, ייעשה אך ורק במסמך בכתב אשר יהיה חתום על ידי שני הצדדים.",
    },
    {
      index: 13,
      editable: false,
      text: "כל ההסכמות האמורות בהסכם זה תלויות ושלובות זו בזה.",
    },
    {
      index: 14,
      editable: false,
      text: "הודעה שתישלח על פי כתובות הצדדים במבוא להסכם זה בדואר רשום, תחשב כאילו הגיעה לצד הנשגר ולידיעתו תוך שלושה (3) ימים מעת שיגורה בדואר רשום מבית דואר בישראל ואם נמסרה ביד-בעת מסירתה, ואם שוגרה באימייל - תוך 24 שעות ממועד שיגורה.",
    },
  ];

  const DOC_DATA_PATTERN = /#_([a-zA-Z]+)_#/gm;
  const INDEX_PATTERN = /&_([\d\.]+)_&/gm;
  const replaceDocData = (_, match) =>
    $formDoc.docData[match] ? $formDoc.docData[match] : "____";
  const replaceIndex = (_, match) =>
    subs.find(({ index }) => index == match)?.index || "____";
</script>

<Auth {auth} let:loggedIn let:userDisplayValue>
  {#if $prompt}
    <Prompt />
  {/if}
  <main>
    <div class="top">
      {#if loggedIn}
        <span class="logout" on:click={logout}>התנתק</span>
      {/if}
      <div class="userAvatar">{userDisplayValue}</div>
    </div>
    {#if loggedIn}
      <section transition:fade>
        <h1>טופס הוספת לקוח חדש</h1>
        <p>להוספת לקוח חדש למערכת מונדיי יש למלא אחר הוראות הטופס:</p>
        <form
          class="form"
          on:submit|preventDefault={(e) => e.preventDefault()}
          autocomplete="off"
        >
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
              {`הסכם זה נערך בתאריך${new Date().toDateString()}, בכתובת ${currentAddress}`}
            </p>
          </div>
          <ContractSides
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
          <ContractTitle
            text={appendix[2].text}
            size={appendix[2].size}
            subText={appendix[2].subText}
          />
          <div class="priceQuote">
            <span>חבילת שירות</span>
            <div contenteditable>
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
                  ? getDisplayValue(
                      $formDoc.docData.contractPeriod,
                      "number",
                      {}
                    ) + " חודשים"
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
          </div>
          <ContractTitle
            text={appendix[3].text}
            size={appendix[3].size}
            subText={appendix[3].subText}
          />
          {#each wheres as { text, prefix }, ind}
            <ContractWhereas {text} {prefix} />
          {/each}
          <ol class="subs">
            {#each subs as sub}
              <li class="sub" contenteditable={sub.editable}>
                {@html sub.text
                  .replaceAll(DOC_DATA_PATTERN, replaceDocData)
                  .replaceAll(INDEX_PATTERN, replaceIndex)}
              </li>
            {/each}
          </ol>
          <SignatureInput header="clientSignature" {formDoc} />
          {#if valid}
            <button
              type="button"
              on:click={handleOnSubmit}
              data-disabled={!valid}
            >
              בצע הזמנת עבודה
            </button>
          {/if}
        </div>
      </section>
    {:else}
      <Login />
    {/if}
  </main>
</Auth>

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
  main {
    text-align: center;
    margin: 0 auto;
    display: grid;
    min-height: 100vh;
  }

  h1 {
    color: var(--color-primary);
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 300;
  }
  .logout {
    cursor: pointer;
    padding: 10px;
  }
  .logout:hover {
    background-color: #80808059;
  }
  .top {
    background-color: #333;
    color: #f0f0f0;
    display: grid;
    grid-auto-flow: column;
    height: 80px;
    padding: 5px;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }
  .userAvatar {
    border-radius: 50%;
    border: 1px solid lightgray;
    text-transform: uppercase;
    font-size: 24px;
    padding: 10px;
    justify-self: end;
    align-items: center;
    height: 45px;
    width: 45px;
    user-select: none;
    display: flex;
    justify-content: center;
  }
  .form {
    padding: 5px;
    display: grid;
  }
  .contract {
    display: grid;
    gap: 2rem;
    align-items: center;
    padding: 3rem;
    border: 10px solid #9f00ff12;
    margin-top: 15px;
  }
  ol .sub {
    text-align: justify;
  }
  ol.subs {
    display: grid;
    gap: 5px;
    padding: 0 10vw;
  }
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
