import React from 'react';
import { render } from '@testing-library/react';
import { UserProvider, UserContext } from './UserProvider';
import { User } from '../actions/types';
import { mockUser } from '../testUtils/mockData';

describe('UserProvider', () => {
  it('provides the user context to its children', () => {
    const user: User = mockUser;
    const { getByText } = render(
      <UserProvider user={user}>
        <UserContext.Consumer>{value => <span>{value ? value.username : 'No User'}</span>}</UserContext.Consumer>
      </UserProvider>,
    );

    expect(getByText('testUser')).toBeInTheDocument();
  });

  it('provides null context when no user is passed', () => {
    const { getByText } = render(
      <UserProvider user={null}>
        <UserContext.Consumer>{value => <span>{value ? value.username : 'No User'}</span>}</UserContext.Consumer>
      </UserProvider>,
    );

    expect(getByText('No User')).toBeInTheDocument();
  });
});
