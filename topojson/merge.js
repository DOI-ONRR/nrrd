var topojson = require("topojson-client")
const fs = require('fs');

let alaskaGeoRaw = fs.readFileSync('alaska-geo.json');
let alaskaGeo=JSON.parse(alaskaGeoRaw)

let pacificGeoRaw = fs.readFileSync('pacific-geo.json');
let pacificGeo=JSON.parse(pacificGeoRaw)

let statesGeoRaw = fs.readFileSync('states-geo.json');
let statesGeo=JSON.parse(statesGeoRaw)


let newGeoJSON = { 
  "type" : "FeatureCollection",
  "id" : "all",
  "features": [
    {"type": "FeatureCollection",
     "id": "offshore",
     "features": [...alaskaGeo.features, ...pacificGeo.features]
    },
    {"type": "FeatureCollection",
     "id": "states",
     "features": [...statesGeo.features]
    }
  ]
}

let usRaw =  fs.readFileSync('us-topology.json');
let usGeo=JSON.parse(usRaw)

let offshoreRaw =  fs.readFileSync('offshore.json');
let offshoreGeo=JSON.parse(offshoreRaw)

let usKeys=Object.keys(usGeo)
let offshoreKeys=Object.keys(offshoreGeo)

console.debug(usGeo.arcs.length)
console.debug(offshoreGeo.arcs.length)

console.debug("use keys", usKeys,offshoreKeys)


for( offshore in offshoreGeo.objects )

  usGeo.objects[offshore]= offshoreGeo.objects[offshore]

usGeo.arcs.push(offshoreGeo.arcs)

// newGeoRaw=JSON.stringify(newGeoJSON)
// fs.writeFileSync('new-geo.json', newGeoRaw)


  console.debug(usGeo)

newGeoRaw=JSON.stringify(usGeo)
fs.writeFileSync('new-topo.json', newGeoRaw)
//let foo= topojson.mergeArcs(us,[alaska,states])

