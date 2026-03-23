import { useState, useCallback } from 'react';

const API_BASE = '/api';

export function useCodeforcesData() {
  const [userData, setUserData] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [ratingHistory, setRatingHistory] = useState(null);
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentHandle, setCurrentHandle] = useState('');

  const analyze = useCallback(async (handle) => {
    if (!handle.trim()) {
      setError('Please enter a Codeforces handle');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);
    setSubmissions(null);
    setRatingHistory(null);
    setTraining(null);
    setCurrentHandle(handle.trim());

    try {
      // Fetch all data in parallel
      const [userRes, subRes, ratingRes, trainRes] = await Promise.allSettled([
        fetch(`${API_BASE}/user/${handle}`).then((r) => r.json()),
        fetch(`${API_BASE}/submissions/${handle}`).then((r) => r.json()),
        fetch(`${API_BASE}/rating/${handle}`).then((r) => r.json()),
        fetch(`${API_BASE}/training/${handle}`).then((r) => r.json()),
      ]);

      if (userRes.status === 'fulfilled' && userRes.value.success) {
        setUserData(userRes.value.data);
      } else {
        const msg =
          userRes.status === 'fulfilled'
            ? userRes.value.error
            : 'Failed to fetch user';
        setError(msg);
        setLoading(false);
        return;
      }

      if (subRes.status === 'fulfilled' && subRes.value.success) {
        setSubmissions(subRes.value.data);
      }

      if (ratingRes.status === 'fulfilled' && ratingRes.value.success) {
        setRatingHistory(ratingRes.value.data);
      }

      if (trainRes.status === 'fulfilled' && trainRes.value.success) {
        setTraining(trainRes.value.data);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  }, []);

  return {
    userData,
    submissions,
    ratingHistory,
    training,
    loading,
    error,
    currentHandle,
    analyze,
  };
}
