import { useState, useEffect, Dispatch, SetStateAction } from 'react';

import * as SecureStore from 'expo-secure-store';

type Response<T> = [
  T,
  Dispatch<SetStateAction<T>>
];

function usePersistedState<T>(key: string, initialState: T): Response<T> {
  const [state, setState] = useState<any>(() => {});

  useEffect(() => {
    async function loadStoragedValue() {
      const storageValue = await SecureStore.getItemAsync(key);
  
      if (storageValue) {
        setState(JSON.parse(storageValue));
      } else {
        return initialState;
      };
    };

    loadStoragedValue();
  }, [key]);

  function setPersistedState(value: {}) {
    SecureStore.setItemAsync(key, JSON.stringify(value));

    setState(value)
  };

  return [state, setPersistedState];
};

export default usePersistedState;