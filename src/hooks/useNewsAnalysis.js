/* eslint-disable semi */
import { useState, useEffect } from "react";

/**
 * Hook to fetch AI-generated news analysis from the static analysis.json file
 */
function useNewsAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/analysis.json");

        if (!response.ok) {
          throw new Error(`Failed to load analysis: ${response.status}`);
        }

        const data = await response.json();

        // Check if analysis is empty (fallback state)
        const isEmpty =
          !data.takeaways?.length &&
          !data.trends?.length &&
          !data.engineeringPerspective?.length;

        if (isEmpty) {
          setAnalysis(null);
        } else {
          setAnalysis(data);
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError(err.message);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []); // Fetch once on mount

  return {
    analysis,
    loading,
    error,
    hasAnalysis: analysis !== null,
  };
}

export default useNewsAnalysis;
