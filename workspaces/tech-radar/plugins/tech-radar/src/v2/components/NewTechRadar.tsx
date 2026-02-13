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

import '../../css/tech-radar.css';
import { NewTechRadarContent } from './NewTechRadarContent';
import {
  ComponentContext,
  ComponentContextProps,
  defaultComponents,
} from './hooks/useComponents';

type Props = {
  customComponents?: Partial<ComponentContextProps>;
} & HTMLAttributes<HTMLDivElement>;

export const NewTechRadar = ({ customComponents = {}, ...props }: Props) => {
  return (
    <ComponentContext.Provider
      value={{ ...defaultComponents, ...customComponents }}
    >
      <div id="tech-radar-root" {...props}>
        <NewTechRadarContent />
      </div>
    </ComponentContext.Provider>
  );
};
