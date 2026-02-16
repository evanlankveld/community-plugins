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

import { screen } from '@testing-library/react';
import { TechRadarPage } from './TechRadarPage';
import { renderInTestApp } from '@backstage/test-utils';

jest.mock('./TechRadarContent', () => ({
  TechRadarContent: () => <div data-testid="tech-radar-content" />,
}));

describe('TechRadarPage', () => {
  it('should render the default title and subtitle', async () => {
    await renderInTestApp(<TechRadarPage />);
    expect(screen.getByText('Tech Radar')).toBeInTheDocument();
    expect(
      screen.getByText('Pick the recommended technologies for your projects'),
    ).toBeInTheDocument();
  });

  it('should render the provided title and subtitle', async () => {
    await renderInTestApp(
      <TechRadarPage title="My Radar" subtitle="My Subtitle" />,
    );
    expect(screen.getByText('My Radar')).toBeInTheDocument();
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('should render the TechRadarContent component', async () => {
    await renderInTestApp(<TechRadarPage />);
    expect(screen.getByTestId('tech-radar-content')).toBeInTheDocument();
  });
});
