'use client'

import type { CursorState } from './FakeCursor'
import { Scene1Dashboard } from './scenes/Scene1Dashboard'
import { Scene2Upload }    from './scenes/Scene2Upload'
import { Scene3Extraction } from './scenes/Scene3Extraction'
import { Scene5Submit }    from './scenes/Scene5Submit'
import { Scene6Insights }  from './scenes/Scene6Insights'

interface DemoSceneProps {
  scene: number
  elapsed: number
  onCursorUpdate: (state: CursorState) => void
}

export function DemoScene({ scene, elapsed, onCursorUpdate }: DemoSceneProps) {
  const props = { elapsed, onCursorUpdate }
  switch (scene) {
    case 0: return <Scene1Dashboard key={scene} {...props} />
    case 1: return <Scene2Upload    key={scene} {...props} />
    case 2: return <Scene3Extraction key={scene} {...props} />
    case 3: return <Scene5Submit    key={scene} {...props} />
    case 4: return <Scene6Insights  key={scene} {...props} />
    default: return null
  }
}
