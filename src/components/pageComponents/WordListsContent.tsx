'use client';

import React, { useState, useTransition } from 'react';
import { Word, WordOwner, WordSet } from '../../actions/types';
import { deleteWordList } from '../../actions/deleteWordList';
import { promoteWordList } from '../../actions/promoteWordList';
import { createWordList } from '../../actions/createWordList';
import { checkSpelling } from '../../utils/spellCheck';
import { Modal } from '../modal/Modal';
import styles from './WordListsContent.module.css';

interface WordListsContentProps {
  initialWordSets: WordSet[];
  initialWords: Word[];
  initialAutoWordSet: string[];
}

type ListEntry = { type: 'manual'; wordSet: WordSet } | { type: 'auto'; wordIds: string[] };

const getEntryWordIds = (entry: ListEntry): string[] => (entry.type === 'auto' ? entry.wordIds : entry.wordSet.wordIds);

// ─── Create List Form ──────────────────────────────────────────────────────────

interface CreateListFormProps {
  allWords: Word[];
  onCancel: () => void;
  onCreated: (newWordSet: WordSet, newWords: Word[]) => void;
}

function CreateListForm({ allWords, onCancel, onCreated }: CreateListFormProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [newWordInput, setNewWordInput] = useState('');
  const [pendingNewWords, setPendingNewWords] = useState<string[]>([]);
  const [newWordError, setNewWordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const userWords = allWords.filter(w => w.owner === WordOwner.USER);
  const year3And4Words = allWords.filter(w => w.yearGroup === 'year3_4');
  const year5And6Words = allWords.filter(w => w.yearGroup === 'year5_6');

  const filterWords = (words: Word[]) =>
    searchQuery ? words.filter(w => w.word.toLowerCase().includes(searchQuery.toLowerCase())) : words;

  const toggleWord = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddNewWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewWordError(null);
    const trimmed = newWordInput.trim();

    if (!trimmed) {
      setNewWordError('Word needs some letters');
      return;
    }
    if (!/^[A-Za-z][a-z]*$/.test(trimmed)) {
      setNewWordError('Letters only, only first letter can be uppercase, no spaces');
      return;
    }
    const alreadyPending = pendingNewWords.some(w => w.toLowerCase() === trimmed.toLowerCase());
    const alreadyExists = allWords.some(w => w.word.toLowerCase() === trimmed.toLowerCase());
    if (alreadyPending || alreadyExists) {
      setNewWordError('Word already in list');
      return;
    }

    const spellResult = await checkSpelling(trimmed);
    if (!spellResult.valid) {
      setNewWordError('Word not found in dictionary');
      return;
    }

    setPendingNewWords(prev => [...prev, trimmed]);
    setNewWordInput('');
  };

  const handleSubmit = () => {
    if (selectedIds.size === 0 && pendingNewWords.length === 0) {
      setSubmitError('Select or add at least one word');
      return;
    }
    setSubmitError(null);

    // Build optimistic data for immediate UI update
    const newWords: Word[] = pendingNewWords
      .filter(t => !allWords.some(w => w.word.toLowerCase() === t.toLowerCase()))
      .map(text => ({
        word: text,
        wordId: crypto.randomUUID(),
        owner: WordOwner.USER,
        results: [],
      }));

    const alreadyExistingIds = pendingNewWords
      .filter(t => allWords.some(w => w.word.toLowerCase() === t.toLowerCase()))
      .map(t => allWords.find(w => w.word.toLowerCase() === t.toLowerCase())?.wordId)
      .filter((id): id is string => id !== undefined);

    const allWordIds = [...Array.from(selectedIds), ...newWords.map(w => w.wordId), ...alreadyExistingIds];
    const uniqueWordIds = Array.from(new Set(allWordIds));

    const optimisticWordSet: WordSet = {
      wordSetId: crypto.randomUUID(),
      createdAt: Date.now(),
      wordIds: uniqueWordIds,
    };

    onCreated(optimisticWordSet, newWords);

    startTransition(async () => {
      await createWordList(Array.from(selectedIds), pendingNewWords);
    });
  };

  const totalSelected = selectedIds.size + pendingNewWords.length;

  const renderWordGroup = (label: string, words: Word[]) => {
    const filtered = filterWords(words);
    if (filtered.length === 0) return null;
    return (
      <div className={styles.wordGroup}>
        <p className={styles.wordGroupLabel}>{label}</p>
        {filtered.map(word => (
          <label key={word.wordId} className={styles.wordCheckRow}>
            <input type="checkbox" checked={selectedIds.has(word.wordId)} onChange={() => toggleWord(word.wordId)} />
            {word.word}
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="pageContainer">
      {/* Add a brand-new word */}
      <div className={styles.newWordSection}>
        <form className={styles.newWordForm} onSubmit={handleAddNewWord}>
          <label htmlFor="new-word-input">
            Add a new word
            <input
              id="new-word-input"
              type="text"
              value={newWordInput}
              onChange={e => setNewWordInput(e.target.value)}
              autoCapitalize="off"
              autoComplete="off"
              disabled={isPending}
            />
          </label>
          {newWordError && (
            <p className={styles.error} role="alert">
              {newWordError}
            </p>
          )}
          <button type="submit" disabled={isPending}>
            Add
          </button>
        </form>

        {pendingNewWords.length > 0 && (
          <ul className={styles.pendingList}>
            {pendingNewWords.map(w => (
              <li key={w} className={styles.pendingItem}>
                <span>{w}</span>
                <button
                  type="button"
                  onClick={() => setPendingNewWords(prev => prev.filter(x => x !== w))}
                  disabled={isPending}
                  aria-label={`Remove ${w}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Select from existing words */}
      <div className={styles.existingWordsSection}>
        <p className={styles.sectionLabel}>Select existing words</p>
        <input
          type="search"
          placeholder="Search words..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.wordGroupList}>
          {renderWordGroup('My Words', userWords)}
          {renderWordGroup('Year 3/4', year3And4Words)}
          {renderWordGroup('Year 5/6', year5And6Words)}
          {filterWords([...userWords, ...year3And4Words, ...year5And6Words]).length === 0 && (
            <p className={styles.noResults}>No words match your search</p>
          )}
        </div>
      </div>

      {submitError && (
        <p className={styles.error} role="alert">
          {submitError}
        </p>
      )}

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} disabled={isPending}>
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Creating...' : `Create List${totalSelected > 0 ? ` (${totalSelected})` : ''}`}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function WordListsContent({ initialWordSets, initialWords, initialAutoWordSet }: WordListsContentProps) {
  const [wordSets, setWordSets] = useState<WordSet[]>(initialWordSets);
  const [allWords, setAllWords] = useState<Word[]>(initialWords);
  const [viewIndex, setViewIndex] = useState(0);

  const entries: ListEntry[] = [
    ...(initialAutoWordSet.length > 0 ? [{ type: 'auto' as const, wordIds: initialAutoWordSet }] : []),
    ...wordSets.map(ws => ({ type: 'manual' as const, wordSet: ws })),
  ];
  const [listToDelete, setListToDelete] = useState<WordSet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [, startTransition] = useTransition();

  if (isCreating) {
    return (
      <CreateListForm
        allWords={allWords}
        onCancel={() => setIsCreating(false)}
        onCreated={(newWordSet, newWords) => {
          setAllWords(prev => [...prev, ...newWords]);
          setWordSets(prev => [newWordSet, ...prev]);
          setViewIndex(0);
          setIsCreating(false);
        }}
      />
    );
  }

  const currentEntry = entries[viewIndex];
  const currentWordIds = currentEntry ? getEntryWordIds(currentEntry) : [];
  const resolvedWords = currentWordIds
    .map(id => allWords.find(w => w.wordId === id))
    .filter((w): w is Word => w !== undefined);

  const firstCustomIndex = entries.findIndex(e => e.type === 'manual');
  const isCurrentCustom = currentEntry?.type === 'manual' && viewIndex === firstCustomIndex;

  const handleDeleteConfirm = () => {
    if (!listToDelete) return;
    const id = listToDelete.wordSetId;
    const entryIndex = entries.findIndex(e => e.type === 'manual' && e.wordSet.wordSetId === id);
    setListToDelete(null);
    setWordSets(prev => prev.filter(ws => ws.wordSetId !== id));
    setViewIndex(prev => {
      if (entryIndex < prev) return prev - 1;
      if (entryIndex === prev) return Math.max(0, prev - 1);
      return prev;
    });
    startTransition(async () => {
      await deleteWordList(id);
    });
  };

  const handlePromote = () => {
    if (!currentEntry || currentEntry.type !== 'manual' || isCurrentCustom) return;
    const id = currentEntry.wordSet.wordSetId;
    setWordSets(prev => {
      const target = prev.find(ws => ws.wordSetId === id)!;
      const rest = prev.filter(ws => ws.wordSetId !== id);
      return [target, ...rest];
    });
    setViewIndex(firstCustomIndex);
    startTransition(async () => {
      await promoteWordList(id);
    });
  };

  if (entries.length === 0) {
    return (
      <div className="pageContainer">
        <p>No word lists yet.</p>
        <button type="button" onClick={() => setIsCreating(true)}>
          + New List
        </button>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <div className={styles.controlsContainer}>
        {/* Navigation row */}
        <div className={styles.navRow}>
          <button
            type="button"
            onClick={() => setViewIndex(v => v - 1)}
            disabled={viewIndex === 0}
            aria-label="Previous list"
          >
            ◀
          </button>
          {viewIndex + 1} / {entries.length}
          <button
            type="button"
            onClick={() => setViewIndex(v => v + 1)}
            disabled={viewIndex === entries.length - 1}
            aria-label="Next list"
          >
            ▶
          </button>
        </div>

        {/* Type label + current badge */}
        <div className={styles.labelRow}>
          <span className={styles.typeBadge}>{currentEntry?.type === 'auto' ? 'Auto' : 'Custom'}</span>
          {currentEntry?.type === 'manual' && isCurrentCustom && (
            <span className={styles.currentBadge}>Current Custom List</span>
          )}
        </div>

        {/* Action buttons */}
        <div className={styles.actionRow}>
          <button
            type="button"
            disabled={currentEntry?.type !== 'manual'}
            onClick={() => currentEntry?.type === 'manual' && setListToDelete(currentEntry.wordSet)}
          >
            🗑️
          </button>
          <button type="button" onClick={() => setIsCreating(true)}>
            ➕
          </button>
          <button type="button" disabled={isCurrentCustom || currentEntry?.type !== 'manual'} onClick={handlePromote}>
            ⭐️
          </button>
        </div>
      </div>

      {/* Word list */}
      {resolvedWords.length === 0 ? (
        <p>This list is empty.</p>
      ) : (
        <ul className={styles.wordList}>
          {resolvedWords.map(word => (
            <li key={word.wordId} className={styles.wordItem}>
              {word.word}
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={Boolean(listToDelete)}
        setOpen={(open: boolean) => {
          if (!open) setListToDelete(null);
        }}
        actions={
          <>
            <button type="button" onClick={handleDeleteConfirm}>
              Confirm
            </button>
            <button type="button" onClick={() => setListToDelete(null)}>
              Cancel
            </button>
          </>
        }
      >
        <p>
          Delete this list? It contains {listToDelete?.wordIds.length ?? 0} word
          {(listToDelete?.wordIds.length ?? 0) !== 1 ? 's' : ''}.
        </p>
      </Modal>
    </div>
  );
}
