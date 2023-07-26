import { component$, useResource$, useStore, useTask$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import Projets from "../../components/projets/projets";
import BlogPost from "~/models/blogposts";
import { Drawing } from "~/models/drawing.model";

   export const draw = routeLoader$(async () => {
    const res = await fetch('http://localhost:1337/api/dessins')   
    const data = await res.json()
    console.log('starwars data', data);
    
    return data.data
  })

  export const blogposts = routeLoader$(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    const allPosts = await res.json()
    console.log('allPosts', allPosts);
    
    return allPosts as BlogPost[]
  })

   export const starwars = routeLoader$(async () => {
    const res = await fetch('https://swapi.dev/api/people/?')   
    const data = await res.json()
    console.log('starwars data', data);
    
    return data
  })

export default component$(() => {
  // retourne fetch failed au reload de la route /projets
  //
  const drawingsRessource = useResource$<Drawing[]>(async () => {
    const results = await fetch('http://localhost:1337/api/dessins');
    const allPosts = await results.json()
    console.log('allPosts', allPosts);
    
    return allPosts.data as Drawing[]
  })



  const drawSignal = draw()
  

  const blogPostSignal = blogposts();

  const starwarsSignal = starwars()
  return (
    <>
      <h1>fetch avec useRessource : DESSINS</h1>
      <div>{drawingsRessource.value.then((e) => e.map((d) => <p>{d.id}</p>))}
      </div>

      <h3>avec routeLoader : DESSINS</h3>
      <div>{JSON.stringify(drawSignal.value, null, 2)}</div>
      
      <h1>BLOGPOSTS</h1>
      
      <div>{JSON.stringify(blogPostSignal.value, null, 2)}</div>
      
      <h1>STAR WARS</h1>
       
      <div>{JSON.stringify(starwarsSignal.value, null, 2)}</div>
      
      <Projets></Projets>
    </>
  );
});

export const head: DocumentHead = {
  title: "Projets",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
