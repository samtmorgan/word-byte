import React from 'react';
import { getUserWords } from '../../actions/getUserWords';
import MyWordsContent from '../../components/pageComponents/MyWordsContent';

export default async function MyWordsPage() {
  const words = await getUserWords();

  return <MyWordsContent initialWords={words} />;
}
