import { useState, useEffect } from "react";
import App from "./App.jsx";
import PageLoader from "./components/ui/PageLoader.jsx";

export default function Root() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasSeenLoader = localStorage.getItem("appLoadedOnce");

    if (!hasSeenLoader) {
      const id = setTimeout(() => {
        setShowLoader(true);

        setTimeout(() => {
          setShowLoader(false);
          localStorage.setItem("appLoadedOnce", "true");
        }, 1500);
      }, 0);

      return () => clearTimeout(id);
    }
  }, []);

  return (
    <>
      {showLoader && <PageLoader message="Initializing app..." />}
      <App />
    </>
  );
}