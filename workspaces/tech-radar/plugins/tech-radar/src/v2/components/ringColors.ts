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
import type { RingId } from './types';

export const RING_STYLE = {
  adopt: 'bg-success',
  assess: 'bg-warning',
  hold: 'bg-muted',
  leave: 'bg-error',
  trial: 'bg-info',
} as const satisfies Record<RingId, string>;

export const BRIGHT_RING_STYLE = {
  adopt: 'success-foreground',
  assess: 'warning-foreground',
  hold: 'muted-foreground',
  leave: 'error-foreground',
  trial: 'info-foreground',
} as const satisfies Record<RingId, string>;
