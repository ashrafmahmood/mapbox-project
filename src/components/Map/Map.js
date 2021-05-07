import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXNocmFmbWFobW9vZCIsImEiOiJja284Z3g1MnMyMXRrMnVqbmprcTllMnVqIn0.NTUGt2DNEY-zUMAC4GjTeA';

function Map() { 
    
    const mapContainer = useRef(null);
    
    const [lng, setLng] = useState(54.6669);
    const [lat, setLat] = useState( -4.5548);
    const [zoom, setZoom] = useState( 1.97);
    const [layerId, setlayerId] = useState("streets-v11")
    const [twoD, settwoD] = useState(true)


    useEffect(() => {

              

        if(twoD){
            
            const map = new mapboxgl.Map({
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom,
                container:  mapContainer.current
                });  
    
            var nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'bottom-right');
        
            map.on('move', () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });
        
         
            map.setStyle('mapbox://styles/mapbox/' + layerId);
        }
        else {
            var map = new mapboxgl.Map({
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom,
                pitch: 45,
                bearing: -17.6,
                container:  mapContainer.current,
                antialias: true
                });

                var nav = new mapboxgl.NavigationControl();
                map.addControl(nav, 'bottom-right');
            
                map.on('move', () => {
                    setLng(map.getCenter().lng.toFixed(4));
                    setLat(map.getCenter().lat.toFixed(4));
                    setZoom(map.getZoom().toFixed(2));
                });
            
             
                map.setStyle('mapbox://styles/mapbox/' + layerId);
                 
                map.on('load', function () {
                // Insert the layer beneath any symbol layer.
                var layers = map.getStyle().layers;
                var labelLayerId;
                for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
                }
                }
                 
                // The 'building' layer in the Mapbox Streets
                // vector tileset contains building height data
                // from OpenStreetMap.
                map.addLayer(
                {
                'id': 'add-3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                'fill-extrusion-color': '#aaa',
                 
                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
                ],
                'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
                }
                },
                 
                labelLayerId
                );
                });
        }
     
    }, [layerId, twoD]);

    

   
  
    return (
        <div>
            <div className='sidebarStyle'>
                <div>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
            </div>
            <div className="menu">
                <div className="menu_item">
                    <input id="satellite-v9" type="radio" name="rtoggle" value="satellite"  onClick={e => setlayerId(e.target.id)}/>
                    <label for="satellite-v9">Satellite</label>
                </div>
                <div className="menu_item">
                    <input id="light-v10" type="radio" name="rtoggle" value="light" onClick={e => setlayerId(e.target.id)}/>
                    <label for="light-v10">Light</label>
                </div>
                <div className="menu_item">
                    <input id="dark-v10" type="radio" name="rtoggle" value="dark" onClick={e => setlayerId(e.target.id)}/>
                    <label for="dark-v10">Dark</label>
                </div>
                <div className="menu_item">
                    <input id="streets-v11" type="radio" name="rtoggle" value="streets" onClick={e => setlayerId(e.target.id)}/>
                    <label for="streets-v11">Streets</label>
                </div>
                <div className="menu_item">
                    <input id="outdoors-v11" type="radio" name="rtoggle" value="outdoors" onClick={e => setlayerId(e.target.id)}/>
                    <label for="outdoors-v11">Outdoors</label>
                </div>
            </div>
            <button className="twoD_button" onClick={() => (twoD ? settwoD(false) : settwoD(true))}><strong>{twoD ? "3D" : "2D"}</strong></button>
        <div className='map-container' ref={mapContainer} />
    </div>
    );
}

export default Map
