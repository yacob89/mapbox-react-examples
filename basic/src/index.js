import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import './index.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { greatCircle, point } from '@turf/turf';
//import 'https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v3.0.11/turf.min.js'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
//mapboxgl.accessToken = 'pk.eyJ1IjoieWFjb2I4OSIsImEiOiJjamU3dTYxOXEwMzIwMnFteHB5MGYzbzZmIn0._u0BoH4XBwpB7EaYN8Xb2g';

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5
    };
  }

  handleClick() {
    /*var AWS = require('aws-sdk');
    var MapboxClient = require('mapbox');
    var mapboxClient = new MapboxClient(mapboxgl.accessToken);
    mapboxClient.createUploadCredentials(function (err, credentials) {
      console.log(credentials);
    });*/

    /*mapboxClient.retrieveToken('ACCESSTOKEN', function(err, tokenResponse) {
      console.log(tokenResponse);
    });*/

    console.log('this is:', this);
  }

  componentDidMount() {
    const {lng, lat, zoom} = this.state;

    // Turf declaration
    const fs = require('fs');
    const turf = require('turf');
    const D3Dsv = require('d3-dsv');
    const mapboxgl = require('mapbox-gl');
    const MapboxDraw = require('@mapbox/mapbox-gl-draw');

    // Map declaration - mapbox
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/basic-v9',
      zoom: 15,
      center: [-71.97722138410576, -13.517379300798098]
    });

    // Add MapboxDraw Control (Draw Polygon on map)
    
    var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });
    map.addControl(draw);

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    // Add Drone Layer URL
    var url = 'https://wanderdrone.appspot.com/';

    map.on('load', function() {
      addLayer();
      //alert("Load Selesai!");
    });

    map.on('move', () => {
      const {lng, lat} = map.getCenter();
      this.setState({lng: lng.toFixed(4), lat: lat.toFixed(4), zoom: map.getZoom().toFixed(2)});
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Add style change menu and action
    var layerList = document.getElementById('menu');
    var inputs = layerList.getElementsByTagName('input');
    var labels = document.getElementById('title');

    function switchLayer(layer) {
      var layerId = layer.target.id;
      map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
      document.getElementById(layerId).checked = true;
    }

    function removeControl(){
      map.removeControl();
    }

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].onclick = switchLayer;
    }

    // This is Polygon Drawing Function
    
    function updateArea(e) {
      var data = draw.getAll();
      var answer = document.getElementById('calculated-area');
      if (data.features.length > 0) {
        var area = turf.area(data);
        // restrict to area to 2 decimal points
        var rounded_area = Math.round(area * 100) / 100;
        answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
      } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
      }
    }

    // Add Various Layers example on Mapbox examples

    function addLayer() {
      map.addSource('museums', {
        type: 'vector',
        url: 'mapbox://mapbox.2opop9hr'
      });
      map.addLayer({
        'id': 'museums',
        'type': 'circle',
        'source': 'museums',
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 8,
          'circle-color': 'rgba(55,148,179,1)'
        },
        'source-layer': 'museum-cusco'
      });

      map.addSource('contours', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
      });
      map.addLayer({
        'id': 'contours',
        'type': 'line',
        'source': 'contours',
        'source-layer': 'contour',
        'layout': {
          'visibility': 'visible',
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#877b59',
          'line-width': 1
        }
      });

      // Clickable layer point
      map.addLayer({
        "id": "places",
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
                  "icon": "theatre"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-71.97722138410576, -13.517379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href=\"http://madmens5finale.eventbrite.com/\" target=\"_blank\" title=\"Opens in a new window\">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>",
                  "icon": "theatre"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-71.97122138410576, -13.527379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href=\"http://tallulaeatbar.ticketleap.com/2012beachblanket/\" target=\"_blank\" title=\"Opens in a new window\">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>",
                  "icon": "bar"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-71.97222138410576, -13.537379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Ballston Arts & Crafts Market</strong><p>The <a href=\"http://ballstonarts-craftsmarket.blogspot.com/\" target=\"_blank\" title=\"Opens in a new window\">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>",
                  "icon": "art-gallery"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-72.97322138410576, -13.547379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's <a href=\"http://dandiesandquaintrelles.com/2012/04/the-seersucker-social-is-set-for-june-9th-save-the-date-and-start-planning-your-look/\" target=\"_blank\" title=\"Opens in a new window\">Seersucker Social</a> bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>",
                  "icon": "bicycle"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-73.97422138410576, -13.557379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Capital Pride Parade</strong><p>The annual <a href=\"http://www.capitalpride.org/parade\" target=\"_blank\" title=\"Opens in a new window\">Capital Pride Parade</a> makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>",
                  "icon": "star"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-71.97522138410576, -15.567379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist <a href=\"http://www.muhsinah.com\" target=\"_blank\" title=\"Opens in a new window\">Muhsinah</a> plays the <a href=\"http://www.blackcatdc.com\">Black Cat</a> (1811 14th Street NW) tonight with <a href=\"http://www.exitclov.com\" target=\"_blank\" title=\"Opens in a new window\">Exit Clov</a> and <a href=\"http://godsilla.bandcamp.com\" target=\"_blank\" title=\"Opens in a new window\">Gods’illa</a>. 9:00 p.m. $12.</p>",
                  "icon": "music"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-73.97622138410576, -13.577379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>A Little Night Music</strong><p>The Arlington Players' production of Stephen Sondheim's  <a href=\"http://www.thearlingtonplayers.org/drupal-6.20/node/4661/show\" target=\"_blank\" title=\"Opens in a new window\"><em>A Little Night Music</em></a> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>",
                  "icon": "music"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-71.97822138410576, -13.587379300798098]
                }
              }, {
                "type": "Feature",
                "properties": {
                  "description": "<strong>Truckeroo</strong><p><a href=\"http://www.truckeroodc.com/www/\" target=\"_blank\">Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>",
                  "icon": "music"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [-71.97922138410576, -13.597379300798098]
                }
              }
            ]
          }
        },
        "layout": {
          "icon-image": "{icon}-15",
          "icon-allow-overlap": true
        }
      });

      map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
        },
        'paint': {
          'fill-color': 'rgba(200, 100, 240, 0.4)',
          'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
      });

      // Add Drone layer
      window.setInterval(function () {
        map.getSource('drone').setData(url);
      }, 2000);

      map.addSource('drone', {
        type: 'geojson',
        data: url
      });
      map.addLayer({
        "id": "drone",
        "type": "symbol",
        "source": "drone",
        "layout": {
          "icon-image": "rocket-15"
        }
      });


      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.on('click', 'places', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0]
            ? 360
            : -360;
        }

        new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'places', function() {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'places', function() {
        map.getCanvas().style.cursor = '';
      });

      // When a click event occurs on a feature in the states layer, open a popup at the
      // location of the click, with description HTML from its properties.
      map.on('click', 'states-layer', function(e) {
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(e.features[0].properties.name).addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.on('mouseenter', 'states-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'states-layer', function() {
        map.getCanvas().style.cursor = '';
      });
    }

    var toggleableLayerIds = ['contours', 'museums', 'places', 'states-layer', 'drone'];

    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = id;

      link.onclick = function(e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = '';
        } else {
          this.className = 'active';
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
      };

      var layers = document.getElementById('layers');
      layers.appendChild(link);
    }
  }

  render() {
    const {lng, lat, zoom} = this.state;

    return (<div>
      <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
      <div class='calculation-box'>
          <p>Draw a polygon using the draw tools.</p>
          <div id='calculated-area'>adf</div>
        </div>
        <div>
          <label id='title'>Contoh Map</label>
        </div>
        <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        <div id='menu'>
          <input id='basic' type='radio' name='rtoggle' value='basic' checked={true}></input>
          <label for='basic'>basic</label>
          <input id='streets' type='radio' name='rtoggle' value='streets'></input>
          <label for='streets'>streets</label>
          <input id='bright' type='radio' name='rtoggle' value='bright'></input>
          <label for='bright'>bright</label>
          <input id='light' type='radio' name='rtoggle' value='light'></input>
          <label for='light'>light</label>
          <input id='dark' type='radio' name='rtoggle' value='dark'></input>
          <label for='dark'>dark</label>
          <input id='satellite' type='radio' name='rtoggle' value='satellite'></input>
          <label for='satellite'>satellite</label>
        </div>
        <div id='layers'></div>
        <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
      </div>
      
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom"/>
    </div>
  );
  }
}

ReactDOM.render(<Application/>, document.getElementById('app'));
