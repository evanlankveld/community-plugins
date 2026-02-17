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
import { QuadrantFilterButtons } from './QuadrantFilterButtons';

const mockQuadrants = [
  { id: 'quadrant-1', name: 'Quadrant 1' },
  { id: 'quadrant-2', name: 'Quadrant 2' },
  { id: 'quadrant-3', name: 'Quadrant 3' },
  { id: 'quadrant-4', name: 'Quadrant 4' },
];

describe('QuadrantFilterButtons', () => {
  it('should call onSelect with the correct quadrant when a quadrant is clicked', () => {
    const onSelect = jest.fn();
    render(
      <QuadrantFilterButtons
        quadrants={mockQuadrants}
        onSelect={onSelect}
        selected={undefined}
      />,
    );

    fireEvent.click(screen.getByTestId('quadrant-0'));
    expect(onSelect).toHaveBeenCalledWith(mockQuadrants[0]);

    fireEvent.click(screen.getByTestId('quadrant-1'));
    expect(onSelect).toHaveBeenCalledWith(mockQuadrants[1]);

    fireEvent.click(screen.getByTestId('quadrant-2'));
    expect(onSelect).toHaveBeenCalledWith(mockQuadrants[2]);

    fireEvent.click(screen.getByTestId('quadrant-3'));
    expect(onSelect).toHaveBeenCalledWith(mockQuadrants[3]);
  });
});
