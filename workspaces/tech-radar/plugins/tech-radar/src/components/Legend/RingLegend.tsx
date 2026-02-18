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
import type { Quadrant, Ring, RingId } from '../../types';

import content from '../content.json';
import { BRIGHT_RING_STYLE } from '../ringColors';
import { Radar } from '../RadarPlot/Radar';
import { cn } from '../../util/cn';

type Props = Readonly<{
  highlighted: RingId;
  quadrants: Quadrant[];
  rings: Ring[];
}>;

export const RingLegend = (props: Props) => {
  const { highlighted, quadrants, rings } = props;
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
        const textColor = BRIGHT_RING_STYLE.text;
        const isHighlighted = highlighted === ringId;

        return (
          <div
            className={cn(
              'flex items-start gap-4 p-2',
              isHighlighted
                ? 'border-primary/40 bg-muted/70 shadow-sm'
                : 'border-border bg-card hover:bg-muted/40',
            )}
            key={ringId}
          >
            <div className="mt-0.5 basis-[10%] border border-gray-300 bg-card p-2">
              <Radar
                highlightRing={ringId}
                isInLegend
                quadrants={quadrants}
                rings={rings}
              />
            </div>

            <div className="flex-1 space-y-0.5">
              <h3
                className={cn(
                  'text-lg font-semibold capitalize tracking-tight',
                  textColor[ringId],
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
