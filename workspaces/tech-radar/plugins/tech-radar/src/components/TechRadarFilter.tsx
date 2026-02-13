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
import { ChevronDown } from 'lucide-react';

type Option = Readonly<{
  category: string;
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
    category: 'Ring',
    label: capitalize(item.name),
    value: `ring:${item.id}`,
  }));

  const quadrantsOptions = data.quadrants.map(item => ({
    category: 'Quadrant',
    label: capitalize(item.name),
    value: `quadrant:${item.id}`,
  }));

  options.push(...ringOptions, ...quadrantsOptions);

  return options;
};

export const TechRadarFilter = (props: Props) => {
  const { className, handleChange, placeholder, radarData, selected } = props;
  const { Button, MenuAutocompleteListbox, MenuListBoxItem, MenuTrigger } =
    useComponents();

  const options = useMemo(() => buildOptions(radarData), [radarData]);

  const triggerLabel = useMemo(() => {
    if (selected.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (selected.length === 1) {
      return options.find(option => option.value === selected[0])?.label;
    }

    return `${selected.length} selected`;
  }, [placeholder, options, selected]);

  return (
    <div className={className}>
      <MenuTrigger>
        <Button
          aria-label="Filter"
          variant="tertiary"
          className="bg-card border border-border border-solid w-60 h-10 [&_.bui-ButtonContent]:justify-between font-normal"
        >
          {triggerLabel}
          <ChevronDown size={12} className="text-muted-foreground" />
        </Button>
        <MenuAutocompleteListbox
          className="with-custom-css"
          onSelectionChange={keys =>
            handleChange(Array.from(keys).map(key => String(key)))
          }
          selectedKeys={selected}
          selectionMode="multiple"
        >
          {options.map(option => (
            <MenuListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className="w-full [&_.bui-MenuItemWrapper]:w-full [&_.bui-MenuItemContent]:flex [&_.bui-MenuItemContent]:items-center [&_.bui-MenuItemContent]:w-full"
            >
              <span className="grow mr-2">{option.label}</span>
              <span className="text-muted-foreground text-xs">
                {option.category}
              </span>
            </MenuListBoxItem>
          ))}
        </MenuAutocompleteListbox>
      </MenuTrigger>
    </div>
  );
};
