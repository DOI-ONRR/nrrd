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
-- Name: mat_view_dependencies; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.mat_view_dependencies AS
 WITH RECURSIVE s(start_schemaname, start_relname, start_relkind, schemaname, relname, relkind, reloid, owneroid, ownername, depth) AS (
         SELECT n.nspname AS start_schemaname,
            c.relname AS start_relname,
            c.relkind AS start_relkind,
            n2.nspname AS schemaname,
            c2.relname,
            c2.relkind,
            c2.oid AS reloid,
            au.oid AS owneroid,
            au.rolname AS ownername,
            0 AS depth
           FROM ((((((pg_class c
             JOIN pg_namespace n ON (((c.relnamespace = n.oid) AND (c.relkind = ANY (ARRAY['r'::"char", 'm'::"char", 'v'::"char", 't'::"char", 'f'::"char", 'p'::"char"])))))
             JOIN pg_depend d ON ((c.oid = d.refobjid)))
             JOIN pg_rewrite r ON ((d.objid = r.oid)))
             JOIN pg_class c2 ON ((r.ev_class = c2.oid)))
             JOIN pg_namespace n2 ON ((n2.oid = c2.relnamespace)))
             JOIN pg_authid au ON ((au.oid = c2.relowner)))
        UNION
         SELECT s_1.start_schemaname,
            s_1.start_relname,
            s_1.start_relkind,
            n.nspname AS schemaname,
            c2.relname,
            c2.relkind,
            c2.oid,
            au.oid AS owneroid,
            au.rolname AS ownername,
            (s_1.depth + 1) AS depth
           FROM (((((s s_1
             JOIN pg_depend d ON ((s_1.reloid = d.refobjid)))
             JOIN pg_rewrite r ON ((d.objid = r.oid)))
             JOIN pg_class c2 ON (((r.ev_class = c2.oid) AND (c2.relkind = ANY (ARRAY['m'::"char", 'v'::"char"])))))
             JOIN pg_namespace n ON ((n.oid = c2.relnamespace)))
             JOIN pg_authid au ON ((au.oid = c2.relowner)))
          WHERE (s_1.reloid <> c2.oid)
        )
 SELECT s.start_schemaname,
    s.start_relname,
    s.start_relkind,
    s.schemaname,
    s.relname,
    s.relkind,
    s.reloid,
    s.owneroid,
    s.ownername,
    s.depth
   FROM s;


ALTER TABLE public.mat_view_dependencies OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

