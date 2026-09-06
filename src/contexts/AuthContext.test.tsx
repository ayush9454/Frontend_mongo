import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const TestComponent: React.FC = () => {
  const { user, login, logout, loading } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button onClick={() => login({ email: 'test@example.com', role: 'user' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('synchronously initializes user from localStorage on initial render', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'saved@example.com', role: 'user' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // On initial render without waiting for useEffect, user is immediately available
    expect(screen.getByTestId('user').textContent).toBe('saved@example.com');
  });

  test('clears user, token, and userId on logout', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'user@example.com', role: 'user' }));
    localStorage.setItem('token', 'sample-token');
    localStorage.setItem('userId', '12345');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('user@example.com');

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
  });
});
