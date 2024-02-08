mkdir -p /tmp/downloads

psql postgres://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}  <<EOF
set datestyle to SQL, MDY;
\copy  (select "Date", "Land Class", "Land Category", "State", "County", "FIPS Code", "Offshore Region", "Revenue Type", "Mineral Lease Type", "Commodity", "Product", "Revenue" from download_monthly_revenue )  to '/tmp/downloads/monthly_revenue.csv' csv header force quote "FIPS Code"
\copy  (select "Fiscal Year", "Land Class", "Land Category", "State", "County", "FIPS Code", "Offshore Region", "Revenue Type",  "Mineral Lease Type", "Commodity", "Product", "Revenue" from download_fiscal_year_revenue )  to '/tmp/downloads/fiscal_year_revenue.csv' csv header force quote "FIPS Code"
\copy  (select "Calendar Year", "Land Class", "Land Category", "State", "County", "FIPS Code", "Offshore Region", "Revenue Type", "Mineral Lease Type", "Commodity", "Product", "Revenue" from download_calendar_year_revenue )  to '/tmp/downloads/calendar_year_revenue.csv' csv header force quote "FIPS Code"
\copy  (select * from download_monthly_production )  to '/tmp/downloads/monthly_production.csv' csv header 
\copy  (select "Fiscal Year", "Land Class", "Land Category", "State", "County", "FIPS Code", "Offshore Region", "Product", "Volume" from download_fiscal_year_production )  to '/tmp/downloads/fiscal_year_production.csv' csv header force quote "FIPS Code"
\copy  (select  "Calendar Year", "Land Class", "Land Category", "State", "County", "FIPS Code", "Offshore Region", "Product", "Volume" from download_calendar_year_production )  to '/tmp/downloads/calendar_year_production.csv' csv header force quote  "FIPS Code"
\copy  (select * from download_monthly_disbursements )  to '/tmp/downloads/monthly_disbursements.csv' csv header 
\copy  (select "Fiscal Year", "Fund Type", "Source", "State", "County", "Disbursement"   from download_fiscal_year_disbursements )  to '/tmp/downloads/fiscal_year_disbursements.csv' csv header 
\copy  (select "Calendar Year", "Corporate Name" as "Company Name", "Revenue Agency Type" as "Revenue Type", "Commodity", "Revenue"  from download_federal_revenue_by_company order by "Calendar Year" )  to '/tmp/downloads/federal_revenue_by_company.csv' csv header 
\copy (select "Calendar Year", "Land Class", "Land Category", "State/Offshore Region", "Revenue Type", "Commodity", "Sales Volume", "Gas MMBtu Volume", "Sales Value", "Royalty Value Prior to Allowances (RVPA)", "Transportation Allowances (TA)", "Processing Allowances (PA)", "Royalty Value Less Allowances (RVLA)", "Effective Royalty Rate" from download_federal_sales_v) to '/tmp/downloads/federal_sales.csv' csv header 

EOF

cp  /tmp/downloads/monthly_revenue.csv /tmp/Monthly\ Revenue
cp  /tmp/downloads/fiscal_year_revenue.csv /tmp/Fiscal\ Year\ Revenue
cp  /tmp/downloads/calendar_year_revenue.csv /tmp/Calendar\ Year\ Revenue
cp  ./static/csv/data_dictionary/revenue_dictionary.csv /tmp/Data\ Dictionary

echo "" > .ssconvert

ssconvert --merge-to /tmp/downloads/all_revenue.xlsx /tmp/Monthly\ Revenue /tmp/Fiscal\ Year\ Revenue /tmp/Calendar\ Year\ Revenue  /tmp/Data\ Dictionary && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
echo -n "Waiting for ssconvert to finish revenue..."      
while ! grep "Convert" .ssconvert > /dev/null;
do
    echo -n "."
    sleep 1
done


 cat .ssconvert
 rm .ssconvert
 echo "" > .ssconvert
