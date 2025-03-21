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
-- Name: total_monthly_fiscal_disbursement_last_two_years; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.total_monthly_fiscal_disbursement_last_two_years AS
 SELECT period.period,
    period.calendar_year AS year,
    period.month,
    period.month_long,
    period.period_date,
    location.land_type,
    fund.recipient,
    fund.source,
        CASE
            WHEN ((fund.fund_class)::text = ANY (ARRAY[('Native American tribes and individuals'::character varying)::text, ('Land and Water Conservation Fund'::character varying)::text, ('Reclamation Fund'::character varying)::text, ('State and local governments'::character varying)::text, ('U.S. Treasury'::character varying)::text, ('Historic Preservation Fund'::character varying)::text])) THEN fund.fund_class
            ELSE 'Other funds'::character varying
        END AS fund_class,
        CASE
            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_type)::text = 'Federal Onshore'::text) THEN 4
            WHEN ((location.land_type)::text = 'Federal Offshore'::text) THEN 3
            ELSE 0
        END AS sort_order,
    (sum((disbursement.disbursement)::double precision))::numeric(20,2) AS sum
   FROM ((((public.disbursement
     JOIN public.period USING (period_id))
     JOIN public.commodity USING (commodity_id))
     JOIN public.location USING (location_id))
     JOIN public.fund USING (fund_id))
  WHERE (((period.period)::text = 'Monthly'::text) AND (period.fiscal_year > ( SELECT max((period_1.fiscal_year - 2)) AS max
           FROM (public.revenue revenue_1
             JOIN public.period period_1 USING (period_id))
          WHERE ((period_1.period)::text = 'Monthly'::text))) AND (period.fiscal_year <= ( SELECT max(period_1.fiscal_year) AS max
           FROM (public.revenue revenue_1
             JOIN public.period period_1 USING (period_id))
          WHERE (period_1.fiscal_month = 12))))
  GROUP BY period.period, period.calendar_year, period.month, period.month_long, period.period_date, location.land_type, fund.fund_class, fund.recipient, fund.source,
        CASE
            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_type)::text = 'Federal Onshore'::text) THEN 4
            WHEN ((location.land_type)::text = 'Federal Offshore'::text) THEN 3
            ELSE 0
        END
  ORDER BY period.period, period.calendar_year, period.month, period.month_long, period.period_date,
        CASE
            WHEN ((location.land_type)::text = 'Native American'::text) THEN 2
            WHEN ((location.land_type)::text = 'Federal Onshore'::text) THEN 4
            WHEN ((location.land_type)::text = 'Federal Offshore'::text) THEN 3
            ELSE 0
        END;


ALTER TABLE public.total_monthly_fiscal_disbursement_last_two_years OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

