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
import type { HTMLAttributes } from 'react';
import { Content, Header, Page } from '@backstage/core-components';

import '../css/tech-radar.css';
import { TechRadarContent } from './TechRadarContent';
import {
  ComponentContext,
  ComponentContextProps,
  defaultComponents,
} from './hooks/useComponents';

export type TechRadarPageProps = {
  customComponents?: Partial<ComponentContextProps>;
  pageTitle?: string;
  title?: string;
  subtitle?: string;
} & HTMLAttributes<HTMLDivElement>;

export const TechRadarPage = ({
  customComponents = {},
  ...props
}: TechRadarPageProps) => {
  const {
    title = 'Tech Radar',
    subtitle = 'Pick the recommended technologies for your projects',
  } = props;

  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content>
        <ComponentContext.Provider
          value={{ ...defaultComponents, ...customComponents }}
        >
          <div id="tech-radar-root" {...props}>
            <TechRadarContent />
          </div>
        </ComponentContext.Provider>
      </Content>
    </Page>
  );
};
