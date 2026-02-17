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
import { TechRadarFilter } from './TechRadarFilter';
import { type TechRadarLoaderResponse } from '@backstage-community/plugin-tech-radar-common';

const mockRadarData: TechRadarLoaderResponse = {
  entries: [],
  quadrants: [
    { id: 'quadrant-1', name: 'Quadrant 1' },
    { id: 'quadrant-2', name: 'Quadrant 2' },
  ],
  rings: [
    { id: 'ring-1', name: 'Ring 1', color: '#ff0000' },
    { id: 'ring-2', name: 'Ring 2', color: '#00ff00' },
  ],
};

describe('TechRadarFilter', () => {
  const handleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the placeholder text when no filter is selected', () => {
    render(
      <TechRadarFilter
        handleChange={handleChange}
        placeholder="Select filter"
        radarData={mockRadarData}
        selected={[]}
      />,
    );
    expect(screen.getByText('Select filter')).toBeInTheDocument();
  });

  it('should render the label of the selected option when one filter is selected', () => {
    render(
      <TechRadarFilter
        handleChange={handleChange}
        placeholder="Select filter"
        radarData={mockRadarData}
        selected={['ring:ring-1']}
      />,
    );
    expect(screen.getByText('Ring 1')).toBeInTheDocument();
  });

  it('should render the number of selected options when multiple filters are selected', () => {
    render(
      <TechRadarFilter
        handleChange={handleChange}
        placeholder="Select filter"
        radarData={mockRadarData}
        selected={['ring:ring-1', 'quadrant:quadrant-1']}
      />,
    );
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('should call handleChange with the correct values when an option is selected', () => {
    render(
      <TechRadarFilter
        handleChange={handleChange}
        placeholder="Select filter"
        radarData={mockRadarData}
        selected={[]}
      />,
    );
    fireEvent.click(screen.getByLabelText('Filter'));
    fireEvent.click(screen.getByText('Ring 1'));
    expect(handleChange).toHaveBeenCalledWith(['ring:ring-1']);
  });
});
