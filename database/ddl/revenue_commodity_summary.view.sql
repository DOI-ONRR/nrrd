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
-- Name: revenue_commodity_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.revenue_commodity_summary AS
( SELECT location.fips_code AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.region_type)::text = 'Offshore'::text))
  GROUP BY location.fips_code, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT location.state AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.region_type)::text = 'County'::text))
  GROUP BY location.state, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT location.fips_code AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.region_type)::text = 'County'::text))
  GROUP BY location.fips_code, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'Nationwide Federal'::text AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
  GROUP BY 'Nationwide Federal'::text, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, 'Nationwide Federal'::text, (sum(revenue.revenue)) DESC)
UNION
( SELECT 'Native American'::text AS state_or_area,
    period.fiscal_year,
    commodity.commodity,
    sum(revenue.revenue) AS total
   FROM (((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
  WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
  GROUP BY 'Native American'::text, period.fiscal_year, commodity.commodity
  ORDER BY period.fiscal_year, 'Native American'::text, (sum(revenue.revenue)) DESC);


ALTER TABLE public.revenue_commodity_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

