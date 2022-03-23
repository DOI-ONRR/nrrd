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
-- Name: revenue_type_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.revenue_type_summary AS
( SELECT period.period,
    location.fips_code AS location,
        CASE
            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
            ELSE period.calendar_year
        END AS year,
    commodity.commodity,
    fund.revenue_type,
    sum(revenue.revenue) AS total
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((location.land_category)::text = 'Offshore'::text)
  GROUP BY period.period, location.fips_code, period.fiscal_year, period.calendar_year, commodity.commodity, fund.revenue_type
  ORDER BY period.fiscal_year, location.fips_code)
UNION
( SELECT period.period,
    location.state AS location,
        CASE
            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
            ELSE period.calendar_year
        END AS year,
    commodity.commodity,
    fund.revenue_type,
    sum(revenue.revenue) AS total
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((location.state)::text <> ''::text)
  GROUP BY period.period, location.state, period.fiscal_year, period.calendar_year, commodity.commodity, fund.revenue_type
  ORDER BY period.fiscal_year, location.state)
UNION
( SELECT period.period,
    location.fips_code AS location,
        CASE
            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
            ELSE period.calendar_year
        END AS year,
    commodity.commodity,
    fund.revenue_type,
    sum(revenue.revenue) AS total
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((location.region_type)::text = 'County'::text)
  GROUP BY period.period, location.fips_code, period.fiscal_year, period.calendar_year, commodity.commodity, fund.revenue_type
  ORDER BY period.fiscal_year, location.fips_code)
UNION
( SELECT period.period,
    'NF'::text AS location,
        CASE
            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
            ELSE period.calendar_year
        END AS year,
    commodity.commodity,
    fund.revenue_type,
    sum(revenue.revenue) AS total
   FROM ((((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((location.land_class)::text = 'Federal'::text)
  GROUP BY period.period, 'Nationwide Federal'::text, period.fiscal_year, period.calendar_year, commodity.commodity, fund.revenue_type
  ORDER BY period.fiscal_year, 'Nationwide Federal'::text, (sum(revenue.revenue)) DESC)
UNION
( SELECT period.period,
    'NA'::text AS location,
        CASE
            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
            ELSE period.calendar_year
        END AS year,
    commodity.commodity,
    fund.revenue_type,
    sum(revenue.revenue) AS total
   FROM ((((public.revenue
     JOIN public.location USING (location_id))
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((location.land_class)::text = 'Native American'::text)
  GROUP BY period.period, 'Native American'::text, period.fiscal_year, period.calendar_year, commodity.commodity, fund.revenue_type
  ORDER BY period.fiscal_year, period.calendar_year, 'Native American'::text, (sum(revenue.revenue)) DESC);


ALTER TABLE public.revenue_type_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

