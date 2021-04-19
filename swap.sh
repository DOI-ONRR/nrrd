current=`cf services | grep hasura-dev | cut -d' ' -f1`

echo $current


if [[ "$current" == "nrrd-a-psql" ]]; then
  new='nrrd-b-psql'
else 
  new='nrrd-a-psql'
fi

echo "$current swapping to $new"

cf unbind-service hasura-prod  $current
cf bind-service hasura-prod $new
cf restage hasura-prod

cf unbind-service hasura-dev $new
cf bind-service hasura-dev $current
cf restage hasura-dev


