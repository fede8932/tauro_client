import React, { useState } from 'react';
import _ from 'lodash';
import { faker } from '@faker-js/faker';
import { GridColumn, Search, Grid, Header, Segment } from 'semantic-ui-react';

const source = _.times(5, () => ({
    title: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    image: faker.internet.avatar(),
    price: faker.finance.amount(0, 100, 2, '$'),
  }));

const initialState = { isLoading: false, results: [], value: '' };

const InputSearch = () => {
  const [state, setState] = useState(initialState);

  const handleResultSelect = (e, { result }) => {
    setState((prevState) => ({ ...prevState, value: result.title }));
  };

  const handleSearchChange = (e, { value }) => {
    setState((prevState) => ({ ...prevState, isLoading: true, value }));

    setTimeout(() => {
      if (value.length < 1) return setState(initialState);

      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = (result) => re.test(result.title);

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        results: _.filter(source, isMatch),
      }));
    }, 300);
  };

  const { isLoading, value, results } = state;

  return (
    <Grid>
      <GridColumn width={6}>
        <Search
          input={{ icon: 'search', iconPosition: 'left' }}
          loading={isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
        />
      </GridColumn>
      <GridColumn width={10}>
        <Segment>
          <Header>State</Header>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(state, null, 2)}
          </pre>
          <Header>Options</Header>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(source, null, 2)}
          </pre>
        </Segment>
      </GridColumn>
    </Grid>
  );
};

export default InputSearch;