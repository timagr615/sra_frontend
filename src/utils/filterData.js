import chroma from "chroma-js"

export function getGeoJsonRoute(datafile){
    const data = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: []
        }
    }
    for (let i = 0; i < datafile.length; i++){
        data.geometry.coordinates.push([datafile[i].lon, datafile[i].lat])
    }
    return data;
}

export const getGeoJsonRouteFiltered = (datafile) => {
    const data = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: []
        }
    }
    for (let i = 0; i < datafile.length; i++){
        data.geometry.coordinates.push([datafile[i].lonf, datafile[i].latf])
    }
    return data;
}

export function getGeoJsonFeatures(datafile){
    const vMax = Math.max(...datafile.map(d=>d.v)) == -Infinity ? 1 : Math.max(...datafile.map(d=>d.v))
    const vMin = Math.min(...datafile.map(d=>d.v)) == Infinity ? 0: Math.min(...datafile.map(d=>d.v))
    const f = chroma.scale(['008ae5', "yellow", "red"]).domain([vMin, vMax])

    //console.log("max min", vMax, vMin)
    const data = {
        type: "FeatureCollection",
        features: []
    }

    for (let i = 0; i < datafile.length; i++){
        data.features.push(
            {
                type: "Feature",
                geometry:
                {
                    type: "Point",
                    coordinates: [datafile[i].lon, datafile[i].lat]
                },
                id: i,
                properties: {
                    color: f(datafile[i].v).hex()
                }
            }
        )
    }
    return data;
}