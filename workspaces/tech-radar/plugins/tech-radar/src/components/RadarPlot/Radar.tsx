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
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { useId, useMemo, useState } from 'react';

import type { TechRadarLoaderResponse } from '@backstage-community/plugin-tech-radar-common';

import { BRIGHT_RING_STYLE } from '../ringColors';
import type { Blip, Entry } from '../../util/types';
import { RadarBlip } from '../RadarBlip/RadarBlip';
import { RadarTooltip } from '../RadarTooltip/RadarTooltip';
import type { RingId } from '../types';

import {
  describeArc,
  describeArcTextLine,
  UPPERCASE_TEXT_BASELINE_COMPENSATION,
} from './radarArcUril';
import {
  adjustEntries,
  adjustQuadrants,
  adjustRings,
  QUADRANT_GAP,
  RADAR_DIAMETER,
  RADAR_PADDING,
} from './radarPlotUtils';
import { cn } from '../../util/cn';

type RadarPlotProps = Readonly<{
  entries: Entry[];
  focusQuadrant?: string;
  onBlipClick?: (blip: Blip) => void;
  radarData: TechRadarLoaderResponse;
  selectedBlipId?: string;
}>;

type RadarProps = HTMLAttributes<SVGSVGElement> &
  Readonly<{
    focusQuadrant?: string;
    highlightRing?: string;
    isInLegend?: boolean;
    radarData: TechRadarLoaderResponse;
  }>;

const maxRadius = RADAR_DIAMETER / 2;
const viewBoxSize = RADAR_DIAMETER + RADAR_PADDING;
const centerX = 0;
const centerY = 0;

export const Radar = ({
  children,
  className,
  focusQuadrant,
  highlightRing,
  isInLegend,
  radarData,
  ...svgProps
}: PropsWithChildren<RadarProps>) => {
  const quadrants = adjustQuadrants(radarData.quadrants);
  const ringsData = adjustRings(
    radarData.rings.map(r => ({ id: r.id, color: r.color, name: r.name })),
    maxRadius,
  );

  const focusedQuadrant = focusQuadrant
    ? quadrants.find(q => q.id === focusQuadrant)
    : undefined;

  const halfViewBox = viewBoxSize / 2;
  const focusedSize = RADAR_DIAMETER / 2 + QUADRANT_GAP * 2;
  const adjustedViewBoxSize = focusedQuadrant ? focusedSize : viewBoxSize;

  const viewBoxMinX = focusedQuadrant
    ? Math.min(focusedQuadrant.offsetX, 0) * focusedSize
    : -halfViewBox;

  const viewBoxMinY = focusedQuadrant
    ? Math.min(focusedQuadrant.offsetY, 0) * focusedSize +
      -focusedQuadrant.offsetY * (QUADRANT_GAP - 5)
    : -halfViewBox;

  return (
    <svg
      className={cn('h-auto w-full select-none font-sans', className)}
      viewBox={`${viewBoxMinX} ${viewBoxMinY} ${adjustedViewBoxSize} ${adjustedViewBoxSize}`}
      {...svgProps}
    >
      {/* Render Quadrants */}
      {quadrants
        .filter(q => !focusQuadrant || q.id === focusQuadrant)
        .map((quadrant, qIndex) => {
          return (
            <g
              className="transition-opacity duration-300"
              key={qIndex}
              transform={`translate(${quadrant.offsetX * QUADRANT_GAP}, ${
                quadrant.offsetY * QUADRANT_GAP
              })`}
            >
              {/* Rings */}
              {ringsData.map((ring, rIndex) => {
                const pathD = describeArc({
                  endAngle: quadrant.radialMin,
                  innerRadius: ring.innerRadius,
                  outerRadius: ring.outerRadius,
                  startAngle: quadrant.radialMax,
                });

                const highlighted = highlightRing === ring.id;
                const highlightColor = BRIGHT_RING_STYLE[ring.id as RingId];

                const strokeSlate = isInLegend
                  ? 'stroke-slate-400'
                  : 'stroke-slate-200';
                const strokeWidth = isInLegend ? '8' : '1';

                return (
                  <path
                    className={cn(
                      'fill-card transition-colors',
                      strokeSlate,
                      highlighted ? `fill-${highlightColor}` : '',
                      !highlightRing &&
                        'cursor-pointer hover:fill-blue-100 hover:stroke-blue-300',
                    )}
                    d={pathD}
                    key={rIndex}
                    strokeWidth={strokeWidth}
                  />
                );
              })}
            </g>
          );
        })}
      {children}
    </svg>
  );
};

