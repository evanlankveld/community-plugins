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
import {
  MovedState,
  type RadarEntry,
} from '@backstage-community/plugin-tech-radar-common';
import { useComponents } from './hooks/useComponents';
import { ArrowDown, ArrowUp, CircleDot } from 'lucide-react';
import { DateTime } from 'luxon';

type Props = Readonly<{
  onOpenChange?: (open: boolean) => void;
  entry?: RadarEntry;
}>;

export const RadarEntryDetails = (props: Props) => {
  const { onOpenChange, entry } = props;
  const { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Link } =
    useComponents();

  const latestDescription =
    entry?.description ??
    entry?.timeline.reduce((latest, current) => {
      return current.date > latest.date ? current : latest;
    }).description;

  const snapshots =
    entry?.timeline.sort((t1, t2) => t1.date.getTime() - t2.date.getTime()) ??
    [];

  const movedInDirection = (movedState?: MovedState) => {
    const icon = (() => {
      switch (movedState) {
        case MovedState.Down:
          return <ArrowDown size={16} />;
        case MovedState.Up:
          return <ArrowUp size={16} />;
        default:
          return <CircleDot size={16} />;
      }
    })();

    return <div className="flex items-center">{icon}</div>;
  };

  const thStyles = 'font-semibold text-left';

  return (
    <Dialog
      onOpenChange={onOpenChange}
      isOpen={!!entry}
      width={900}
      className="with-custom-css"
    >
      <DialogHeader>{entry?.title}</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4 p-4">
          {latestDescription && (
            <div className="text-sm text-foreground">{latestDescription}</div>
          )}

          <table>
            <thead>
              <tr className="hover:bg-transparent">
                <th className={thStyles}>Moved in direction</th>
                <th className={thStyles}>Moved to ring</th>
                <th className={thStyles}>Moved on date</th>
                <th className={thStyles}>Description</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snapshot, idx) => {
                return (
                  <tr className="hover:bg-transparent" key={idx}>
                    <td>{movedInDirection(snapshot.moved)}</td>
                    <td>{snapshot.ringId}</td>
                    <td>{DateTime.fromJSDate(snapshot.date).toISODate()}</td>
                    <td>{snapshot.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter>
        {entry?.url ? (
          <Link className="capitalize" href={entry.url}>
            Learn more
          </Link>
        ) : null}

        <Button variant="secondary" slot="close">
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
