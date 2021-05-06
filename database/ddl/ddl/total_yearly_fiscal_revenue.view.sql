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
-- Name: total_yearly_fiscal_revenue; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_yearly_fiscal_revenue AS
 SELECT period.period,
    period.fiscal_year AS year,
    period.fiscal_month,
    period.month,
    period.month_long,
    commodity.commodity,
    commodity.commodity_order,
    fund.revenue_type,
    location.land_type,
        CASE
            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_type)::text = 'Federal - not tied to a lease'::text) THEN 0
            WHEN ((location.land_type)::text = 'Federal - Not tied to a location'::text) THEN 1
            WHEN ((location.land_type)::text = 'Federal Onshore'::text) THEN 4
            WHEN ((location.land_type)::text = 'Federal Offshore'::text) THEN 3
            ELSE 0
        END AS sort_order,
    (sum((revenue.revenue)::double precision))::numeric(20,2) AS sum
   FROM ((((public.revenue
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.fund USING (fund_id))
     JOIN public.location USING (location_id))
  WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
           FROM (public.revenue revenue_1
             JOIN public.period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 1))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 11)
           FROM (public.revenue revenue_1
             JOIN public.period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))))
  GROUP BY period.period, period.fiscal_year, period.fiscal_month, period.month, period.month_long, commodity.commodity, commodity.commodity_order, fund.revenue_type, location.land_type,
        CASE
            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_type)::text = 'Federal - not tied to a lease'::text) THEN 0
            WHEN ((location.land_type)::text = 'Federal - Not tied to a location'::text) THEN 1
            WHEN ((location.land_type)::text = 'Federal Onshore'::text) THEN 4
            WHEN ((location.land_type)::text = 'Federal Offshore'::text) THEN 3
            ELSE 0
        END
  ORDER BY period.period, period.fiscal_year,
        CASE
            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_type)::text = 'Federal - not tied to a lease'::text) THEN 0
            WHEN ((location.land_type)::text = 'Federal - Not tied to a location'::text) THEN 1
            WHEN ((location.land_type)::text = 'Federal Onshore'::text) THEN 4
            WHEN ((location.land_type)::text = 'Federal Offshore'::text) THEN 3
            ELSE 0
        END;


ALTER TABLE public.total_yearly_fiscal_revenue OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

