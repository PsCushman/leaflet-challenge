// Initialize the map
var myMap = L.map("map").setView([-5, -20], 2);

// Define base maps
var streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors",
  maxZoom: 18
});

var topographicMap = L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © <a href='https://opentopomap.org'>OpenTopoMap</a> contributors",
  maxZoom: 18
});

// Define overlay layers
var earthquakeLayer = L.layerGroup();
var tectonicPlatesLayer = L.layerGroup();

// Create the layer control
var layersControl = L.control.layers(null, null, { collapsed: false });

// Add base maps to layer control
layersControl.addBaseLayer(streetMap, "Street Map");
layersControl.addBaseLayer(topographicMap, "Topographic Map");

// Add overlay layers to layer control
layersControl.addOverlay(earthquakeLayer, "Earthquakes");
layersControl.addOverlay(tectonicPlatesLayer, "Tectonic Plates");

// Add the layer control to the map
layersControl.addTo(myMap);

// Create the tile layer
streetMap.addTo(myMap);

// Define a custom color scale
var colorScale = d3.scaleLinear()
  .domain([-10, 10, 30, 50, 70, 90])
  .range(["green", "yellowgreen", "yellow", "gold", "orange", "red"])
  .clamp(true);

// Retrieve earthquake data
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve tectonic plates data
var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Fetch earthquake data
d3.json(earthquakeUrl).then(function(earthquakeData) {
  // Access the earthquake features array
  var earthquakeFeatures = earthquakeData.features;
  
  // Loop through the earthquake features array
  earthquakeFeatures.forEach(function(feature) {
    // Extract the coordinates, magnitude, and depth
    var geometry = feature.geometry;
    var coordinates = geometry.coordinates;
    var magnitude = feature.properties.mag;
    var depth = coordinates[2];
  
    // Create a circle marker for each earthquake
    var marker = L.circleMarker([coordinates[1], coordinates[0]], {
      radius: magnitude * 3,
      fillColor: colorScale(depth),
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });

    // Create a popup for each marker
    marker.bindPopup(`<strong>Magnitude: ${magnitude}</strong><br>Depth: ${depth} km`);

    // Add the marker to the earthquake layer
    marker.addTo(earthquakeLayer);
  });
});

// Fetch tectonic plates data
d3.json(tectonicPlatesUrl).then(function(tectonicPlatesData) {
  // Create a GeoJSON layer for tectonic plates
  var tectonicPlates = L.geoJSON(tectonicPlatesData, {
    style: {
      color: "orange",
      weight: 2,
      opacity: 1
    }
  });

  // Add the tectonic plates layer to the tectonic plates layer group
  tectonicPlates.addTo(tectonicPlatesLayer);
});

// Set the default base map and overlay
streetMap.addTo(myMap);
earthquakeLayer.addTo(myMap);

  // Create a legend
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    var labels = ["<strong>Depth Legend</strong>"];
  
    // Define colors for each depth range
    var colors = ["green", "yellowgreen", "yellow", "gold", "orange", "red"];
  
    // Define depth ranges
    var depths = [-10, 10, 30, 50, 70, 90];
  
    // Add labels and colors to the legend
    depths.forEach(function(depth, index) {
      var color = colors[index];
      var label = index === depths.length - 1 ? `> ${depth} km` : `${depth} - ${depths[index + 1]} km`;
      labels.push(`<div class="legend-item"><span class="legend-color" style="background-color:${color}"></span>${label}</div>`);
    });
  
    div.innerHTML = labels.join("<br>");
    return div;
  };
  
  // Add legend to the map
  legend.addTo(myMap);

  // Create a custom control for the title
var titleControl = L.control({ position: "topleft" });

// Define the content of the title control
titleControl.onAdd = function(map) {
  var div = L.DomUtil.create("div", "map-title");
  div.innerHTML = "<h2>Earthquakes!!!</h2>";
  return div;
};

// Add the title control to the map
titleControl.addTo(myMap);
