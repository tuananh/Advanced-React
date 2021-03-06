import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Head from 'next/head';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query itemsConnection($skip: Int = 0, $first: Int = 4) {
    itemsConnection(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      aggregate {
        count
      }
    }
  }
`;

const PaginationStyles = styled.div`
  text-align: center;
  display: inline-grid;
  grid-template-columns: repeat(4, auto);
  align-items: stretch;
  justify-content: center;
  align-content: center;
  margin: 2rem 0;
  border: 1px solid ${props => props.theme.lightgrey};
  border-radius: 10px;
  & > * {
    margin: 0;
    padding: 15px 30px;
    border-right: 1px solid ${props => props.theme.lightgrey};
    &:last-child {
      border-right: 0;
    }
  }
  a[aria-disabled='true'] {
    color: grey;
    pointer-events: none;
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading || error) return null;
      const { aggregate } = data.itemsConnection;
      const { page } = props;
      const pages = Math.ceil(aggregate.count / perPage);
      return (
        <PaginationStyles data-test="pagination">
          <Head>
            <title>
              Sick Fits! — Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ←Prev
            </a>
          </Link>
          <p>
            Page <strong>{page} </strong> of <strong className="totalPages">{pages}</strong>
          </p>
          <p>
            <strong>{aggregate.count}</strong> Items Total
          </p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
};

export default Pagination;
export { PAGINATION_QUERY };
