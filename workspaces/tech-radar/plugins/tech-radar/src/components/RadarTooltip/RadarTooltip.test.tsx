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

import { render, screen } from '@testing-library/react';
import { RadarTooltip } from './RadarTooltip';
import GetBBoxPolyfill from '../../util/polyfills/getBBox';

describe('RadarTooltip', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 100, 50);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render the text when visible', () => {
    render(<RadarTooltip text="Hello" visible x={0} y={0} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('radar-bubble')).toHaveClass('opacity-80');
  });

  it('should not be visible when not visible', () => {
    render(<RadarTooltip text="Hello" visible={false} x={0} y={0} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('radar-bubble')).toHaveClass('opacity-0');
  });
});
