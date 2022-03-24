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
-- Name: fiscal_revenue_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.fiscal_revenue_summary AS
 SELECT a.location_name,
    a.location_type,
    a.land_category,
    a.fiscal_year,
    a.state_or_area,
    a.sum,
    a.distinct_commodities
   FROM ( SELECT location.offshore_region AS location_name,
            'Offshore'::text AS location_type,
            location.land_category,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_category)::text = 'Offshore'::text))
          GROUP BY location.fips_code, location.offshore_region, location.land_category, location.region_type, period.fiscal_year
        UNION
         SELECT location.state_name AS location_name,
            'State'::text AS location_type,
            location.land_category,
            period.fiscal_year,
            location.state AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.state_name)::text <> ''::text))
          GROUP BY location.state_name, 'State'::text, location.land_category, period.fiscal_year, location.state
        UNION
        ( SELECT location.location_name,
            'County'::text AS location_type,
            location.land_category,
            period.fiscal_year,
            location.fips_code AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.region_type)::text = 'County'::text))
          GROUP BY location.fips_code, location.location_name, location.land_category, period.fiscal_year
          ORDER BY period.fiscal_year, location.fips_code)
        UNION
        ( SELECT 'Nationwide Federal'::text AS location_name,
            'Nationwide Federal'::text AS location_type,
            'Nationwide Federal'::character varying AS land_category,
            period.fiscal_year,
            'Nationwide Federal'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Federal'::text))
          GROUP BY 'Nationwide Federal'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Nationwide Federal'::text)
        UNION
        ( SELECT 'Native American'::text AS location_name,
            'Native American'::text AS location_type,
            'Native American'::character varying AS land_category,
            period.fiscal_year,
            'Native American'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM (((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text = 'Native American'::text))
          GROUP BY 'Native American'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'Native American'::text)
        UNION
        ( SELECT 'Not tied to a lease'::text AS location_name,
            'State'::text AS location_type,
            'State'::character varying AS land_category,
            period.fiscal_year,
            'State'::text AS state_or_area,
            sum(revenue.revenue) AS sum,
            count(DISTINCT commodity.commodity) AS distinct_commodities
           FROM ((((public.revenue
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.commodity USING (commodity_id))
             JOIN public.fund USING (fund_id))
          WHERE (((period.period)::text = 'Fiscal Year'::text) AND ((location.land_class)::text <> 'Native American'::text) AND ((fund.source)::text = 'Not tied to a lease'::text))
          GROUP BY 'State'::text, period.fiscal_year
          ORDER BY period.fiscal_year, 'State'::text)) a
  ORDER BY a.fiscal_year, a.state_or_area;


ALTER TABLE public.fiscal_revenue_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

