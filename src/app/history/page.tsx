import React from 'react';
import { initialiseUser } from '../../actions/initUser';
import HistoryContent from '../../components/pageComponents/HistoryContent';

export default async function HistoryPage() {
  const user = await initialiseUser();
  return <HistoryContent initialWords={user?.words ?? []} />;
}
