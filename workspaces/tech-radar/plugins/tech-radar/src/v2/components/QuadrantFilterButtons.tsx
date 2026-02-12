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
import type { RadarQuadrant } from '@backstage-community/plugin-tech-radar-common';

export const QuadrantFilterButtons = ({
  className,
  onSelect,
  quadrants,
  selected,
}: {
  className?: string;
  onSelect: (q: RadarQuadrant) => void;
  quadrants: RadarQuadrant[];
  selected: string | undefined;
}) => {
  const quadrantClass = (item: RadarQuadrant) =>
    `cursor-pointer transition-all ${
      selected === item.id ? 'fill-primary/40 ' : ''
    }`;

  return (
    <svg
      aria-label="Radar quadrant filter"
      className={className}
      role="group"
      viewBox="0 0 400 240"
    >
      {/* Background */}
      <rect
        fill="#d4d9e3"
        height="220"
        rx="4"
        stroke="#b6bdd0"
        strokeWidth="6"
        width="380"
        x="10"
        y="10"
      />

      {/* Cross */}
      <line
        stroke="white"
        strokeWidth="6"
        x1="200"
        x2="200"
        y1="10"
        y2="230"
        z={10}
      />
      <line stroke="white" strokeWidth="6" x1="10" x2="390" y1="120" y2="120" />

      {/* Concentric circles */}
      {[30, 50, 70, 90].map(r => (
        <circle
          cx="200"
          cy="120"
          fill="none"
          key={r}
          r={r}
          stroke="white"
          strokeWidth="6"
        />
      ))}

      {/* Top Right */}
      <path
        className={quadrantClass(quadrants[0])}
        d="M202 10 H390 V118 H202 Z"
        fill="transparent"
        onClick={() => onSelect(quadrants[0])}
      />

      {/* Top Left */}
      <path
        className={quadrantClass(quadrants[1])}
        d="M10 10 H198 V118 H10 Z"
        fill="transparent"
        onClick={() => onSelect(quadrants[1])}
      />

      {/* Bottom Left */}
      <path
        className={quadrantClass(quadrants[2])}
        d="M10 122 H198 V230 H10 Z"
        fill="transparent"
        onClick={() => onSelect(quadrants[2])}
      />

      {/* Bottom Right */}
      <path
        className={quadrantClass(quadrants[3])}
        d="M202 122 H390 V230 H202 Z"
        fill="transparent"
        onClick={() => onSelect(quadrants[3])}
      />
    </svg>
  );
};
