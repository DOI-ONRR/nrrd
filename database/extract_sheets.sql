;; This buffer is for text that is not saved, and for Lisp evaluation.
;; To create a file, visit it with C-x C-f and enter text in its buffer.

 \copy (select 'DATE>', period.* , '<LOCATION>', location.*, '<COMMODITY>', commodity.*, '<FUND>', fund.*, '<FACTS>', disbursement, raw_disbursement, duplicate_no, row_number from disbursement join  period using (period_id) join location using (location_id) join commodity using(commodity_id) join fund using(fund_id) where period = 'Monthly' order by row_number asc) to 'disbursments_monthly.csv with CSV HEADER

\copy (select 'DATE>', period.* , '<LOCATION>', location.*, '<COMMODITY>', commodity.*, '<FUND>', fund.*, '<FACTS>', disbursement, raw_disbursement, duplicate_no, row_number from disbursement join  period using (period_id) join location using (location_id) join commodity using(commodity_id) join fund using(fund_id) where period = 'Fiscal Year' order by row_number asc) to 'disbursments_fy.csv with CSV HEADER


\copy (select 'DATE>', period.* , '<LOCATION>', location.*, '<COMMODITY>', commodity.*, '<FACTS>', volume, raw_volume, duplicate_no, row_number from product join  period using (period_id) join location using (location_id) join commodity using(commodity_id)  where period = 'Monthly' order by row_number asc) to 'disbursments_monthly.csv with CSV HEADER

