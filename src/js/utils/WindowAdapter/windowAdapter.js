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
    if (typeof window === "undefined") return;

    const searchString = search
      ? search.startsWith("?")
        ? search
        : `?${search}`
      : "";

    // Gatsby's `navigate()` automatically applies `pathPrefix` in prefixed builds.
    // `window.location.pathname` already includes the prefix, so we must strip it
    // to avoid ending up with a doubled prefix like:
    //   /sites/<branch>/sites/<branch>/explore
    const pathPrefix =
      typeof __PATH_PREFIX__ !== "undefined" ? __PATH_PREFIX__ : "";

    const stripPrefix = (pathname) => {
      if (!pathPrefix) return pathname;
      return pathname.startsWith(pathPrefix)
        ? pathname.slice(pathPrefix.length) || "/"
        : pathname;
    };

    const pathname = stripPrefix(window.location.pathname);

    // 👈 IMPORTANT: keep the current pathname, just change the query
    const newUrl = `${pathname}${searchString}${window.location.hash || ""}`;

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