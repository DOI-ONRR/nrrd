--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6 (Debian 12.6-1.pgdg100+1)
-- Dumped by pg_dump version 12.6 (Debian 12.6-1.pgdg100+1)

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
-- Name: disbursement_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.disbursement_summary AS
 SELECT a.location_type,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.distinct_commodities
   FROM (( SELECT 'State'::text AS location_type,
            period.fiscal_year,
            location.state AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND (((location.region_type)::text = 'State'::text) OR ((location.region_type)::text = 'County'::text)))
          GROUP BY location.state, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.state)
        UNION
        ( SELECT 'County'::text AS location_type,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.region_type)::text = 'County'::text))
          GROUP BY location.fips_code, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.fips_code)
        UNION
        ( SELECT 'Nationwide Federal'::text AS location_type,
            period.fiscal_year,
            'NF'::text AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
          GROUP BY 'Nationwide Federal'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Nationwide Federal'::text)
        UNION
        ( SELECT 'Naive American'::text AS location_type,
            period.fiscal_year,
            'NA'::text AS state_or_area,
            sum(disbursement.disbursement) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
          GROUP BY 'Native American'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Native American'::text)) a
  ORDER BY a.fiscal_year, a.state_or_area;


ALTER TABLE public.disbursement_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

