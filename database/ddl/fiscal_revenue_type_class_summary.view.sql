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
-- Name: fiscal_revenue_type_class_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.fiscal_revenue_type_class_summary AS
 SELECT a.year,
    a.revenue_type,
    a.type_order,
    a.land_class,
    a.class_order,
    sum(a.sum) AS sum
   FROM ( SELECT t1.year,
            t1.revenue_type,
            t1.type_order,
            t2.land_class,
            t2.class_order,
                CASE
                    WHEN (t1.land_class = t2.land_class) THEN t1.sum
                    ELSE NULL::numeric
                END AS sum
           FROM (( SELECT period.fiscal_year AS year,
                    fund.revenue_type,
                        CASE
                            WHEN ((fund.revenue_type)::text = 'Royalties'::text) THEN 1
                            WHEN ((fund.revenue_type)::text = 'Bonus'::text) THEN 2
                            WHEN ((fund.revenue_type)::text = 'Rents'::text) THEN 3
                            WHEN ((fund.revenue_type)::text = 'Inspection Fees'::text) THEN 4
                            WHEN ((fund.revenue_type)::text = 'Civil Penalties'::text) THEN 5
                            WHEN ((fund.revenue_type)::text = 'Other Revenues'::text) THEN 6
                            ELSE NULL::integer
                        END AS type_order,
                    (location.land_type)::text AS land_class,
                        CASE
                            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
                            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 1
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 3
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 5
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 4
                            ELSE 0
                        END AS class_order,
                    sum(revenue.revenue) AS sum
                   FROM (((public.revenue
                     JOIN public.period USING (period_id))
                     JOIN public.location USING (location_id))
                     JOIN public.fund USING (fund_id))
                  WHERE (((period.period)::text = 'Fiscal Year'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
                           FROM (public.revenue revenue_1
                             JOIN public.period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
                           FROM (public.revenue revenue_1
                             JOIN public.period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))))
                  GROUP BY period.fiscal_year, fund.revenue_type, location.land_type, location.land_class, location.land_category) t1
             LEFT JOIN ( SELECT DISTINCT period.fiscal_year AS year,
                    (location.land_type)::text AS land_class,
                        CASE
                            WHEN ((location.land_class)::text = 'Native American'::text) THEN 2
                            WHEN ((location.land_category)::text = 'Not Tied to a Lease'::text) THEN 1
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = ''::text)) THEN 3
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Onshore'::text)) THEN 5
                            WHEN (((location.land_class)::text = 'Federal'::text) AND ((location.land_category)::text = 'Offshore'::text)) THEN 4
                            ELSE 0
                        END AS class_order
                   FROM ((public.revenue
                     JOIN public.period USING (period_id))
                     JOIN public.location USING (location_id))
                  WHERE (((period.period)::text = 'Fiscal Year'::text) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
                           FROM (public.revenue revenue_1
                             JOIN public.period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))) AND (period.fiscal_year > ( SELECT (max(period_1.fiscal_year) - 10)
                           FROM (public.revenue revenue_1
                             JOIN public.period period_1 USING (period_id))
                          WHERE (period_1.fiscal_month = 12))))
                  GROUP BY period.fiscal_year, location.land_type, location.land_class, location.land_category) t2 USING (year))) a
  GROUP BY a.year, a.revenue_type, a.type_order, a.land_class, a.class_order
  ORDER BY a.year, a.type_order, a.class_order;


ALTER TABLE public.fiscal_revenue_type_class_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

