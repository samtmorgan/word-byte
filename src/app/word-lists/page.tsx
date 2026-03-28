import React from 'react';
import { initialiseUser } from '../../actions/initUser';
import WordListsContent from '../../components/pageComponents/WordListsContent';

export default async function WordListsPage() {
  const user = await initialiseUser();

  return (
    <WordListsContent
      initialWordSets={user?.wordSets ?? []}
      initialWords={user?.words ?? []}
      initialAutoWordSet={user?.autoWordSet ?? []}
    />
  );
}
