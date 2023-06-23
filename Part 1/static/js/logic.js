// Initialize the map
var myMap = L.map("map").setView([0, 0], 2);

// Create the tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors",
  maxZoom: 18,
}).addTo(myMap);

// Define a custom color scale
var colorScale = d3.scaleLinear()
  .domain([-10, 10, 30, 50, 70, 90])
  .range(["green", "yellowgreen", "yellow", "gold", "orange", "red"])
  .clamp(true);

// Retrieve earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
    // Access the features array
    var features = data.features;
    
    // Loop through the features array
    features.forEach(function(feature) {
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
      }).addTo(myMap);
    
      // Create a popup for each marker
      marker.bindPopup(`<strong>Magnitude: ${magnitude}</strong><br>Depth: ${depth} km`);
    });
  
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
  });