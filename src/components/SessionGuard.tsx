import React from "react";
import { useSession, signIn } from 'next-auth/react';

export default function SessionGuard(props: any) {
  const { data, status } = useSession();

  if (status === 'loading') return <h4>Loading... please wait</h4>;
  if (status === 'authenticated') {
    return props.children;
  }

  return (
    <div>
      <h1>This is a private page. Sign in to access it.</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}