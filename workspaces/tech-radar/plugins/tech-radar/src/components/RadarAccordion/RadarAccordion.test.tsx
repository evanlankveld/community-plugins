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

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RadarAccordion } from './RadarAccordion';
import {
  type RadarEntry,
  type TechRadarLoaderResponse,
} from '@backstage-community/plugin-tech-radar-common';

const mockRadarData: TechRadarLoaderResponse = {
  entries: [
    {
      id: 'entry-1',
      key: 'entry-1',
      title: 'Entry 1',
      quadrant: 'quadrant-1',
      timeline: [
        {
          date: new Date('2024-01-01'),
          ringId: 'ring-1',
          description: 'Description for entry 1',
        },
      ],
    },
    {
      id: 'entry-2',
      key: 'entry-2',
      title: 'Entry 2',
      quadrant: 'quadrant-1',
      timeline: [
        {
          date: new Date('2024-01-01'),
          ringId: 'ring-2',
          description: 'Description for entry 2',
          moved: 1,
        },
      ],
    },
    {
      id: 'entry-3',
      key: 'entry-3',
      title: 'Entry 3',
      quadrant: 'quadrant-2',
      timeline: [
        {
          date: new Date('2024-01-01'),
          ringId: 'ring-1',
          description: 'Description for entry 3',
          moved: -1,
        },
      ],
    },
  ],
  quadrants: [
    { id: 'quadrant-1', name: 'Quadrant 1' },
    { id: 'quadrant-2', name: 'Quadrant 2' },
  ],
  rings: [
    { id: 'ring-1', name: 'Ring 1', color: '#ff0000' },
    { id: 'ring-2', name: 'Ring 2', color: '#00ff00' },
  ],
};

const mockEntries: RadarEntry[] = mockRadarData.entries;
const mockRings = mockRadarData.rings;

describe('RadarAccordion', () => {
  const onValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the accordion with the correct number of rings and entries', () => {
    render(
      <MemoryRouter>
        <RadarAccordion
          entries={mockEntries}
          onValueChange={onValueChange}
          radarData={mockRadarData}
          rings={mockRings}
          selectedBlipId=""
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Ring 1')).toBeInTheDocument();
    expect(screen.getByText('Ring 2')).toBeInTheDocument();
    expect(screen.getByText('Entry 1')).toBeInTheDocument();
    expect(screen.getByText('Entry 2')).toBeInTheDocument();
    expect(screen.getByText('Entry 3')).toBeInTheDocument();
  });

  it('should call onValueChange when an accordion is expanded', () => {
    render(
      <MemoryRouter>
        <RadarAccordion
          entries={mockEntries}
          onValueChange={onValueChange}
          radarData={mockRadarData}
          rings={mockRings}
          selectedBlipId=""
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Entry 1'));
    expect(onValueChange).toHaveBeenCalledWith('entry-1');
  });

  it('should scroll to the active item when selectedBlipId changes', () => {
    const scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const { rerender } = render(
      <MemoryRouter>
        <RadarAccordion
          entries={mockEntries}
          onValueChange={onValueChange}
          radarData={mockRadarData}
          rings={mockRings}
          selectedBlipId=""
        />
      </MemoryRouter>,
    );

    rerender(
      <MemoryRouter>
        <RadarAccordion
          entries={mockEntries}
          onValueChange={onValueChange}
          radarData={mockRadarData}
          rings={mockRings}
          selectedBlipId="entry-2"
        />
      </MemoryRouter>,
    );

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
  });
});
