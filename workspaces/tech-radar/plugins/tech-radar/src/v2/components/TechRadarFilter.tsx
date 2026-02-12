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
import { useMemo } from 'react';

import type { TechRadarLoaderResponse } from '@backstage-community/plugin-tech-radar-common';
import { useComponents } from './hooks/useComponents';

type Option = Readonly<{
  label: string;
  value: string;
}>;

type Props = Readonly<{
  className?: string;
  handleChange: (selected: string[]) => void;
  placeholder: string;
  radarData: TechRadarLoaderResponse;
  selected: string[];
}>;

const capitalize = (name: string): string => {
  if (name === 'AI') {
    return 'AI';
  }
  return name.charAt(0) + name.slice(1).toLowerCase();
};

const buildOptions = (data: TechRadarLoaderResponse): Option[] => {
  const options = [] as Option[];

  const ringOptions = data.rings.map(item => ({
    label: capitalize(item.name),
    value: `ring:${item.id}`,
  }));

  const quadrantsOptions = data.quadrants.map(item => ({
    label: capitalize(item.name),
    value: `quadrant:${item.id}`,
  }));

  options.push(...ringOptions, ...quadrantsOptions);

  return options;
};

export const TechRadarFilter = (props: Props) => {
  const { className, handleChange, placeholder, radarData, selected } = props;
  const { MenuAutocompleteListbox, MenuListBoxItem } = useComponents();

  const options = useMemo(() => buildOptions(radarData), [radarData]);

  return (
    <div className={className}>
      <MenuAutocompleteListbox
        className="h-full"
        onSelectionChange={keys =>
          handleChange(Array.from(keys).map(key => String(key)))
        }
        placeholder={placeholder}
        selectedKeys={selected}
        selectionMode="multiple"
      >
        {options.map(option => (
          <MenuListBoxItem key={option.value} id={option.value}>
            {option.label}
          </MenuListBoxItem>
        ))}
      </MenuAutocompleteListbox>
    </div>
  );
};
