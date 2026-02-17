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
import type {
  RadarEntry,
  TechRadarLoaderResponse,
} from '@backstage-community/plugin-tech-radar-common';

type Options = Readonly<{
  data: TechRadarLoaderResponse | undefined;
  searchTerm: string;
  selectedFilters: string[];
}>;

const latestSnapshotsByEntry = (radarEntries: RadarEntry[]) =>
  radarEntries
    .filter(e => e.timeline) // keep only items that have timeline
    .map(entry => {
      const latestEntry = entry.timeline.reduce((latest, current) => {
        return current.date > latest.date ? current : latest;
      });

      return {
        entry,
        latestRingKey: `ring:${latestEntry.ringId}`,
      };
    });

export const filterEntries = (options: Options): RadarEntry[] => {
  const { data, searchTerm, selectedFilters } = options;

  if (!data) {
    return [];
  }

  const filteredBySearch =
    data?.entries.filter(
      entry =>
        entry.key.includes(searchTerm) ||
        entry.timeline[0].description?.includes(searchTerm),
    ) ?? [];

  if (!selectedFilters.length) {
    return filteredBySearch;
  }

  return selectedFilters.reduce((acc, selectedFilter) => {
    if (selectedFilter.startsWith('ring:')) {
      acc.push(
        ...latestSnapshotsByEntry(filteredBySearch)
          .filter(e => e.latestRingKey === selectedFilter)
          .map(e => e.entry),
      );
    }

    if (selectedFilter.startsWith('quadrant:')) {
      acc.push(
        ...filteredBySearch.filter(
          e => `quadrant:${e.quadrant}` === selectedFilter,
        ),
      );
    }

    return acc;
  }, [] as RadarEntry[]);
};