cp  /tmp/downloads/federal_revenue_by_company.csv /tmp/Federal\ Revenue\ By\ Company
cp  ./static/csv/data_dictionary/corporate_cross_walk.csv /tmp/Corporate\ Crosswalk
cp  ./static/csv/data_dictionary/revenue_by_company_dictionary.csv /tmp/Data\ Dictionary
 
 ssconvert  --merge-to /tmp/downloads/federal_revenue_by_company.xlsx  /tmp/Federal\ Revenue\ By\ Company /tmp/Corporate\ Crosswalk /tmp/Data\ Dictionary  && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
 echo -n "Waiting for ssconvert to finish ..."      
 while ! grep "Convert" .ssconvert > /dev/null;
 do
     echo -n "."
     sleep 1
 done


cat .ssconvert
rm .ssconvert
 
cp  /tmp/downloads/fiscal_year_production.csv /tmp/Fiscal\ Year\ Production
cp  /tmp/downloads/calendar_year_production.csv /tmp/Calendar\ Year\ Production
cp  ./static/csv/data_dictionary/production_by_year_dictionary.csv /tmp/Data\ Dictionary
 cat .ssconvert
 rm .ssconvert
 echo "" > .ssconvert
 ssconvert --merge-to /tmp/downloads/all_production.xlsx /tmp/Fiscal\ Year\ Production /tmp/Calendar\ Year\ Production /tmp/Data\ Dictionary  && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
 echo -n "Waiting for ssconvert to finish ..."      
 while ! grep "Convert" .ssconvert > /dev/null;
 do
     echo -n "."
     sleep 1
 done

 
 cat .ssconvert
rm .ssconvert

cp  /tmp/downloads/monthly_production.csv /tmp/Monthly\ Production
cp  ./static/csv/data_dictionary/production_by_month_dictionary.csv /tmp/Data\ Dictionary
 cat .ssconvert
 rm .ssconvert
 echo "" > .ssconvert
 ssconvert --merge-to /tmp/downloads/monthly_production.xlsx /tmp/Monthly\ Production /tmp/Data\ Dictionary  && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
 echo -n "Waiting for ssconvert to finish ..."      
 while ! grep "Convert" .ssconvert > /dev/null;
 do
     echo -n "."
     sleep 1
 done

 
  cat .ssconvert
  rm .ssconvert



cp  /tmp/downloads/monthly_disbursements.csv /tmp/Monthly\ Disbursements
cp  ./static/csv/data_dictionary/disbursement_by_month_dictionary.csv /tmp/Data\ Dictionary
 echo "" > .ssconvert
 ssconvert --merge-to /tmp/downloads/monthly_disbursements.xlsx /tmp/Monthly\ Disbursements /tmp/Data\ Dictionary && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
 echo -n "Waiting for ssconvert to finish ..."      
 while ! grep "Convert" .ssconvert > /dev/null;
 do
     echo -n "."
     sleep 1
 done
 
 cat .ssconvert
 rm .ssconvert

 
cp  /tmp/downloads/fiscal_year_disbursements.csv /tmp/Fiscal\ Year\ Disbursements
cp  ./static/csv/data_dictionary/disbursement_by_year_dictionary.csv /tmp/Data\ Dictionary
echo "" > .ssconvert
ssconvert --merge-to /tmp/downloads/fiscal_year_disbursements.xlsx /tmp/Fiscal\ Year\ Disbursements /tmp/Data\ Dictionary && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
 echo -n "Waiting for ssconvert to finish ..."      
 while ! grep "Convert" .ssconvert > /dev/null;
 do
     echo -n "."
     sleep 1
 done
 
 cat .ssconvert
 rm .ssconvert

cp  /tmp/downloads/federal_sales.csv /tmp/Federal\ Oil\ Gas\ and\ NGL\ Sales
cp  ./static/csv/data_dictionary/federal_sales.csv /tmp/Data\ Dictionary
cp  ./static/csv/data_dictionary/federal_sales_notes.csv /tmp/Notes
echo "" > .ssconvert
ssconvert --merge-to /tmp/downloads/federal_sales.xlsx /tmp/Federal\ Oil\ Gas\ and\ NGL\ Sales /tmp/Data\ Dictionary /tmp/Notes && echo "Convert successful" >> .ssconvert || echo "Convert failed" >> .ssconvert &
 echo -n "Waiting for ssconvert to finish ..."      
 while ! grep "Convert" .ssconvert > /dev/null;
 do
     echo -n "."
     sleep 1
 done
 
 cat .ssconvert
 rm .ssconvert
