import {
   component$,
   useVisibleTask$,
   useStylesScoped$,
   $,
   useStore,
   useSignal,
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
      rotationSpeed: number
      cx: number
      cy: number
      r: number
   }
   const storePlanets = useStore<Planet[]>([])

   const definePlanets = $(() => {
      let planets: Planet[] = [
         {
            planetId: 'planet',
            orbitRadius: 100,
            rotationSpeed: 0.003,
            cx: 100,
            cy: 5,
            r: 12,
         },
         {
            planetId: 'moon',
            orbitRadius: 19,
            rotationSpeed: 0.001,
            cx: 100,
            cy: 5,
            r: 12,
         },
         {
            planetId: 'guije',
            orbitRadius: 109,
            rotationSpeed: 0.004,
            cx: 100,
            cy: 5,
            r: 12,
         },
      ]
      planets.map((e) => {
         storePlanets.push(e)
      })
      console.log('planets', storePlanets)
   })

   const planetsById = $((planet: string) => {
      const goodPlanet = storePlanets.find((e) => e.planetId === planet)
      console.log('planete GOOD', goodPlanet)
      return goodPlanet
   })

   const useStopAnimation = useSignal(false)
   const rotationAngle = useSignal(0)
   const nav = useNavigate()

   const updatePlanetPos = $(async (planet: HTMLElement) => {
      const goodPlanet = await planetsById(planet!.getAttribute('id')!)

      if (goodPlanet && !useStopAnimation.value) {
         const centerX = 150
         const centerY = 150
         //  const orbitRadius = 100
         //  const rotationSpeed = 0.002

         const animatePlanet = () => {
            if (!useStopAnimation.value) {
               const planetX =
                  centerX +
                  goodPlanet.orbitRadius * Math.cos(rotationAngle.value)
               const planetY =
                  centerY +
                  goodPlanet.orbitRadius * Math.sin(rotationAngle.value)

               storeLine.start.x = 100
               storeLine.start.y = 30
               storeLine.end.x = planetX
               storeLine.end.y = planetY

               rotationAngle.value += goodPlanet.rotationSpeed

               requestAnimationFrame(animatePlanet)
            }
         }

         animatePlanet()
      }
   })

   const toggleAnimation = $(() => {
      useStopAnimation.value = !useStopAnimation.value
      const planet = document.getElementById('planet')

      if (!useStopAnimation.value && planet) {
         updatePlanetPos(planet)
      }
   })

   useVisibleTask$(() => {
      definePlanets()
      console.log('store planete', storePlanets)

      const planet = document.getElementById('planet')
      if (!useStopAnimation.value && planet) {
         updatePlanetPos(planet)
      }
   })

   return (
      <div class="container">
         <button onClick$={() => toggleAnimation()}>
            {useStopAnimation.value ? 'Démarrer' : 'Arrêter'}
         </button>
         <svg width="300" height="300">
            <circle cx="150" cy="150" r="59" />
            <line
               x1={storeLine.start.x}
               y1={storeLine.start.y}
               x2={storeLine.end.x}
               y2={storeLine.end.y}
               stroke="black"
               stroke-width="1"
            />
            <circle
               id="planet"
               class="planet"
               cx={storeLine.end.x}
               cy={storeLine.end.y}
               r="7"
            />
            {storePlanets &&
               storePlanets.map(({ planetId, cx, cy, r }) => (
                  <circle id={planetId} class="planet" cx={cx} cy={cy} r={r} />
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
