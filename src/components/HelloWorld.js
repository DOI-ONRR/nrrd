import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const MY_QUERY = gql`
  query {
    county_lookup(where: {fips_code: {_eq: "27053"}}) {
      fips_code
      county
      state
    }
  }
`;

const HelloWorld = () => {
  const { data, loading, error } = useQuery(MY_QUERY, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  useEffect(() => {
    console.log("🌍 Environment: ", typeof window !== "undefined" ? "Browser" : "Server");
    console.log("🚀 useQuery loading:", loading);
    console.log("📡 useQuery data:", data);
    console.log("❌ useQuery error:", error);
  }, [loading, data, error]);

  if (loading) return <p>Loading HelloWorld...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.county_lookup.map(county => (
        <div key={county.fips_code}>{county.county}, {county.state}</div>
      ))}
    </div>
  );
};

export default HelloWorld;