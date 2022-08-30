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
-- Name: query_tool_revenue_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.query_tool_revenue_data AS
 SELECT 'Fiscal Year'::character varying(255) AS period,
    location.location_name,
    location.location_order,
    location.land_type,
    location.region_type,
    location.district_type,
    location.state_name,
    location.state,
    location.county,
    location.offshore_region,
    commodity.commodity,
    commodity.commodity_order,
    fund.source AS revenue_type,
    period.fiscal_year,
    period.calendar_year,
        CASE
            WHEN ((location.county)::text <> ''::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            ELSE NULL::text
        END AS county_name,
    sum(
        CASE
            WHEN (period.fiscal_year = 2003) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2003,
    sum(
        CASE
            WHEN (period.fiscal_year = 2004) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2004,
    sum(
        CASE
            WHEN (period.fiscal_year = 2005) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2005,
    sum(
        CASE
            WHEN (period.fiscal_year = 2006) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2006,
    sum(
        CASE
            WHEN (period.fiscal_year = 2007) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2007,
    sum(
        CASE
            WHEN (period.fiscal_year = 2008) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2008,
    sum(
        CASE
            WHEN (period.fiscal_year = 2009) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2009,
    sum(
        CASE
            WHEN (period.fiscal_year = 2010) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2010,
    sum(
        CASE
            WHEN (period.fiscal_year = 2011) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2011,
    sum(
        CASE
            WHEN (period.fiscal_year = 2012) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2012,
    sum(
        CASE
            WHEN (period.fiscal_year = 2013) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2013,
    sum(
        CASE
            WHEN (period.fiscal_year = 2014) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2014,
    sum(
        CASE
            WHEN (period.fiscal_year = 2015) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2015,
    sum(
        CASE
            WHEN (period.fiscal_year = 2016) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2016,
    sum(
        CASE
            WHEN (period.fiscal_year = 2017) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2017,
    sum(
        CASE
            WHEN (period.fiscal_year = 2018) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2018,
    sum(
        CASE
            WHEN (period.fiscal_year = 2019) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2019,
    sum(
        CASE
            WHEN (period.fiscal_year = 2020) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2020,
        CASE
            WHEN ((location.region_type)::text = 'County'::text) THEN location.state_name
            WHEN ((location.region_type)::text = 'Offshore'::text) THEN (concat('Offshore ', location.location_name))::character varying
            ELSE location.location_name
        END AS state_offshore_name
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  GROUP BY period.period, location.location_name, location.location_order, location.land_type, location.region_type, location.district_type, location.state_name, location.state, location.county, location.offshore_region, commodity.commodity, commodity.commodity_order, fund.source, period.fiscal_year, period.calendar_year
UNION
 SELECT 'Calendar Year'::character varying(255) AS period,
    location.location_name,
    location.location_order,
    location.land_type,
    location.region_type,
    location.district_type,
    location.state_name,
    location.state,
    location.county,
    location.offshore_region,
    commodity.commodity,
    commodity.commodity_order,
    fund.source AS revenue_type,
    period.fiscal_year,
    period.calendar_year,
        CASE
            WHEN ((location.county)::text <> ''::text) THEN concat(location.state_name, ', ', location.county, ' ', location.district_type)
            ELSE NULL::text
        END AS county_name,
    sum(
        CASE
            WHEN (period.calendar_year = 2003) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2003,
    sum(
        CASE
            WHEN (period.calendar_year = 2004) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2004,
    sum(
        CASE
            WHEN (period.calendar_year = 2005) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2005,
    sum(
        CASE
            WHEN (period.calendar_year = 2006) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2006,
    sum(
        CASE
            WHEN (period.calendar_year = 2007) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2007,
    sum(
        CASE
            WHEN (period.calendar_year = 2008) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2008,
    sum(
        CASE
            WHEN (period.calendar_year = 2009) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2009,
    sum(
        CASE
            WHEN (period.calendar_year = 2010) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2010,
    sum(
        CASE
            WHEN (period.calendar_year = 2011) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2011,
    sum(
        CASE
            WHEN (period.calendar_year = 2012) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2012,
    sum(
        CASE
            WHEN (period.calendar_year = 2013) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2013,
    sum(
        CASE
            WHEN (period.calendar_year = 2014) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2014,
    sum(
        CASE
            WHEN (period.calendar_year = 2015) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2015,
    sum(
        CASE
            WHEN (period.calendar_year = 2016) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2016,
    sum(
        CASE
            WHEN (period.calendar_year = 2017) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2017,
    sum(
        CASE
            WHEN (period.calendar_year = 2018) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2018,
    sum(
        CASE
            WHEN (period.calendar_year = 2019) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2019,
    sum(
        CASE
            WHEN (period.fiscal_year = 2020) THEN (revenue.revenue)::double precision
            ELSE ((0)::real)::double precision
        END) AS y2020,
        CASE
            WHEN ((location.region_type)::text = 'County'::text) THEN location.state_name
            WHEN ((location.region_type)::text = 'Offshore'::text) THEN (concat('Offshore ', location.location_name))::character varying
            ELSE location.location_name
        END AS state_offshore_name
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((period.period)::text = 'Calendar Year'::text)
  GROUP BY period.period, location.location_name, location.location_order, location.land_type, location.region_type, location.district_type, location.state_name, location.state, location.county, location.offshore_region, commodity.commodity, commodity.commodity_order, fund.source, period.fiscal_year, period.calendar_year;


ALTER TABLE public.query_tool_revenue_data OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