export const RadarBlipsAndLabels = ({
  entries,
  focusQuadrant,
  onBlipClick,
  radarData,
  selectedBlipId,
}: RadarPlotProps) => {
  const id = useId();

  const quadrants = adjustQuadrants(radarData.quadrants);
  const ringsData = adjustRings(
    radarData.rings.map(r => ({ id: r.id, color: r.color, name: r.name })),
    maxRadius,
  );

  const blips = useMemo(
    () =>
      adjustEntries({
        activeEntry: undefined,
        entries,
        quadrants,
        radius: maxRadius,
        rings: ringsData,
      }),
    [entries, quadrants, ringsData],
  );
  const [hoveredEntry, setHoveredEntry] = useState<Blip | undefined>(undefined);
  const focusedQuadrant = focusQuadrant
    ? quadrants.find(q => q.id === focusQuadrant)
    : undefined;

  const firstLabelXOffset = focusedQuadrant?.offsetX ?? 0;

  const selectedBlip = useMemo(
    () => blips.find(b => b.id === selectedBlipId),
    [blips, selectedBlipId],
  );

  return (
    <>
      <defs>
        {quadrants.map((q, i) => {
          const isBottom = i === 0 || i === 1 || i === 4;
          const pathD = describeArcTextLine({
            endAngle: q.radialMin,
            radius: maxRadius * 1.1,
            reverse: isBottom,
            startAngle: q.radialMax,
          });
          return (
            <path
              d={pathD}
              fill="none"
              id={`${id}-label-path-${i}`}
              key={`label-path-${i}`}
            />
          );
        })}
      </defs>
      {
        /* Quadrant Label on Rim */
        quadrants
          .filter(q => !focusQuadrant || q.id === focusQuadrant)
          .map((quadrant, qIndex) => (
            <text
              className="fill-slate-600 font-light uppercase tracking-[0.4em]"
              key={quadrant.name}
            >
              <textPath
                dominantBaseline="central"
                href={`#${id}-label-path-${qIndex}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {quadrant.name}
              </textPath>
            </text>
          ))
      }
      {blips
        .filter(b => !focusQuadrant || b.quadrant.id === focusQuadrant)
        .map(blip => (
          <RadarBlip
            blip={blip}
            key={blip.id}
            muted={!!selectedBlipId}
            onClick={onBlipClick}
            onMouseEnter={setHoveredEntry}
            onMouseLeave={() => setHoveredEntry(undefined)}
            selected={selectedBlipId === blip.id}
          />
        ))}
      {/* Ring Labels (Horizontal Axis) */}
      {ringsData.map((ring, i) => {
        const r = (ring.innerRadius + ring.outerRadius) / 2;

        if (i === 0) {
          return (
            <text
              className="pointer-events-none fill-slate-600 align-middle text-[12px] uppercase"
              dominantBaseline="central"
              key={`ring-label-${i}`}
              textAnchor="middle"
              x={centerX + firstLabelXOffset * r}
              y={centerY + UPPERCASE_TEXT_BASELINE_COMPENSATION}
            >
              {ring.name}
            </text>
          );
        }

        return (
          <g key={`ring-labels-${i}`}>
            {/* Right Axis Label */}
            <text
              className="pointer-events-none fill-slate-600 text-[12px] uppercase"
              dominantBaseline="middle"
              textAnchor="middle"
              x={centerX + r + QUADRANT_GAP}
              y={centerY + UPPERCASE_TEXT_BASELINE_COMPENSATION}
            >
              {ring.name}
            </text>
            {/* Left Axis Label */}
            <text
              className="pointer-events-none fill-slate-600 text-[12px] uppercase"
              dominantBaseline="middle"
              textAnchor="middle"
              x={centerX - (r + QUADRANT_GAP)}
              y={centerY + UPPERCASE_TEXT_BASELINE_COMPENSATION}
            >
              {ring.name}
            </text>
          </g>
        );
      })}
      <RadarTooltip
        text={hoveredEntry?.title || selectedBlip?.title || ''}
        visible={!!hoveredEntry || !!selectedBlip}
        x={hoveredEntry?.x ?? selectedBlip?.x ?? 0}
        y={hoveredEntry?.y ?? selectedBlip?.y ?? 0}
      />
    </>
  );
};
