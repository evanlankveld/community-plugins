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
import { forwardRef, HTMLAttributes, useContext } from 'react';

import type { Blip } from '../../types';
import { BLIP_RADIUS } from '../RadarPlot/radarPlotUtils';
import { RadarFilterContext } from '../RadarFilterContext';
import { BRIGHT_RING_STYLE } from '../ringColors';
import { cn } from '../../util/cn';

type RadarBlipProps = Readonly<{
  blip: Blip;
  muted?: boolean;
  selected?: boolean;
}> &
  HTMLAttributes<SVGElement>;

const makeBlipSvg = (
  { moved, ring: { id }, visible }: Blip,
  {
    muted,
    selected,
  }: {
    muted?: boolean;
    selected?: boolean;
  },
) => {
  const sharedClasses = cn(
    'cursor-pointer transition-opacity duration-200',
    !visible && 'opacity-10',
    visible && muted && !selected && 'opacity-30',
    visible && (!muted || selected) && 'opacity-100',
    BRIGHT_RING_STYLE.fill[id],
  );

  if (moved && moved > 0) {
    return (
      <path className={sharedClasses} d="M -11,5 11,5 0,-13 z" /> // triangle pointing up
    );
  }
  if (moved && moved < 0) {
    return (
      <path className={sharedClasses} d="M -11,-5 11,-5 0,13 z" /> // triangle pointing down
    );
  }

  return <circle className={sharedClasses} r={BLIP_RADIUS - 1} />;
};

export const RadarBlip = forwardRef<SVGGElement, RadarBlipProps>(
  (props, ref) => {
    const { blip, muted, selected, ...svgProps } = props;

    const { focusedQuadrant } = useContext(RadarFilterContext);
    const scale = focusedQuadrant ? 0.6 : 1;

    const blipSvg = makeBlipSvg(blip, {
      muted,
      selected,
    });

    return (
      <g
        data-testid="radar-entry"
        ref={ref}
        transform={`translate(${blip.x}, ${blip.y}) scale(${scale})`}
        {...svgProps}
      >
        {blipSvg}
      </g>
    );
  },
);

RadarBlip.displayName = 'RadarBlip';
