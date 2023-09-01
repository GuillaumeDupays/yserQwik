import {
   component$,
   useStore,
   useStylesScoped$,
   useVisibleTask$,
   $,
} from '@builder.io/qwik'
import loaderStyle from './loader-accueil.scss?inline'

export default component$(() => {
   useStylesScoped$(loaderStyle)
   const storeLine = useStore({
      x1: 0,
      y2: 0,
      y1: 0,
      x2: 0,
   })
   interface Coordinates {
      x: number
      y: number
   }

   useVisibleTask$(() => {
      const planet1 = document.getElementById('planet1')
      const connectingLine = document.getElementById('connectingLine')

      if (planet1 && connectingLine) {
         const animateLine = () => {
            const planet1BoundingBox = planet1.getBoundingClientRect()
            const svgBoundingBox = connectingLine!
               .closest('svg')!
               .getBoundingClientRect()

            const planet1X = planet1BoundingBox.x + planet1BoundingBox.width / 2

            const planet1Y =
               planet1BoundingBox.y + planet1BoundingBox.height / 2

            connectingLine.setAttribute(
               'x2',
               (planet1X - svgBoundingBox.x).toString()
            )
            connectingLine.setAttribute(
               'y2',
               (planet1Y - svgBoundingBox.y).toString()
            )

            requestAnimationFrame(animateLine)
         }

         animateLine()
      }
   })

   return (
      <div class="container">
         {/* <input type="text" placeholder="Champ texte" /> */}

         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="300"
            height="300"
            viewBox="0 0 800 800"
         >
            {/* x1 : Coordonnée x du point de départ de la ligne.
         y1 : Coordonnée y du point de départ de la ligne.
         x2 : Coordonnée x du point d'arrivée de la ligne.
         y2 : Coordonnée y du point d'arrivée de la ligne. */}

            <circle class="sun" cx="400" cy="400" r="50" />
            <circle
               id="planet1"
               class="planet planet1"
               cx="550"
               cy="400"
               r="7"
            />
            <line
               id="connectingLine"
               x1="0"
               y1="0"
               x2="0"
               y2="0"
               stroke="blue"
               stroke-width="2"
            />

            <circle class="planet planet2" cx="480" cy="400" r="5" />
            <circle class="planet planet3" cx="600" cy="400" r="3" />
            <circle class="planet planet4" cx="520" cy="400" r="2" />
            <g class="stars">
               <circle cx="0" cy="100" r="4" />
               <circle cx="200" cy="300" r="1" />
               <circle cx="600" cy="150" r="1" />
               <circle cx="100" cy="100" r="3" />
               <circle cx="200" cy="300" r="1" />
               <circle cx="600" cy="150" r="2" />
               {/* <!-- Ajoutez plus d'étoiles ici --> */}
            </g>
         </svg>
      </div>
   )
})
