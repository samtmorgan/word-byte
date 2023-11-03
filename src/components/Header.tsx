import React from 'react';
// import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';

// function getLabel(pathname: string): string {
//   if (!pathname) return '';
//   if (pathname === '/') return 'Home';
//   if (pathname === '/login') return 'Login';
//   if (pathname === '/signup') return 'Sign Up';
//   if (pathname === '/profile') return 'Profile';
//   if (pathname === '/test') return 'Test';
//   return '';
// }

function getLabel(pathname: string): string {
  if (!pathname) return '';
  if (pathname === '/') return 'Home';
  const splitPathname = pathname.split('/');
  const lastPathname = splitPathname[splitPathname.length - 1];

  return lastPathname.charAt(0).toUpperCase() + lastPathname.slice(1);
}

export default function Header() {
  //   const { user } = useAppContext();
  const pathname = usePathname();
  const pathLabel: string = getLabel(pathname);

  //   return <p>Current pathname: {pathname}</p>;
  //   return <header>{user ? <p>Welcome, {user.name}!</p> : null}</header>;
  return <header>{pathname ? <h1>{pathLabel}</h1> : null}</header>;
}
