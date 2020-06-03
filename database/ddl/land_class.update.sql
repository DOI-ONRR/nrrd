-- don't do this update location set land_class = 'Native American' from disbursement natural join commodity  natural join period
where period='Fiscal Year'
and disbursement.location_id=location.location_id
and fund_type in ('American Indian Tribes');
