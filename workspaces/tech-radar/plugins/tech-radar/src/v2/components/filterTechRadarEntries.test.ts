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

import { filterEntries } from './filterTechRadarEntries';

describe('filterTechRadarEntries', () => {
  const mockData: TechRadarLoaderResponse = {
    entries: [
      {
        key: 'react',
        quadrant: 'frameworks',
        timeline: [
          {
            date: new Date('2023-01-01'),
            description: 'The web framework of choice',
            ringId: 'adopt',
          },
        ],
        title: 'React',
      },
      {
        key: 'vue',
        quadrant: 'frameworks',
        timeline: [
          {
            date: new Date('2023-01-01'),
            description: 'An alternative web framework',
            ringId: 'trial',
          },
        ],
        title: 'Vue',
      },
      {
        key: 'angular',
        quadrant: 'languages',
        timeline: [
          {
            date: new Date('2022-01-01'),
            description: 'Another web framework',
            ringId: 'assess',
          },
          {
            date: new Date('2023-01-01'),
            description: 'Moved to hold',
            ringId: 'hold',
          },
        ],
        title: 'Angular',
      },
    ],
    quadrants: [],
    rings: [],
  } as unknown as TechRadarLoaderResponse;

  it('should return empty array if data is undefined', () => {
    const result = filterEntries({
      data: undefined,
      searchTerm: '',
      selectedFilters: [],
    });
    expect(result).toEqual([]);
  });

  it('should return all entries if no search term and no filters are provided', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: [],
    });
    expect(result).toHaveLength(3);
    expect(result).toEqual(mockData.entries);
  });

  it('should filter entries by search term matching the key', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: 'react',
      selectedFilters: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('react');
  });

  it('should filter entries by search term matching the description of the first timeline entry', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: 'alternative',
      selectedFilters: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('vue');
  });

  it('should filter entries by selected ring filter', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: ['ring:adopt'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('react');
  });

  it('should filter entries by selected quadrant filter', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: ['quadrant:languages'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('angular');
  });

  it('should respect the latest ring in the timeline for filtering', () => {
    // Angular has 'assess' (2022) then 'hold' (2023)
    const result = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: ['ring:hold'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('angular');

    const result2 = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: ['ring:assess'],
    });
    expect(result2).toHaveLength(0);
  });

  it('should combine search term and filters', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: 'web',
      selectedFilters: ['ring:trial'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('vue');

    const result2 = filterEntries({
      data: mockData,
      searchTerm: 'angular',
      selectedFilters: ['quadrant:languages'],
    });
    expect(result2).toHaveLength(1);
    expect(result2[0].key).toBe('angular');
  });

  it('should handle multiple filters (OR logic)', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: ['ring:adopt', 'quadrant:languages'],
    });
    expect(result).toHaveLength(2);
    expect(result.map(r => r.key)).toContain('react');
    expect(result.map(r => r.key)).toContain('angular');
  });

  it('should ignore unknown filters', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: '',
      selectedFilters: ['unknown:filter', 'ring:adopt'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('react');
  });

  it('should return empty array if no matches are found', () => {
    const result = filterEntries({
      data: mockData,
      searchTerm: 'nonexistent',
      selectedFilters: [],
    });
    expect(result).toEqual([]);
  });
});
