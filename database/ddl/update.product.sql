update commodity set product = 'Oil (bbl)', revenue_type=' ' where commodity='Oil Prod Vol (bbl)' and product != 'Oil Prod Vol (bbl)';
update commodity set product = 'Gas (mcf)', revenue_type=' ' where commodity='Gas Prod Vol (mcf)' and product != 'Gas (mcf)';
update commodity set product = 'Coal (tons)', revenue_type=' ' where commodity='Coal Prod Vol (ton)' and product !=  'Coal (tons)';
