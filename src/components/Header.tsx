import React, { ReactElement } from 'react';
import { usePathname } from 'next/navigation';
// import LinkButton from './LinkButton';

export default function Header({ navOptions }: { navOptions: { label: string; href: string }[] }): ReactElement {
  const pathname = usePathname();

  return (
    <header>
      <nav>
        <ul>
          {navOptions.map(option => (
            <li className={`${pathname === option.href ? 'current-location' : ''} `} key={option.label}>
              <a href={option.href}>{option.label}</a>
            </li>
            // <LinkButton key={option.label} label={option.label} href={option.href} />
          ))}
        </ul>
      </nav>
    </header>
  );
}
