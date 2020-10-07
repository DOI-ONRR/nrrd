-- drop view federal_revenue_by_company_type_summary;
-- create view federal_revenue_by_company_type_summary as
select corporate_name, revenue_type, 
    case when revenue_type = 'Royalties' then 1
    when revenue_type = 'Bonus' then 2
    when revenue_type = 'Rents' then 3
    when revenue_type = 'Inspection Fees' then 4
    when revenue_type = 'Civil Penalties' then 5
    when revenue_type = 'Other Revenues' then 6
    else 7 end as type_order,
     
calendar_year, sum(revenue) as total from federal_revenue_by_company join (select corporate_name, calendar_year, sum(revenue) as total, rank() over ( partition by calendar_year order by sum(revenue) desc) as company_rank from federal_revenue_by_company group by calendar_year, corporate_name order by calendar_year, company_rank) total on (   group by corporate_name, revenue_type, calendar_year order by calendar_year, type_order
RANK () OVER ( 
		PARTITION BY p.group_id
		ORDER BY price DESC
	) price_rank


  and company_rank < 4
  order by calendar_year, company_rank, type_order



drop view federal_revenue_by_company_type_summary;
create view federal_revenue_by_company_type_summary as
select top_company.calendar_year, top_company.corporate_name, revenue_type, total/total_yearly_revenue*100 as percent_of_revenue, total, revenue, company_rank, type_order from 
(select calendar_year, sum(revenue) as total_yearly_revenue from federal_revenue_by_company group by calendar_year ) as total_yearly,  
(select corporate_name, 
        calendar_year, 
        sum(revenue) as total, 
        rank() over ( partition by calendar_year order by sum(revenue) desc) as company_rank 
        from federal_revenue_by_company  group by calendar_year, corporate_name order by calendar_year, company_rank) top_company,
(select calendar_year, corporate_name, revenue_type, 
        case when revenue_type = 'Royalties' then 1
             when revenue_type = 'Bonus' then 2
             when revenue_type = 'Rents' then 3
             when revenue_type = 'Inspection Fees' then 4
             when revenue_type = 'Civil Penalties' then 5
             when revenue_type = 'Other Revenues' then 6
             else 7 end as type_order,
        sum(revenue) as revenue from federal_revenue_by_company 
group by calendar_year, corporate_name, revenue_type ) as company_detail         
where total_yearly.calendar_year=top_company.calendar_year 
  and  top_company.calendar_year = company_detail.calendar_year
  and  top_company.corporate_name = company_detail.corporate_name
  
  and company_rank < 4
  order by calendar_year desc, company_rank, type_order
