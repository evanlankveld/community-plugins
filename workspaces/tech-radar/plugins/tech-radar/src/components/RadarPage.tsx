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

import { Content, Header, Page } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { type TechRadarComponentProps } from './RadarComponent';
import { NewTechRadar } from '../v2/components/NewTechRadar.tsx';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

/**
 * Properties for {@link TechRadarPage}
 *
 * @public
 */
export interface TechRadarPageProps extends TechRadarComponentProps {
  /**
   * Title
   */
  title?: string;
  /**
   * Subtitle
   */
  subtitle?: string;
  /**
   * Page Title
   */
  pageTitle?: string;
}

/**
 * Main Page of Tech Radar
 *
 * @public
 */
export function RadarPage(props: TechRadarPageProps) {
  const {
    title = 'Tech Radar',
    subtitle = 'Pick the recommended technologies for your projects',
  } = props;
  const classes = useStyles();

  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content className={classes.overflowXScroll}>
        <NewTechRadar />
      </Content>
    </Page>
  );
}
