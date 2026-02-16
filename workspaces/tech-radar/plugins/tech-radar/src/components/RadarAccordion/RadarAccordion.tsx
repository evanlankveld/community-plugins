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
import { useEffect, useRef, useState } from 'react';

import type {
  RadarEntry,
  RadarRing,
  TechRadarLoaderResponse,
} from '@backstage-community/plugin-tech-radar-common';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import { DateTime } from 'luxon';

import { useComponents } from './../hooks/useComponents';
import { RingId } from '../types';
import { cn } from '../../util/cn';
import { RING_STYLE } from '../ringColors';
import { RingLegend } from '../Legend/RingLegend';
import { RadarEntryDetails } from '../RadarEntryDetails/RadarEntryDetails';

type RadarAccordionProps = Readonly<{
  entries: RadarEntry[];
  onValueChange: (value: string) => void;
  radarData: TechRadarLoaderResponse;
  rings: RadarRing[];
  selectedBlipId: string;
}>;

const Moved = (props: {
  moved?: number | undefined;
  showLabel?: boolean;
  size?: number;
}) => {
  const { moved, showLabel = false, size } = props;
  if (!moved) {
    return <span />;
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {showLabel && 'Moved: '}
      {moved === 1 ? <ArrowUp size={size} /> : <ArrowDown size={size} />}
    </span>
  );
};

export const RadarAccordion = (props: RadarAccordionProps) => {
  const { entries, onValueChange, radarData, rings, selectedBlipId } = props;
  const [viewingEntryDetails, setViewingEntryDetails] = useState<RadarEntry>();
  const {
    Accordion,
    AccordionGroup,
    AccordionPanel,
    AccordionTrigger,
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    Link,
  } = useComponents();

  const activeItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedBlipId && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedBlipId]);

  return (
    <>
      <AccordionGroup
        allowsMultiple={false}
        className="rounded bg-background p-0"
      >
        {rings.map(ring => {
          const ringId = ring.id as RingId;

          return (
            <div className={cn('flex flex-col gap-1 pt-4')} key={ringId}>
              <div className="flex items-center gap-1.5">
                <h3 className="py-2 m-0">{ring.name}</h3>
                <DialogTrigger>
                  <Button variant="tertiary">
                    <Info data-testid="info-icon" />
                  </Button>

                  <Dialog className="with-custom-css" width={1000}>
                    <DialogHeader>Legend</DialogHeader>
                    <DialogBody>
                      <RingLegend highlighted={ringId} radarData={radarData} />
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="secondary" slot="close">
                        Close
                      </Button>
                    </DialogFooter>
                  </Dialog>
                </DialogTrigger>
              </div>

              {entries
                .filter(e => e.timeline[0].ringId === ringId)
                .map(entry => {
                  const timeline = entry.timeline.sort(
                    (a, b) => b.date.getTime() - a.date.getTime(),
                  )[0];
                  const timelineDate = DateTime.fromJSDate(timeline.date);

                  return (
                    <Accordion
                      className={cn(
                        'relative border-b border-muted transition-all',
                        selectedBlipId === entry.key && RING_STYLE[ringId],
                      )}
                      defaultExpanded
                      key={entry.id}
                      onExpandedChange={isExpanded =>
                        onValueChange(isExpanded ? entry.key : '')
                      }
                      ref={selectedBlipId === entry.key ? activeItemRef : null}
                    >
                      <AccordionTrigger level={5}>
                        <div className="flex items-center gap-2">
                          {entry.title}
                          {selectedBlipId !== entry.key && (
                            <Moved moved={timeline.moved} size={16} />
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionPanel className="flex flex-col gap-2">
                        <div className="p-4">
                          <div className="flex gap-2">
                            {timelineDate.isValid && (
                              <div
                                className={
                                  timeline.moved
                                    ? 'inline-flex items-center gap-2 sm:gap-3'
                                    : ''
                                }
                              >
                                <Moved moved={timeline.moved} showLabel />
                                <span>
                                  {'SINCE: '}
                                  <b>{timelineDate.toISODate()}</b>
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="py-2">
                            {entry.timeline[0].description}
                          </div>
                          <Link
                            className="uppercase text-primary"
                            onClick={() => setViewingEntryDetails(entry)}
                            href="#"
                          >
                            Details
                          </Link>
                        </div>
                      </AccordionPanel>
                    </Accordion>
                  );
                })}
            </div>
          );
        })}
      </AccordionGroup>

      <RadarEntryDetails
        onOpenChange={() => setViewingEntryDetails(undefined)}
        entry={viewingEntryDetails}
      />
    </>
  );
};
