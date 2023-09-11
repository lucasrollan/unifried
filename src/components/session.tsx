import React from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Session() {
  const { data, status } = useSession();
  console.log()
  if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'authenticated') {
    if (!data.user) return 'NO USER DEFINED'
    return (
      <div>
        <img src={data.user.image || undefined} alt={data.user.name + ' photo'} />
        <span>{data.user.name}</span>
        <button onClick={() => signOut()}>sign out</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => signIn('google')}>sign in with gooogle</button>
    </div>
  );
}