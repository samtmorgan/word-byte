'use client';

import React from 'react';
import { Button } from '../../components';

export default function Settings() {
  return (
    <div className="page-container">
      <div style={{ gap: '1rem' }}>
        <Button type="link" href="/settingsAccount" label="Account settings" />
        <Button type="link" href="/settingsWords" label="Word settings" />
      </div>
    </div>
  );
}
