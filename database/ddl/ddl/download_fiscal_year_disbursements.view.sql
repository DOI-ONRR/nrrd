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
-- Name: download_fiscal_year_disbursements; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.download_fiscal_year_disbursements AS
 SELECT period.period,
    period.fiscal_year,
    period.period_date,
    location.location_name,
    location.fips_code,
    location.state,
    location.state_name,
    location.county,
    location.land_class,
    location.land_category,
    location.land_type,
    location.region_type,
    location.offshore_region,
    commodity.commodity,
    commodity.product,
    fund.recipient,
    fund.fund_class,
    fund.fund_type,
    fund.source,
    disbursement.disbursement
   FROM ((((public.disbursement
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((period.period)::text = 'Fiscal Year'::text)
  ORDER BY period.period_date;


ALTER TABLE public.download_fiscal_year_disbursements OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

