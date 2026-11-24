import React from 'react'

import type { PillarIcon } from '../../content/pillars'
import { getThemeGroups } from '../../data/cms'
import { Card } from '../Card'
import { GlobeIcon, GrowthIcon, ImpactIcon, NetworkIcon } from '../icons'
import { SectionHeading } from '../SectionHeading'

const icons: Record<PillarIcon, React.ReactNode> = {
  globe: <GlobeIcon />,
  impact: <ImpactIcon />,
  growth: <GrowthIcon />,
  network: <NetworkIcon />,
}

/** Our Four Strategic Pillars (guide Section 3): 2×2 cards, navy top borders, gold icons. */
export async function StrategicPillars() {
  const pillars = await getThemeGroups()

  return (
    <section aria-labelledby="pillars-title" className="border-t border-rule bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-28">
        <SectionHeading
          id="pillars-title"
          eyebrow="Strategic Direction"
          title="Advancing Mixed Methods Across Four Core Pillars"
          align="center"
        />
        <ol className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {pillars.map((pillar) => (
            <li key={pillar.number} className="flex">
              <Card
                className="w-full"
                eyebrow={`Pillar ${pillar.number}`}
                title={pillar.title}
                icon={icons[pillar.icon]}
              >
                <p>{pillar.summary}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
