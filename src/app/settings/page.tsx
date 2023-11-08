'use client';

import React from 'react';

import LinkButton from '../../components/LinkButton';

export default function Settings() {
  return (
    <div className="test-page-container">
      <div style={{ gap: '1rem' }}>
        <LinkButton href="/settingsAccount" label="Account settings" />
        <LinkButton href="/settingsWords" label="Word settings" />
      </div>
    </div>
  );
}
