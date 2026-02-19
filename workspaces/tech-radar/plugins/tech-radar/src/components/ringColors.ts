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
import type { RingId } from '../types';

type RingToClass = Record<RingId, string>;

export const ACCORDION_BG_COLOR = {
  adopt: 'bg-success',
  assess: 'bg-warning',
  hold: 'bg-error',
  leave: 'bg-muted',
  trial: 'bg-info',
} as const satisfies RingToClass;

export const BRIGHT_RING_STYLE = {
  fill: {
    adopt: 'fill-success-foreground',
    assess: 'fill-warning-foreground',
    hold: 'fill-error-foreground',
    leave: 'fill-muted-foreground/50',
    trial: 'fill-info-foreground',
  },
  text: {
    adopt: 'text-success-foreground',
    assess: 'text-warning-foreground',
    hold: 'text-error-foreground',
    leave: 'text-muted-foreground',
    trial: 'text-info-foreground',
  },
} as const satisfies { fill: RingToClass; text: RingToClass };
