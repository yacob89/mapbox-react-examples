import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class Application extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/basic-v9',
      center: [lng, lat],
      zoom
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Add style change menu
    var layerList = document.getElementById('menu');
    var inputs = layerList.getElementsByTagName('input');
    var labels = document.getElementById('title');

    function switchLayer(layer) {
        var layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
        document.getElementById(layerId).checked = true;
    }

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
    }
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div><label id = 'title'>Contoh Map</label></div>
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
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
