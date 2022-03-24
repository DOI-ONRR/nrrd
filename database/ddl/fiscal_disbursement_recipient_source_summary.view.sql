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
-- Name: fiscal_disbursement_recipient_source_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.fiscal_disbursement_recipient_source_summary AS
 SELECT t1.year,
    t1.recipient,
    t1.recipient_order,
    t1.source,
    t1.source_order,
    sum(t1.sum) AS total
   FROM ( SELECT period.fiscal_year AS year,
                CASE
                    WHEN (((fund.fund_type)::text = 'U.S. Treasury'::text) OR ((fund.fund_type)::text = 'U.S. Treasury - GoMESA'::text)) THEN 'U.S. Treasury'::text
                    WHEN (((fund.fund_type)::text = 'State'::text) OR ((fund.fund_type)::text = 'State 8(g)'::text) OR ((fund.fund_type)::text = 'State - GoMESA'::text)) THEN 'State and local governments'::text
                    WHEN (((fund.fund_type)::text = 'Reclamation'::text) OR ((fund.fund_type)::text = 'Reclamation Fund'::text)) THEN 'Reclamation Fund'::text
                    WHEN (((fund.fund_type)::text = 'American Indian Tribes'::text) OR ((fund.fund_type)::text = 'Native American Tribes & Allottees'::text) OR ((fund.fund_type)::text = 'U.S. TreasuryAI'::text)) THEN 'Native American tribes and individuals'::text
                    WHEN ((fund.fund_type)::text ~~ 'Land & Water Conservation Fund%'::text) THEN 'Land and Water Conservation Fund'::text
                    WHEN ((fund.fund_type)::text = 'Historic Preservation Fund'::text) THEN 'Historic Preservation Fund'::text
                    ELSE 'Other funds'::text
                END AS recipient,
                CASE
                    WHEN (((fund.fund_type)::text = 'U.S. Treasury'::text) OR ((fund.fund_type)::text = 'U.S. Treasury - GoMESA'::text)) THEN 1
                    WHEN (((fund.fund_type)::text = 'State'::text) OR ((fund.fund_type)::text = 'State 8(g)'::text) OR ((fund.fund_type)::text = 'State - GoMESA'::text)) THEN 2
                    WHEN (((fund.fund_type)::text = 'Reclamation'::text) OR ((fund.fund_type)::text = 'Reclamation Fund'::text)) THEN 3
                    WHEN (((fund.fund_type)::text = 'American Indian Tribes'::text) OR ((fund.fund_type)::text = 'Native American Tribes & Allottees'::text) OR ((fund.fund_type)::text = 'U.S. TreasuryAI'::text)) THEN 4
                    WHEN ((fund.fund_type)::text ~~ 'Land & Water Conservation Fund%'::text) THEN 5
                    WHEN ((fund.fund_type)::text = 'Historic Preservation Fund'::text) THEN 7
                    ELSE 8
                END AS recipient_order,
                CASE
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN location.land_category
                    WHEN ((fund.fund_type)::text = 'State 8(g)'::text) THEN '8(g) offshore'::character varying
                    WHEN (upper((fund.fund_type)::text) ~~ '%GOMESA%'::text) THEN 'GOMESA offshore'::character varying
                    ELSE 'Offshore'::character varying
                END AS source,
                CASE
                    WHEN ((location.land_category)::text = 'Onshore'::text) THEN 1
                    WHEN ((fund.fund_type)::text = 'State 8(g)'::text) THEN 3
                    WHEN (upper((fund.fund_type)::text) ~~ '%GOMESA%'::text) THEN 2
                    ELSE 4
                END AS source_order,
            sum(disbursement.disbursement) AS sum
           FROM (((public.disbursement
             JOIN public.period USING (period_id))
             JOIN public.location USING (location_id))
             JOIN public.fund USING (fund_id))
          WHERE ((period.period)::text = 'Fiscal Year'::text)
          GROUP BY location.land_category, fund.fund_type, period.fiscal_year, period.calendar_year
          ORDER BY period.fiscal_year) t1
  GROUP BY t1.year, t1.recipient, t1.recipient_order, t1.source, t1.source_order
  ORDER BY t1.year DESC, t1.recipient_order, t1.source_order;


ALTER TABLE public.fiscal_disbursement_recipient_source_summary OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

