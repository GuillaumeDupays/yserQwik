import {
   component$,
   useVisibleTask$,
   useStylesScoped$,
   $,
   useStore,
   useSignal,
   useTask$,
} from '@builder.io/qwik'

import animeStyle from './animeAccueil.scss?inline'
import { useNavigate } from '@builder.io/qwik-city'

export default component$(() => {
   useStylesScoped$(animeStyle)

   const storeLine = useStore({
      start: {
         x: 0,
         y: 0,
      },
      end: {
         x: 0,
         y: 0,
      },
   })

   type Planet = {
      planetId: string
      orbitRadius: number // Distance par rapport au soleil
      rotationSpeed: number // Vitesse de rotation autour du soleil
      cx: number
      cy: number
      r: number
   }

   const storePlanets = useStore<Planet[]>([
      {
         planetId: 'mercury',
         orbitRadius: 60,
         rotationSpeed: 0.02,
         cx: 150,
         cy: 150,
         r: 2,
      },
      {
         planetId: 'venus',
         orbitRadius: 90,
         rotationSpeed: 0.015,
         cx: 150,
         cy: 150,
         r: 3,
      },
      {
         planetId: 'earth',
         orbitRadius: 120,
         rotationSpeed: 0.01,
         cx: 150,
         cy: 150,
         r: 4,
      },
      {
         planetId: 'mars',
         orbitRadius: 160,
         rotationSpeed: 0.008,
         cx: 150,
         cy: 150,
         r: 3.5,
      },
      // Ajoutez d'autres planètes ici
   ])

   const useStopAnimation = useSignal(false)
   const rotationAngle = useSignal(0)
   const nav = useNavigate()

   const updatePlanetPos = $((planet: Planet) => {
      if (planet && !useStopAnimation.value) {
         const centerX = 150
         const centerY = 150
         const planetX =
            centerX + planet.orbitRadius * Math.cos(rotationAngle.value)
         const planetY =
            centerY + planet.orbitRadius * Math.sin(rotationAngle.value)

         storeLine.start.x = 150 // Position du soleil (centre)
         storeLine.start.y = 150 // Position du soleil (centre)
         storeLine.end.x = planetX
         storeLine.end.y = planetY
         planet.cx = planetX
         planet.cy = planetY

         rotationAngle.value += planet.rotationSpeed

         requestAnimationFrame(() => updatePlanetPos(planet))
      }
   })

   const toggleAnimation = $(() => {
      useStopAnimation.value = !useStopAnimation.value

      if (!useStopAnimation.value) {
         storePlanets.forEach((planet) => {
            updatePlanetPos(planet)
         })
      }
   })

   useVisibleTask$(() => {
      console.log('store planete', storePlanets)

      if (!useStopAnimation.value) {
         storePlanets.forEach((planet) => {
            updatePlanetPos(planet)
         })
      }
   })

   return (
      <div class="container">
         <button onClick$={() => toggleAnimation()}>
            {useStopAnimation.value ? 'Démarrer' : 'Arrêter'}
         </button>
         <svg width="300" height="300">
            <circle cx="150" cy="150" r="5" fill="yellow" /> {/* Soleil */}
            <line
               x1={storeLine.start.x}
               y1={storeLine.start.y}
               x2={storeLine.end.x}
               y2={storeLine.end.y}
               stroke="black"
               stroke-width="1"
            />
            {storePlanets.map(({ planetId, cx, cy, r }) => (
               <circle
                  key={planetId}
                  id={planetId}
                  class="planet"
                  cx={cx}
                  cy={cy}
                  r={r}
               />
            ))}
            <rect
               x={storeLine.start.x - 30}
               y={storeLine.start.y - 20}
               rx="10"
               ry="10"
               width="60"
               height="40"
               fill="blue"
            />
            <text
               id="text"
               class="text"
               x={storeLine.start.x}
               y={storeLine.start.y}
               fill="white"
               text-anchor="middle"
               alignment-baseline="middle"
               onClick$={() => nav('/login')}
            >
               Accueil
            </text>
         </svg>
      </div>
   )
})
