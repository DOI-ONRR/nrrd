DROP view IF EXISTS fiscal_year_disbursements_by_recipient_v;

CREATE VIEW fiscal_year_disbursements_by_recipient_v AS
SELECT SUM(d.disbursement) total,
  CASE 
    WHEN recipient IN ('U.S. Treasury',
      'State and local governments',
      'Reclamation Fund',
      'Native American tribes and individuals',  
      'Land and Water Conservation Fund',
      'Historic Preservation Fund') THEN recipient
    ELSE 'Other funds'
  END grouped_recipients
FROM disbursement d,
 fund f,
 period p
WHERE d.period_id = p.period_id
  AND f.fund_id = d.fund_id
  AND p.period = 'Monthly'
  AND p.fiscal_year = (SELECT MAX(fiscal_year) FROM period WHERE period = 'Monthly')
GROUP BY grouped_recipients
ORDER BY 1 DESC;