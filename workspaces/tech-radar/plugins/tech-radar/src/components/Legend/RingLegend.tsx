/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { TechRadarLoaderResponse } from '@backstage-community/plugin-tech-radar-common';
import { RingId } from '../types.ts';
import { cn } from '../../util/cn.ts';
import { BRIGHT_RING_STYLE } from '../ringColors.ts';
import { Radar } from '../RadarPlot/Radar.tsx';
import content from './../content.json';

type Props = Readonly<{
  highlighted: RingId;
  radarData: TechRadarLoaderResponse;
}>;

export const RingLegend = (props: Props) => {
  const { highlighted } = props;
  const orderedContent = [...content];

  if (highlighted) {
    const highlightIndex = orderedContent.findIndex(
      c => c.name === highlighted,
    );
    if (highlightIndex !== -1) {
      const [highlightItem] = orderedContent.splice(highlightIndex, 1);
      orderedContent.unshift(highlightItem);
    }
  }

  return (
    <div className={cn('flex flex-col gap-2')}>
      {orderedContent.map(({ name, text }) => {
        const ringId = name as RingId;
        const color = BRIGHT_RING_STYLE[ringId];
        const isHighlighted = highlighted === ringId;

        return (
          <div
            className={cn(
              'flex items-start gap-4 p-4',
              isHighlighted
                ? 'border-primary/40 bg-muted/70 shadow-sm'
                : 'border-border bg-card hover:bg-muted/40',
            )}
            key={ringId}
          >
            <div className="mt-0.5 basis-[13%] border border-gray-300 bg-card p-2">
              <Radar
                highlightRing={ringId}
                isInLegend
                radarData={props.radarData}
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <h3
                className={cn(
                  'text-lg font-semibold capitalize tracking-tight',
                  `text-${color}`,
                )}
              >
                {name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
