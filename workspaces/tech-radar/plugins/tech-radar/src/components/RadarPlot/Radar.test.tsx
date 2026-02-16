/*
 * Copyright 2020 The Backstage Authors
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

import { renderInTestApp } from '@backstage/test-utils';
import GetBBoxPolyfill from '../../util/polyfills/getBBox';

import { Radar, RadarBlipsAndLabels } from './Radar';
import { TechRadarLoaderResponse } from '@backstage-community/plugin-tech-radar-common';
import { mapToEntries } from './radarPlotUtils';

const mockRadarData: TechRadarLoaderResponse = {
  quadrants: [
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'frameworks', name: 'Frameworks' },
    { id: 'languages', name: 'Languages' },
    { id: 'process', name: 'Process' },
  ],
  rings: [{ id: 'use', name: 'USE', color: '#93c47d' }],
  entries: [
    {
      key: 'typescript',
      id: 'typescript',
      title: 'TypeScript',
      quadrant: 'languages',
      timeline: [
        {
          moved: 0,
          ringId: 'use',
          date: new Date('2020-08-06'),
        },
      ],
    },
  ],
};

describe('Radar', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render', async () => {
    const rendered = await renderInTestApp(<Radar radarData={mockRadarData} />);

    const svg = rendered.container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('should render blips and labels', async () => {
    const mockEntries = mapToEntries(mockRadarData, mockRadarData.entries);

    const rendered = await renderInTestApp(
      <Radar radarData={mockRadarData}>
        <RadarBlipsAndLabels
          radarData={mockRadarData}
          entries={mockEntries}
          selectedBlipId="typescript"
        />
      </Radar>,
    );

    expect(rendered.container.querySelector('svg')).not.toBeNull();
    expect(await rendered.findByText('TypeScript')).toBeInTheDocument();
    expect(await rendered.findByText('Infrastructure')).toBeInTheDocument();
    expect(await rendered.findByText('Frameworks')).toBeInTheDocument();
    expect(await rendered.findByText('Languages')).toBeInTheDocument();
    expect(await rendered.findByText('Process')).toBeInTheDocument();
    expect(await rendered.findAllByText('USE')).toHaveLength(1);
  });
});
