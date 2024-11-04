// Profile.js
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '../fetcher';

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user/1', fetcher);

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    if (error.details) {
      return (
        <div>
          <h2>Error:</h2>
          <ul>
            {Object.entries(error.details).map(([key, message]) => (
              <li key={key}>
                <strong>{key}:</strong> {message}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <div>Failed to load.</div>;
  }

  return <div>Hello, {data.name}!</div>;
}

export default Profile;
