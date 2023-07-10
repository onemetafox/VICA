// source https://github.com/TechToThePeople/react-ipgeolocation

import { useEffect, useState } from 'react';

export const useGeoLocation = () => {
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(true);

  const api = 'https://api.country.is';

  useEffect(() => {
    async function fetchAPI() {
      setIsLoading(true);
      await fetch(api)
        .then((res) => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then((res) => {
          if (res && res.country) setCountry(res.country);
        })
        .catch((err) => setError(err))
        .then(() => setIsLoading(false))
        .catch((err) => setError(err));
    }
    fetchAPI();
  }, []);

  return { country, error, loading };
};
