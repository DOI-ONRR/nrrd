--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-0ubuntu0.21.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: download_calendar_year_revenue; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.download_calendar_year_revenue AS
 SELECT period.period_date AS "Date",
    period.calendar_year AS "Calendar Year",
        CASE
            WHEN ((location.region_type)::text = 'County'::text) THEN location.fips_code
            ELSE ''::character varying
        END AS "FIPS Code",
    location.state_name AS "State",
    location.county AS "County",
    location.land_class AS "Land Class",
    location.land_category AS "Land Category",
    location.offshore_region AS "Offshore Region",
    commodity.mineral_lease_type AS "Mineral Lease Type",
    commodity.commodity AS "Commodity",
    commodity.product AS "Product",
    fund.revenue_type AS "Revenue Type",
    revenue.revenue AS "Revenue"
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((period.period)::text = 'Calendar Year'::text)
  ORDER BY period.period_date;


ALTER TABLE public.download_calendar_year_revenue OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

