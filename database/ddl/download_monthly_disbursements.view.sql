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
-- Name: download_monthly_disbursements; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.download_monthly_disbursements AS
 SELECT period.period_date AS "Date",
    fund.fund_type AS "Fund Type",
    location.land_category AS "Land Category",
    fund.disbursement_type AS "Disbursement Type",
    location.state_name AS "State",
    location.county AS "County",
    fund.revenue_type AS "Category",
    commodity.commodity AS "Commodity",
    disbursement.disbursement AS "Disbursement"
   FROM ((((public.disbursement
     JOIN public.period USING (period_id))
     JOIN public.location USING (location_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
  WHERE ((period.period)::text = 'Monthly'::text)
  ORDER BY period.period_date;


ALTER TABLE public.download_monthly_disbursements OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

