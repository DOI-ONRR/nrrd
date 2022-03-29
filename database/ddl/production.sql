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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: production; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production (
    location_id integer NOT NULL,
    period_id integer NOT NULL,
    commodity_id integer NOT NULL,
    volume numeric,
    unit character varying(20) DEFAULT ''::character varying,
    unit_abbr character varying(5) DEFAULT ''::character varying,
    duplicate_no integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.production OWNER TO postgres;

--
-- Name: production production_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_pkey PRIMARY KEY (location_id, period_id, commodity_id);


--
-- Name: production production_commodity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_commodity_id_fkey FOREIGN KEY (commodity_id) REFERENCES public.commodity(commodity_id);


--
-- Name: production production_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(location_id);


--
-- Name: production production_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production
    ADD CONSTRAINT production_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.period(period_id);


--
-- PostgreSQL database dump complete
--

