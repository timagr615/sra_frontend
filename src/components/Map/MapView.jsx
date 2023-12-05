import React, {useMemo, useState} from 'react';
import MapGL, { Layer, Marker, Source, Popup } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from "styled-components"
import { getGeoJsonFeatures, getGeoJsonRoute, getGeoJsonRouteFiltered } from '../../utils/filterData';
import { Pin } from '../../utils/Pin';

const mapbox_access_token = 'pk.eyJ1IjoidGlnciIsImEiOiJjajhvdGNzdHgwN3piMndxdXB0OHh4MHc1In0.6EwnfD1AdR_hQeX6Jl0AmQ'

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: absolute;

`;

const MapDiv = styled.div`
    flex: 1;
    position: relative;
    
`;

export function MapView({mapwidth, mapheight, datafile, range, point, setPoint}) {
    const dataLength = datafile.length;

    const [viewport, setViewport] = useState({
        latitude: dataLength > 0 ? datafile[0].lat : 37,
        longitude: dataLength > 0 ? datafile[0].lon : 55,
        zoom: 15
      });

    const route = useMemo(() => getGeoJsonRoute(datafile), [datafile])
    const routef = useMemo(() => getGeoJsonRouteFiltered(datafile), [datafile])
    const pointsf = useMemo(() => getGeoJsonFeatures(datafile), [datafile])
    const onClickPointLayer = (p) => {
        console.log("clicked point")
        console.log(p)
      }
      //console.log(pointId)
      const onHoverPointLayer = (p) => {
        setPoint(p.features[0].id)
      }
      //console.log(point, datafile.length)

    return (
        <div >
        {dataLength == 0 ? 
            <div>{"No data"}</div>
        :   
        <OuterDiv>
            <MapDiv>
            <MapGL
            style={{width: mapwidth-1, height: mapheight}}
            
            accessToken={mapbox_access_token}
            latitude={datafile[0].lat}
            longitude={datafile[0].lon}
            zoom={14}
            onViewportChange={setViewport}
            mapStyle='mapbox://styles/mapbox/light-v11'  
            > 
                <Source id="route" type="geojson" data={route} />
                <Layer
                    id="route"
                    type="line"
                    source="route"
                    layout={{
                        'line-join': "round",
                        'line-cap': "round"
                    }}
                    paint={{
                        'line-color': '#888888',
                        'line-width': 4
                    }} />

                <Source id="routef" type="geojson" data={routef} />
                <Layer
                    id="routef"
                    type="line"
                    source="routef"
                    layout={{
                        'line-join': "round",
                        'line-cap': "round"
                    }}
                    paint={{
                        'line-color': '#ae3',
                        'line-width': 4
                    }} />
                <Source id="pointsf" type="geojson" data={pointsf} />
                <Layer
                    id="pointsf"
                    type="circle"
                    source="pointsf"
                    onClick={onClickPointLayer}
                    onHover={onHoverPointLayer}
                    paint={{
                        'circle-radius': 3,
                        'circle-color': ['get', 'color']
                    }}
                    /*paint={{
                        'circle-radius': 4,
                        'circle-color': "#5E10FE"
                    }}*//>
                <Marker
                    longitude={dataLength> 0 ? datafile[point].lon: 55}
                    latitude={dataLength > 0 ? datafile[point].lat: 37}>
                    <Pin color="#ae3" rotation={dataLength > 0 ? datafile[point].yaw : 0}/>
                </Marker>
            </MapGL>
            </MapDiv>
        </OuterDiv>
        }
        </div>
    )
}