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
import type { RadarEntry } from '@backstage-community/plugin-tech-radar-common';
// import { MovedState } from '@backstage-community/plugin-tech-radar-common';
// import { DateTime } from 'luxon';
// import { ArrowDown, ArrowUp, CircleDot } from 'lucide-react';
import { useComponents } from './hooks/useComponents';

type Props = Readonly<{
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  radarEntry: RadarEntry;
}>;

export const RadarEntryDetails = (props: Props) => {
  const { onOpenChange, open, radarEntry } = props;
  const { Dialog, DialogBody, DialogFooter, DialogHeader, Link } =
    useComponents();

  const latestDescription =
    radarEntry.description ??
    radarEntry.timeline.reduce((latest, current) => {
      return current.date > latest.date ? current : latest;
    }).description;

  // const snapshots = radarEntry.timeline.sort(
  //   (t1, t2) => t1.date.getTime() - t2.date.getTime(),
  // );
  //
  // const movedInDirection = (movedState?: MovedState) => {
  //   const icon = (() => {
  //     switch (movedState) {
  //       case MovedState.Down:
  //         return <ArrowDown size={16} />;
  //       case MovedState.Up:
  //         return <ArrowUp size={16} />;
  //       default:
  //         return <CircleDot size={16} />;
  //     }
  //   })();
  //
  //   return <div className={'flex items-center'}>{icon}</div>;
  // };

  return (
    <Dialog onOpenChange={onOpenChange} isOpen={open}>
      <DialogHeader>{radarEntry.title}</DialogHeader>
      <div className="flex flex-col gap-4 p-4">
        {latestDescription && (
          <DialogBody>
            <div className="text-sm text-foreground">{latestDescription}</div>

            {/* <Table>*/}
            {/*  <TableHeader>*/}
            {/*    <TableRow className={'hover:bg-transparent'}>*/}
            {/*      <TableHead className={'font-semibold'}>*/}
            {/*        {'Moved in direction'}*/}
            {/*      </TableHead>*/}
            {/*      <TableHead className={'font-semibold'}>*/}
            {/*        {'Moved to ring'}*/}
            {/*      </TableHead>*/}
            {/*      <TableHead className={'font-semibold'}>*/}
            {/*        {'Moved on date'}*/}
            {/*      </TableHead>*/}
            {/*      <TableHead className={'font-semibold'}>*/}
            {/*        {'Description'}*/}
            {/*      </TableHead>*/}
            {/*    </TableRow>*/}
            {/*  </TableHeader>*/}
            {/*  <TableBody>*/}
            {/*    {snapshots.map((snapshot, idx) => {*/}
            {/*      return (*/}
            {/*        <TableRow className={'hover:bg-transparent'} key={idx}>*/}
            {/*          <TableCell>{movedInDirection(snapshot.moved)}</TableCell>*/}
            {/*          <TableCell>{snapshot.ringId}</TableCell>*/}
            {/*          <TableCell>*/}
            {/*            {DateTime.fromJSDate(snapshot.date).toISODate()}*/}
            {/*          </TableCell>*/}
            {/*          <TableCell>{snapshot.description}</TableCell>*/}
            {/*        </TableRow>*/}
            {/*      );*/}
            {/*    })}*/}
            {/*  </TableBody>*/}
            {/* </Table>*/}
          </DialogBody>
        )}
      </div>
      <DialogFooter>
        <Link className="capitalize" href={radarEntry.url ?? '#'}>
          Learn more
        </Link>
      </DialogFooter>
    </Dialog>
  );
};
