function buildCharts(sample) {
    // Fetch the JSON data and console log it
    d3.json("samples.json").then((data) => {
      samplesData = data.samples;
      console.log(typeof(samplesData[2].id))
      //Filter Data
      console.log(samplesData)
      var filteredData = samplesData.filter(dSample => parseInt(dSample.id) === parseInt(sample));
      
      console.log(filteredData)
      //Sort the data based on OTU IDs
      var sortedData = filteredData.sort((a, b) => a.sample_values - b.sample_values);
      console.log(sortedData)
      var top10SampleVals = sortedData[0].sample_values.slice(0,10)
      var top10OtuIds = sortedData[0].otu_ids.slice(0,10)
      var top10OtuLabels = sortedData[0].otu_labels.slice(0,10)
      console.log(top10SampleVals)
      console.log(top10OtuIds)
      //console.log("Got Data:")
      //console.log(filteredData);
      //console.log(sortedData);
    top10OtuLabels = top10OtuLabels.reverse();
    top10OtuIds = top10OtuIds.reverse();
    top10SampleVals = top10SampleVals.reverse();

    //Bar Chart
    //console.log(filteredData[0].sample_values)
    //console.log(filteredData[0].otu_ids)
    var trace1 = {
      x: top10SampleVals,
      y: top10OtuIds,
      text: top10OtuLabels,
      hovertext: top10OtuLabels,
      type: "bar",
      orientation: "h"
    };
    
    var data = [trace1];
    
    var layout = {
      title: "Test Chart"
    };
    
    Plotly.newPlot("bar", data, layout);

    });
    // Promise Pending
    //const dataPromise = d3.json(url);
    //console.log("Data Promise: ", dataPromise);

};

function buildMetadata(sample) {
    // Make an API call to gather all data and then reduce to matching the sample selected
    const url = "http://robdunnlab.com/projects/belly-button-biodiversity/";

    // Fetch the JSON data and console log it
    d3.json("samples.json").then((data) => {
      console.log(data);
    });

    // Promise Pending
    const dataPromise = d3.json(url);
    console.log("Data Promise: ", dataPromise);

};

function init() {
    
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      console.log(sampleNames)

      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      //buildCharts(firstSample);
      //buildMetadata(firstSample);

      // Loop through sampleNames to add "option" elements to the selector
      selector
        .selectAll("option")
        .data(sampleNames)
        .enter().append("option")
        .text(function(d) { return d; })

    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    //buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();