import React from 'react';
import { initialiseUser } from '../../actions/initUser';
import ProgressContent from '../../components/pageComponents/ProgressContent';

export default async function ProgressPage() {
  const user = await initialiseUser();

  return <ProgressContent initialWords={user?.words ?? []} />;
}
