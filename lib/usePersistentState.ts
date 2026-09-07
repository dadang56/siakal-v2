'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { getStoredItem, restoreFromIDB, setStoredItem } from './dbStorage';

export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setValue(getStoredItem(key, fallback));
    restoreFromIDB(key, fallback).then((stored) => {
      if (active) {
        setValue(stored);
        setReady(true);
      }
    });
    return () => { active = false; };
  }, [key]);

  const persist = useCallback(async (next: SetStateAction<T>) => {
    const resolved = typeof next === 'function' ? (next as (previous: T) => T)(value) : next;
    setSaving(true);
    setError('');
    const saved = await setStoredItem(key, resolved);
    setSaving(false);
    if (!saved) {
      setError('Penyimpanan gagal. Ruang penyimpanan browser mungkin penuh atau diblokir.');
      return false;
    }
    setValue(resolved);
    return true;
  }, [key, value]);

  return { value, setValue: persist as Dispatch<SetStateAction<T>>, persist, ready, saving, error };
}
