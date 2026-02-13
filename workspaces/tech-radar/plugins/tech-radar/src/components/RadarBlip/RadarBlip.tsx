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
import type { Blip } from '../../util/types';
import { BLIP_RADIUS } from '../RadarPlot/radarPlotUtils';
import { cn } from '../../util/cn';

type RadarBlipProps = Readonly<{
  blip: Blip;
  muted?: boolean;
  onClick?: (blip: Blip) => void;
  onMouseEnter?: (blip: Blip) => void;
  onMouseLeave?: (blip: Blip) => void;
  selected?: boolean;
}>;

const makeBlipSvg = (
  { color, moved, visible }: Blip,
  selected?: boolean,
  muted?: boolean,
) => {
  const sharedClasses = cn(
    'cursor-pointer transition-opacity duration-200',
    !visible && 'opacity-10',
    visible && muted && !selected && 'opacity-30',
    visible && (!muted || selected) && 'opacity-100',
  );
  const style = { fill: color };

  if (moved && moved > 0) {
    return (
      <path className={sharedClasses} d="M -11,5 11,5 0,-13 z" style={style} /> // triangle pointing up
    );
  }
  if (moved && moved < 0) {
    return (
      <path className={sharedClasses} d="M -11,-5 11,-5 0,13 z" style={style} /> // triangle pointing down
    );
  }

  return <circle className={sharedClasses} r={BLIP_RADIUS - 1} style={style} />;
};

export const RadarBlip = (props: RadarBlipProps) => {
  const { blip, muted, onClick, onMouseEnter, onMouseLeave, selected } = props;

  const blipSvg = makeBlipSvg(blip, selected, muted);

  return (
    <g
      data-testid="radar-entry"
      onClick={e => {
        e.stopPropagation();
        onClick?.(blip);
      }}
      onMouseEnter={() => onMouseEnter?.(blip)}
      onMouseLeave={() => onMouseLeave?.(blip)}
      transform={`translate(${blip.x}, ${blip.y})`}
    >
      {blipSvg}
    </g>
  );
};
