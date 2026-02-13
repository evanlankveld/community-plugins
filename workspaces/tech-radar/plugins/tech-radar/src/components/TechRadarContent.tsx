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
import { useCallback, useEffect, useRef, useState } from 'react';

import { Maximize, Minimize } from 'lucide-react';
import { techRadarApiRef } from '@backstage-community/plugin-tech-radar';
import useAsync from 'react-use/lib/useAsync';
import type { RadarEntry } from '@backstage-community/plugin-tech-radar-common';

import { errorApiRef, useAnalytics, useApi } from '@backstage/core-plugin-api';

import { QuadrantFilterButtons } from './QuadrantFilterButtons';
import { RadarAccordion } from './RadarAccordion';
import { Radar, RadarBlipsAndLabels } from './RadarPlot/Radar';
import { mapToEntries } from './RadarPlot/radarPlotUtils';
import { TechRadarFilter } from './TechRadarFilter';
import { filterEntries } from './filterTechRadarEntries';
import { TrendLegend } from './TrendLegend';
import { useComponents } from './hooks/useComponents.ts';
import { cn } from '../util/cn';

export const TechRadarContent = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | undefined>(
    undefined,
  );
  const [selectedBlipId, setSelectedBlipId] = useState<string>('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [filteredEntries, setFilteredEntries] = useState<RadarEntry[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

  const { Button, SearchField } = useComponents();

  const useTechRadarLoader = () => {
    const errorApi = useApi(errorApiRef);
    const techRadarApi = useApi(techRadarApiRef);

    const { error, loading, value } = useAsync(
      async () => techRadarApi.load(''),
      [techRadarApi],
    );

    useEffect(() => {
      if (error) {
        errorApi.post(error);
      } else {
        setFilteredEntries(value?.entries ?? []);
      }
    }, [error, errorApi, value?.entries]);

    return { error, loading, value };
  };

  const { error, loading, value: data } = useTechRadarLoader();

  useEffect(() => {
    const header = document.getElementById('page-subheader');

    let observer: IntersectionObserver | undefined;
    if (header) {
      observer = new IntersectionObserver(([entry]) => {
        setIsHeaderVisible(entry.isIntersecting);
      });
      observer.observe(header);
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  const onSearch = useCallback((term: string) => {
    setSelectedBlipId('');
    setSearchTerm(term);
  }, []);

  useEffect(() => {
    setFilteredEntries(filterEntries({ data, searchTerm, selectedFilters }));
  }, [data, searchTerm, selectedFilters]);

  const handleSelectedBlipId = (id: string) => {
    if (id && id !== selectedBlipId) {
      const entry = filteredEntries.find(e => e.key === id);
      if (entry) {
        analytics.captureEvent('click', entry.title, {
          attributes: {
            action: 'view-details',
            category: 'tech-radar',
          },
        });
      }
    }
    setSelectedBlipId(id);
  };

  return (
    <>
      {loading && 'Loading...'}
      {!loading && data && !error && (
        <div
          className={cn(
            'transition-[position,width,height] duration-300',
            'group fullscreen:overflow-y-auto fullscreen:bg-background fullscreen:p-10',
            'flex flex-col gap-2',
          )}
          ref={ref}
        >
          <div className="flex items-center justify-between gap-2 border-0 border-b border-solid border-border pb-2 grow">
            <SearchField
              className="[&_.bui-SearchFieldInputWrapper]:h-10 max-w-80"
              onChange={value => onSearch(value)}
              placeholder="Search"
              type="text"
            />
            <div className="flex items-center gap-2">
              <TechRadarFilter
                handleChange={selected => {
                  setSelectedBlipId('');
                  setSelectedFilters(selected);
                  setFilteredEntries(
                    filterEntries({ data, searchTerm, selectedFilters }),
                  );
                }}
                placeholder="Select filter"
                radarData={data}
                selected={selectedFilters}
              />
              <Button
                className="h-10 w-12 p-0.5 [&_svg]:h-[22px] [&_svg]:w-[22px] bg-card border border-border border-solid"
                variant="tertiary"
                onClick={() => {
                  return document.fullscreenElement
                    ? document.exitFullscreen()
                    : ref.current?.requestFullscreen();
                }}
              >
                <Minimize className="hidden h-5 w-5 group-fullscreen:block" />
                <Maximize className="block h-5 w-5 group-fullscreen:hidden" />
              </Button>
              <QuadrantFilterButtons
                className="h-10 w-auto"
                onSelect={q => {
                  setSelectedBlipId('');
                  if (selectedQuadrant === q.id) {
                    setSelectedQuadrant(undefined);
                  } else {
                    setSelectedQuadrant(q.id);
                  }
                }}
                quadrants={data.quadrants}
                selected={selectedQuadrant}
              />
            </div>
          </div>
          <div className="flex w-full gap-2">
            <div className="basis-1/3">
              <RadarAccordion
                entries={filteredEntries}
                onValueChange={handleSelectedBlipId}
                radarData={data}
                rings={data?.rings ?? []}
                selectedBlipId={selectedBlipId}
              />
            </div>
            <div className="relative basis-2/3">
              <div
                className={cn(
                  'sticky top-[6rem] flex flex-col transition-all duration-500 ease-in-out group-fullscreen:top-[2rem] group-fullscreen:h-[calc(100vh-140px)]',
                  isHeaderVisible
                    ? 'h-[calc(100vh-270px)]'
                    : 'h-[calc(100vh-140px)]',
                )}
              >
                <TrendLegend />
                <Radar
                  className="w-full flex-1"
                  focusQuadrant={selectedQuadrant}
                  onClick={() => setSelectedBlipId('')}
                  radarData={data}
                >
                  <RadarBlipsAndLabels
                    entries={mapToEntries(data, filteredEntries)}
                    focusQuadrant={selectedQuadrant}
                    onBlipClick={blip => {
                      if (selectedBlipId === blip.id) {
                        handleSelectedBlipId('');
                      } else {
                        handleSelectedBlipId(blip.id);
                      }
                    }}
                    radarData={data}
                    selectedBlipId={selectedBlipId}
                  />
                </Radar>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
