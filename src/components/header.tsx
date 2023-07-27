import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {


  return (
    <>
      <header>
        <div>
          <ul>
            <Link href='/projets' reload>PROJETS</Link>
          </ul>
        </div>
      </header>
    </>
  );
});