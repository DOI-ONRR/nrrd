import React, { useEffect, useState, useCallback } from "react";
import { navigate } from "gatsby";

export default function GatsbyQueryParamAdapter({ children }) {
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") {
      // SSR-safe default; real location only exists in browser
      return { pathname: "/", search: "", hash: "" };
    }
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    };
  });

  // Keep our location state in sync with browser history changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      });
    };

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const updateUrl = useCallback((search, replace) => {
    console.log('updateUrl')
    if (typeof window === "undefined") return;

    const searchString = search
      ? search.startsWith("?")
        ? search
        : `?${search}`
      : "";

    // 👈 IMPORTANT: keep the current pathname, just change the query
    const newUrl = `${window.location.pathname}${searchString}${
      window.location.hash || ""
    }`;

    navigate(newUrl, { replace });
  }, []);

  const push = ({ search }) => updateUrl(search, false);
  const replaceLocation = ({ search }) => updateUrl(search, true);

  return children({
    location,
    push,
    replace: replaceLocation,
  });
}