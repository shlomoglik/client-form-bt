<script>
    import { Link, useLocation } from "svelte-navigator";
    const location = useLocation();
</script>

<div>
    <span> לקוח נוסף בהצלחה למערכת </span>
    <span class="link">
        <Link to="/">להוספת לקוח נוסף</Link>
    </span>
    <span class="link">
        <a
            target="_blan"
            href={`https://b-time.monday.com/boards/457661062/pulses/${
                $location.state.newClientID || ""
            }`}>לצפייה בפרטי הלקוח</a
        >
    </span>
</div>

<style>
    div {
        display: grid;
        align-items: center;
        align-self: center;
        gap: 1rem;
    }
    .link {
        color: cornflowerblue;
        transition: text-decoration 0.2s ease-in-out;
    }
    .link:hover {
        text-decoration: underline;
    }
</style>
