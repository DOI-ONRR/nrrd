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
-- Name: revenue_type_class_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.revenue_type_class_summary AS
 SELECT a.period,
    a.year,
    a.revenue_type,
    a.revenue_type_order,
    a.commodity,
    a.land_type,
    a.land_type_order,
    sum(a.sum) AS total
   FROM ( SELECT t1.period,
            t1.year,
            t1.revenue_type,
            t1.revenue_type_order,
            t1.commodity,
            t2.land_type,
            t2.land_type_order,
                CASE
                    WHEN ((t1.land_type)::text = (t2.land_type)::text) THEN t1.sum
                    ELSE NULL::numeric
                END AS sum
           FROM (( SELECT period.period,
                        CASE
                            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                            ELSE period.calendar_year
                        END AS year,
                    fund.revenue_type,
                        CASE
                            WHEN ((fund.revenue_type)::text = 'Royalties'::text) THEN 1
                            WHEN ((fund.revenue_type)::text = 'Bonus'::text) THEN 2
                            WHEN ((fund.revenue_type)::text = 'Rents'::text) THEN 3
                            WHEN ((fund.revenue_type)::text = 'Inspection Fees'::text) THEN 4
                            WHEN ((fund.revenue_type)::text = 'Civil Penalties'::text) THEN 5
                            WHEN ((fund.revenue_type)::text = 'Other Revenues'::text) THEN 6
                            ELSE NULL::integer
                        END AS revenue_type_order,
                    location.land_type,
                        CASE
                            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
                            WHEN ((location.land_type)::text = 'Federal - not tied to a lease'::text) THEN 1
                            WHEN ((location.land_type)::text = 'Federal - not tied to a location'::text) THEN 3
                            WHEN ((location.land_type)::text = 'Federal onshore'::text) THEN 5
                            WHEN ((location.land_type)::text = 'Federal offshore'::text) THEN 4
                            ELSE 0
                        END AS land_type_order,
                    commodity.commodity,
                    sum(revenue.revenue) AS sum
                   FROM ((((public.revenue
                     JOIN public.period USING (period_id))
                     JOIN public.location USING (location_id))
                     JOIN public.commodity USING (commodity_id))
                     JOIN public.fund USING (fund_id))
                  GROUP BY period.period, period.fiscal_year, period.calendar_year, fund.revenue_type, location.land_type, commodity.commodity) t1
             LEFT JOIN ( SELECT DISTINCT period.period,
                        CASE
                            WHEN ((period.period)::text = 'Fiscal Year'::text) THEN period.fiscal_year
                            ELSE period.calendar_year
                        END AS year,
                    location.land_type,
                        CASE
                            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
                            WHEN ((location.land_type)::text = 'Federal - not tied to a lease'::text) THEN 1
                            WHEN ((location.land_type)::text = 'Federal - not tied to a location'::text) THEN 3
                            WHEN ((location.land_type)::text = 'Federal onshore'::text) THEN 5
                            WHEN ((location.land_type)::text = 'Federal offshore'::text) THEN 4
                            ELSE 0
                        END AS land_type_order
                   FROM ((public.revenue
                     JOIN public.period USING (period_id))
                     JOIN public.location USING (location_id))
                  GROUP BY period.period, period.fiscal_year, period.calendar_year, location.land_type) t2 USING (year, period))) a
  GROUP BY a.period, a.year, a.revenue_type, a.revenue_type_order, a.land_type, a.land_type_order, a.commodity
  ORDER BY a.year DESC, a.revenue_type_order, a.land_type_order;


ALTER TABLE public.revenue_type_class_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

