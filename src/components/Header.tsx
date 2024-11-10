import React, { ReactElement } from 'react';
import { usePathname } from 'next/navigation';

export default function Header({ navOptions }: { navOptions: { label: string; href: string }[] }): ReactElement {
  const pathname = usePathname();
  //   const { pathname } = window.location;

  return (
    <header>
      <nav>
        <ul>
          {navOptions.map(option => (
            <li className={`${pathname === option.href ? 'current-location' : ''} `} key={option.label}>
              <a href={option.href}>{option.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
