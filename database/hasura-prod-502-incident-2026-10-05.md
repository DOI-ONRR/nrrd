# hasura-prod 502 incident — 2026-10-05

## Summary

On 2026-10-05, `hasura-prod.app.cloud.gov` returned 502s to revenuedata.onrr.gov. The cause was a pile-up of long-running, read-only GraphQL queries on the `nrrd-a-psql` database (`micro-psql` plan). They used up the database CPU. A Hasura restart at 14:14 EDT then couldn't finish starting, because the database was too slow to build Hasura's schema cache. Ending the runaway queries brought service back. A second restart at 14:29 EDT came up cleanly.

## Timeline (EDT)

| Time | Event |
|---|---|
| ~13:30–13:55 | Seven Hasura-generated `SELECT coalesce(json_agg(...))` queries start. None of them finish. |
| 13:57–14:12 | Hasura serves 200s, but logged `query_execution_time` climbs steadily (~3,800 → 4,700 s). Something is wrong. |
| 14:14:27 | `hasura-prod` restarted manually. |
| 14:14:31 | New instance logs `postgres_connection`, then stalls. It never logs `starting API server`. |
| 14:18 | Router returns `502` with `x_cf_routererror:"endpoint_failure (EOF)"` in 1–6 ms. |
| ~14:25 | `pg_stat_activity` shows 7 `active` queries aged 22–47 min, no wait event (CPU-bound). They are ended with `pg_terminate_backend`. |
| ~14:29 | Hasura finishes starting and serves 200s in ~0.2 s. |
| 14:29:12 | `hasura-prod` restarted again. Starts in 0.44 s. Responses are normal. |

## Diagnosis

### What `endpoint_failure (EOF)` means

The CF router reached the container, but the connection was closed with no response. Nothing was listening on port 8080, so this was not a timeout and not a Hasura error. Hasura returns its errors as HTTP responses with a body.

### Why traffic went to an instance that wasn't serving

`cf get-health-check hasura-prod` reports **`none`**. CF marks the instance healthy as soon as the process exists and starts routing to it, even if Hasura is still starting up.

### Why Hasura couldn't start

The database was saturated:

```
  pid  | state  |   age    | query
-------+--------+----------+----------------------------------------------------------
 15748 | active | 00:46:59 | SELECT coalesce(json_agg("root" ORDER BY "root.pg.year" ASC NULLS LAST, ...
 16143 | active | 00:40:12 | SELECT coalesce(json_agg("root" ORDER BY "root.pg.commodity_order" ASC NULLS LAST, ...
 ... 5 more ordered by year, 22–35 min old
```

These were reads. Their clients (the router, or the old Hasura instance) had given up long before, but Postgres keeps running a query after its client stops waiting. On a `micro-psql` instance, which has burstable CPU, seven of them were enough to make everything crawl: opening `cf ssh` tunnels, querying `pg_locks`, and Hasura's startup.

### A separate, recurring problem: out-of-memory crashes

`cf events hasura-prod` shows `Exited with status 137 (out of memory)` on 9/6, 9/12, 9/18, 9/23, 9/29, 10/1 and 10/4. There is only one instance, so each crash takes the API down until CF restarts it.

### Which frontend queries match

**Sorted by `commodity_order`.** These are the filter dropdown option queries, run in the browser via `withDataFilterQuery` / `BaseDataFilterSelect` / `BaseDataFilterToggle`:

- `src/js/data-filter-query-manager/revenue-queries.js` (`COMMODITY_OPTIONS_QUERY`, `distinct_on: commodity_order`)
- `src/js/data-filter-query-manager/production-queries.js` (two commodity option queries)

They read `data_filter_revenue_options` (`database/ddl/data_filter_revenue_options.view.sql`). That is an ordinary, non-materialized view. Every query joins the **whole `revenue` table** with `commodity`, `period`, `location` and `fund`, then runs `GROUP BY` on 15 columns and a `UNION`.

(`ExploreDataToolbar.js` also sorts by `commodity_order`, but it uses `useStaticQuery`, which runs at Gatsby build time, not at runtime.)

**Sorted by `year`.** Seventeen Explore Data components send `useQuery` requests ordered by `year` / `fiscal_year`. Examples: `RevenueOverTime.js`, `RevenueDetailTrends.js`, `RevenueSummaryTopCommodities.js`, `ProductionSummaryTrends.js`. Most of them read `revenue_summary`, which is also an ordinary view over `revenue`.

### Contributing factors (not confirmed)

- **Revenue true-up.** Commit `890a77a68` rewrote about 340k revenue rows. If the table statistics weren't refreshed afterward, Postgres may be choosing bad query plans for the views above.
- **Bots.** These queries depend on what's in the URL (state, commodity, year, filters). A crawler following every filter combination sends a stream of distinct full-table queries that can't reuse earlier results. `static/robots.txt` only disallows `/patterns/`. DuckAssistBot appeared in the router logs. The client in the original 502s was desktop Chrome, though.

## Recovery runbook

1. Check events and status:
   ```sh
   cf events hasura-prod
   cf app hasura-prod
   cf logs hasura-prod --recent | grep -v '\[RTR'
   ```
   If the newest instance logged `postgres_connection` but not `starting API server`, suspect the database.
2. Open a tunnel (`database/tunnel.sh`) and look for long-running queries. This costs the database much less than querying `pg_locks`:
   ```sql
   SELECT pid, state, now() - xact_start AS age, wait_event_type, left(query, 80)
   FROM pg_stat_activity WHERE state <> 'idle' ORDER BY age DESC NULLS LAST;
   ```
3. End runaway Hasura reads:
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE state = 'active'
     AND pid <> pg_backend_pid()
     AND query LIKE 'SELECT  coalesce(json_agg(%'
     AND now() - xact_start > interval '5 minutes';
   ```
4. `cf restart hasura-prod`, then confirm `starting API server` in the logs and a 200 from `https://hasura-prod.app.cloud.gov/healthz`.
5. Reboot the database (`cf update-service nrrd-a-psql -c '{"reboot": true}'`, per cloud.gov docs) only if steps 2–3 don't help. A reboot does not restore exhausted CPU credits, and it aborts any data load in progress.

Logs to ignore during a restart: `Exit status 137 (exceeded 10s graceful shutdown interval)` on the *old* instance is normal for Hasura v1.3 and is not an out-of-memory crash. A router `499 ... (context canceled)` means the browser cancelled its own request.

To see whether bots are behind the queries, count user agents on GraphQL requests:

```sh
cf logs hasura-prod --recent | grep '\[RTR' | grep 'POST /v1/graphql' \
  | awk -F'"' '{print $6}' | sort | uniq -c | sort -rn | head
```

## Follow-ups

- [ ] Set a query timeout on the Hasura database role, then restart Hasura:
      `ALTER ROLE us7xufnpjdsvu3e6 SET statement_timeout = '60s';`
- [ ] Run `ANALYZE;`, and add it to the data-load changelog steps.
- [ ] Health check: `cf set-health-check hasura-prod http --endpoint /healthz`
- [ ] Redundancy: `cf scale hasura-prod -i 2`
- [ ] Update `hasura.manifest.yml` from `memory: 512M` to `1G` to match prod.
- [ ] Turn `data_filter_revenue_options` and `revenue_summary` into materialized views, refreshed after each data load.
- [ ] Add `Disallow: /query-data` (and filtered `/explore` URLs) to `static/robots.txt`.
- [ ] Consider moving `nrrd-a-psql` from `micro-psql` to `small-psql`.
- [ ] Consider upgrading Hasura from v1.3.3.
