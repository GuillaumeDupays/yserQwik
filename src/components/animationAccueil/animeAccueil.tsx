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
      orbitRadius: number
      positionAngle: number
      rotationSpeedMultiplier: number
      cx: number
      cy: number
      r: number
   }

   const storePlanets = useStore<Planet[]>([
      {
         planetId: 'mercury',
         orbitRadius: 13,
         positionAngle: 0,
         cx: 50,
         cy: 50,
         r: 2,
         rotationSpeedMultiplier: 0.00008,
      },
      {
         planetId: 'venus',
         orbitRadius: 10,
         positionAngle: Math.PI / 5,
         cx: 50,
         cy: 50,
         r: 3,
         rotationSpeedMultiplier: 0.000085,
      },
      {
         planetId: 'earth',
         orbitRadius: 14,
         positionAngle: (2 * Math.PI) / 15,
         cx: 50,
         cy: 50,
         r: 4,
         rotationSpeedMultiplier: 0.00007,
      },
      {
         planetId: 'mars',
         orbitRadius: 12,
         positionAngle: Math.PI,
         cx: 50,
         cy: 50,
         r: 3.5,
         rotationSpeedMultiplier: 0.000095,
      },
      {
         planetId: 'pateye',
         orbitRadius: 15,
         positionAngle: 0,
         cx: 50,
         cy: 50,
         r: 2,
         rotationSpeedMultiplier: 0.0001,
      },
      {
         planetId: 'moon',
         orbitRadius: 6,
         positionAngle: Math.PI / 9,
         cx: 50,
         cy: 50,
         r: 3,
         rotationSpeedMultiplier: 0.000085,
      },
      {
         planetId: 'substantia',
         orbitRadius: 5,
         positionAngle: (2 * Math.PI) / 12,
         cx: 50,
         cy: 50,
         r: 4,
         rotationSpeedMultiplier: 0.00007,
      },
      {
         planetId: 'virginis',
         orbitRadius: 16,
         positionAngle: Math.PI,
         cx: 50,
         cy: 50,
         r: 5,
         rotationSpeedMultiplier: 0.000095,
      },
   ])

   const useStopAnimation = useSignal(false)
   const nav = useNavigate()

   const updatePlanetPos = $((planet: Planet) => {
      if (planet && !useStopAnimation.value) {
         const centerX = 50
         const centerY = 50

         const animatePlanet = () => {
            if (!useStopAnimation.value) {
               const currentTime = performance.now()
               const planetX =
                  centerX +
                  planet.orbitRadius *
                     Math.cos(
                        planet.positionAngle +
                           planet.rotationSpeedMultiplier * currentTime
                     )
               const planetY =
                  centerY +
                  planet.orbitRadius *
                     Math.sin(
                        planet.positionAngle +
                           planet.rotationSpeedMultiplier * currentTime
                     )

               storeLine.start.x = 0
               storeLine.start.y = 0
               storeLine.end.x = planetX
               storeLine.end.y = planetY
               planet.cx = planetX
               planet.cy = planetY

               requestAnimationFrame(animatePlanet)
            }
         }

         animatePlanet()
      }
   })

   const toggleAnimation = $(() => {
      useStopAnimation.value = !useStopAnimation.value
      if (!useStopAnimation.value) {
         storePlanets.forEach((e) => {
            updatePlanetPos(e)
         })
      }
   })

   useVisibleTask$(() => {
      if (!useStopAnimation.value) {
         storePlanets.forEach((e) => {
            updatePlanetPos(e)
         })
      }
   })

   return (
      <div class="container">
         <button onClick$={() => toggleAnimation()}>
            {useStopAnimation.value ? 'Démarrer' : 'Arrêter'}
         </button>
         <svg width="100%" height="90vh">
            <circle cx="50vw" cy="50vh" r="35" class="sun" />
            {storePlanets.map(({ planetId, cx, cy, r }) => (
               <>
                  <circle
                     key={planetId}
                     id={planetId}
                     class="planet"
                     cx={`${cx}vw`}
                     cy={`${cy}vh`}
                     r={r}
                  />
                  <line
                     x1={`${storeLine.start.x}vw`}
                     y1={`${storeLine.start.y}vh`}
                     x2={`${cx}vw`}
                     y2={`${cy}vh`}
                     stroke="black"
                     stroke-width="1"
                     stroke-dasharray=" 1, 6"
                  />
               </>
            ))}
         </svg>
      </div>
   )
})
