/*
 * @flow
 * Copyright (C) 2019 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';
import type {ColumnOptions} from 'react-table';

import RatingStars from '../components/RatingStars';
import SortableTableHeader from '../components/SortableTableHeader';
import linkedEntities from '../static/scripts/common/linkedEntities';
import DescriptiveLink
  from '../static/scripts/common/components/DescriptiveLink';
import EntityLink from '../static/scripts/common/components/EntityLink';
import formatDate from '../static/scripts/common/utility/formatDate';
import formatEndDate from '../static/scripts/common/utility/formatEndDate';
import expand2react from '../static/scripts/common/i18n/expand2react';
import yesNo from '../static/scripts/common/utility/yesNo';

export function defineCheckboxColumn<T>(
  name: string,
): ColumnOptions<EntityRoleT<T>, number> {
  return {
    Cell: ({cell: {value}}) => (
      <input
        name={name}
        type="checkbox"
        value={value}
      />
    ),
    Header: <input type="checkbox" />,
    accessor: 'id',
    className: 'checkbox-cell',
    id: 'checkbox',
  };
}

export const instrumentDescriptionColumn:
  ColumnOptions<{+description?: string, ...}, string> = {
    Cell: ({cell: {value}}) => (value
      ? expand2react(l_instrument_descriptions(value))
      : null),
    Header: N_l('Description'),
    accessor: 'description',
  };

export function defineNameColumn<T: CoreEntityT | CollectionT>(
  title: string,
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<T, string> {
  return {
    Cell: ({row: {original}}) => (
      <DescriptiveLink entity={original} />
    ),
    Header: (sortable
      ? (
        <SortableTableHeader
          label={title}
          name="name"
          order={order}
        />
      )
      : title),
    accessor: 'name',
    id: 'name',
  };
}

export function defineTypeColumn(
  typeContext: string,
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<{+typeName: string, ...}, string> {
  return {
    Cell: ({cell: {value}}) => (value
      ? lp_attributes(value, typeContext)
      : null),
    Header: (sortable
      ? (
        <SortableTableHeader
          label={l('Type')}
          name="type"
          order={order}
        />
      )
      : l('Type')),
    accessor: 'typeName',
    id: 'type',
  };
}

export function defineTextColumn<D>(
  getText: (D) => string,
  columnName: string,
  title: string,
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<D, StrOrNum> {
  return {
    Cell: ({row: {original}}) => getText(original),
    Header: (sortable
      ? (
        <SortableTableHeader
          label={title}
          name={columnName}
          order={order}
        />
      )
      : title),
    accessor: row => getText(row) ?? '',
    id: columnName,
  };
}

export function defineEntityColumn<D>(
  getEntity: (D) => CoreEntityT,
  columnName: string,
  title: string,
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<D, string> {
  return {
    Cell: ({row: {original}}) => {
      const entity = getEntity(original);
      return (entity
        ? <DescriptiveLink entity={entity} />
        : null);
    },
    Header: (sortable
      ? (
        <SortableTableHeader
          label={title}
          name={columnName}
          order={order}
        />
      )
      : title),
    accessor: row => getEntity(row)?.name ?? '',
    id: columnName,
  };
}

export function defineTextColumn<D>(
  getText: (D) => string,
  columnName: string,
  title: string,
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<D, string> {
  return {
    Cell: ({row: {original}}) => getText(original),
    Header: (sortable
      ? (
        <SortableTableHeader
          label={title}
          name={columnName}
          order={order}
        />
      )
      : title),
    accessor: row => getText(row) ?? '',
    id: columnName,
  };
}

export function defineBeginDateColumn(
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<{+begin_date: PartialDateT, ...}, PartialDateT> {
  return {
    Cell: ({cell: {value}}) => formatDate(value),
    Header: (sortable
      ? (
        <SortableTableHeader
          label={l('Begin')}
          name="begin_date"
          order={order}
        />
      )
      : l('Begin')),
    accessor: 'begin_date',
    id: 'begin_date',
  };
}

export function defineEndDateColumn(
  order?: string = '',
  sortable?: boolean = false,
): ColumnOptions<{...DatePeriodRoleT, ...}, PartialDateT> {
  return {
    Cell: ({row: {original}}) => formatEndDate(original),
    Header: (sortable
      ? (
        <SortableTableHeader
          label={l('End')}
          name="end_date"
          order={order}
        />
      )
      : l('End')),
    accessor: 'end_date',
    id: 'end_date',
  };
}

export const ratingsColumn:
  ColumnOptions<{...RatableRoleT, ...}, number> = {
    Cell: ({row: {original}}) => <RatingStars entity={original} />,
    Header: N_l('Rating'),
    accessor: 'rating',
  };

export const seriesOrderingTypeColumn:
  ColumnOptions<{+orderingTypeID?: number, ...}, number> = {
    Cell: ({cell: {value}}) => {
      const orderingType = linkedEntities.series_ordering_type[value];
      return orderingType
        ? lp_attributes(orderingType.name, 'series_ordering_type')
        : null;
    },
    Header: N_l('Ordering Type'),
    accessor: 'orderingTypeID',
  };

export const subscriptionColumn:
  ColumnOptions<{+subscribed: boolean, ...}, boolean> = {
    Cell: ({cell: {value}}) => yesNo(value),
    Header: N_l('Subscribed'),
    accessor: 'subscribed',
  };

export function defineActionsColumn(
  actions: $ReadOnlyArray<[string, string]>,
): ColumnOptions<CoreEntityT | CollectionT, number> {
  return {
    Cell: ({row: {original}}) => (
      <>
        {actions.map((actionPair, index) => (
          <React.Fragment key={actionPair[1] + (index === 0 ? '-first' : '')}>
            {index === 0 ? null : ' | '}
            <EntityLink
              content={actionPair[0]}
              entity={original}
              subPath={actionPair[1]}
            />
          </React.Fragment>
        ))}
      </>
    ),
    Header: l('Actions'),
    accessor: 'id',
    className: 'actions',
    id: 'actions',
  };
}
