import { useEffect, useState } from "react";

let cachedStatus = null;
let cachedPromise = null;

export default function useSetupStatus() {
  // initialize from cache instead of setting inside effect
  const [setupComplete, setSetupComplete] = useState(cachedStatus);
  const [loading, setLoading] = useState(cachedStatus === null);

  useEffect(() => {
    // if we already know the result, don't run the effect
    if (cachedStatus !== null) return;

    if (!cachedPromise) {
      cachedPromise = fetch("http://localhost:3000/api/setup/check-super-admin")
        .then((res) => res.json())
        .then((data) => {
          cachedStatus = data.exists;
          return cachedStatus;
        })
        .catch((err) => {
          console.error("Setup check failed:", err);
          cachedStatus = false;
          return false;
        });
    }

    cachedPromise.then((status) => {
      setSetupComplete(status);
      setLoading(false);
    });
  }, []);

  return { setupComplete, loading };
}
