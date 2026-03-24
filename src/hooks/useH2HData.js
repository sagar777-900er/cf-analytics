import { useState, useCallback } from 'react';

const API_BASE = '/api';

export function useH2HData() {
  const [dataUser1, setDataUser1] = useState(null);
  const [dataUser2, setDataUser2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [handles, setHandles] = useState({ handle1: '', handle2: '' });

  const analyzeH2H = useCallback(async (handle1, handle2) => {
    if (!handle1.trim() || !handle2.trim()) {
      setError('Please enter both Codeforces handles');
      return;
    }

    setLoading(true);
    setError('');
    setDataUser1(null);
    setDataUser2(null);
    setHandles({ handle1: handle1.trim(), handle2: handle2.trim() });

    try {
      const fetchUserData = async (handle) => {
        const [userRes, subRes] = await Promise.allSettled([
          fetch(`${API_BASE}/user/${handle}`).then((r) => r.json()),
          fetch(`${API_BASE}/submissions/${handle}`).then((r) => r.json()),
        ]);
        
        if (userRes.status === 'fulfilled' && userRes.value.success) {
          return {
            userData: userRes.value.data,
            submissions: subRes.status === 'fulfilled' && subRes.value.success ? subRes.value.data : null,
          };
        } else {
          throw new Error(userRes.value?.error || `Failed to fetch user ${handle}`);
        }
      };

      const [res1, res2] = await Promise.allSettled([
        fetchUserData(handle1),
        fetchUserData(handle2)
      ]);

      if (res1.status === 'fulfilled' && res2.status === 'fulfilled') {
        setDataUser1(res1.value);
        setDataUser2(res2.value);
      } else {
        setError(res1.reason?.message || res2.reason?.message || 'Failed to fetch comparison data.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  }, []);

  return {
    dataUser1,
    dataUser2,
    loading,
    error,
    handles,
    analyzeH2H,
  };
}
