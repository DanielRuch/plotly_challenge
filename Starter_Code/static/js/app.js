function buildChart(xValues, yValues,textValues, hoverTextValues, chartType, orientation, chartTitle, controlObj, chartMode) {
  //Build Chart given x value array, y value array, array of textValues, array of hoverText values, chartType, orientation, and name of table element
  //Check chart type. Different chart types can require vastly different data to be passed
  //However, some elements always flow the same, e.g. the plotly.newplot call doesn't change.
  switch(controlObj) {
    case "bar":
      //Bar Chart
      var trace1 = {
        x: xValues,
        y: yValues,
        text: textValues,
        hovertext: hoverTextValues,
        type: chartType,
        orientation: orientation
      };
      var data = [trace1];
    
      var layout = {
        title: chartTitle
      };

      break;

    case "bubble":
      //Bubble Chart
      var trace1 = {
        x: xValues,
        y: yValues,
        text: textValues,
        mode: chartMode,
        marker: {
          size: yValues,
          color: xValues,
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: chartTitle,
        showlegend: false,
        height: 600,
        width: 1200
      };
      break;
  };
  
    Plotly.newPlot(controlObj, data, layout);
    console.log("Built " + chartType + " chart successfully");
};

function buildMetadata(data) {
    // Build out metadata from data passed to function. Expecting to get the full metadata array for a given sample
    //Grab reference to demographics object
    var metaSelector = d3.select("#sample-metadata");
    var outputData = [];

    //Push items into outputData array
    console.log(data);
    outputData.push(
      "ID: " + data.id,
      "Ethnicity: " + data.ethnicity,
      "Gender: " + data.gender,
      "Age: " + data.age,
      "Location: " + data.location,
      "bbtype: " + data.bbtype,
      "wfreq: " + data.wfreq
    )

    //Append a ul element
    var ul = metaSelector.append("ul")

    //Loop through output data to build metadata table
    ul
      .selectAll("li")
      .data(outputData)
      .enter().append("li")
      .text(function(d) {return d; })

  console.log("Built Metadata table successfully");
};

function init() {
    
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      //console.log(sampleNames)

      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      optionChanged(firstSample); //Call optionchanged function to build initial plots. Clunky, but DRY.
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
    d3.json("samples.json").then((data) => {
      //Get all samples data
      samplesData = data.samples;
      //console.log("Samples Data:")
      console.log(samplesData)

      //Filter Data based on dropdown value
      var filteredData = samplesData.filter(dataSample => parseInt(dataSample.id) === parseInt(newSample)); //for each data point in samples dataset, compare dataset sample value to dropdown sample value
      // console.log("Filtered Data:")
      // console.log(filteredData)

      //Unsorted Data
      var sampleValsUnsorted = filteredData[0].sample_values
      var otuIdNumUnsorted = filteredData[0].otu_ids
      var otuIdTextUnsorted = otuIdNumUnsorted.map(id => "OTU" + id) 
      var otuLabelsUnsorted = filteredData[0].otu_labels

      //Top10s
      //Sort the data based on sample values
      var sortedData = filteredData.sort((a, b) => a.sample_values - b.sample_values);
      // console.log("Sorted Data:")
      // console.log(sortedData)

      //Get first 10 values 
      var sampleValsSorted = sortedData[0].sample_values.slice(0,10); //Sample values
      var otuIdNumSorted= sortedData[0].otu_ids.slice(0,10); //OTU IDs
      var otuIdTextSorted = otuIdNumSorted.map(item => "OTU" + item); //Add "OTU" to beginning of each id, for clarity and so Plotly parses value as string
      var otuLabelsSorted = sortedData[0].otu_labels.slice(0,10); //OTU labels
      // console.log("Top 10 Sets:")
      // console.log(sampleVals)
      // console.log(otuIds)
      // console.log(otuLabels)

      //Reverse each array
      sampleValsSorted = sampleValsSorted.reverse();
      otuIdNumSorted = otuIdNumSorted.reverse()
      otuIdTextSorted = otuIdTextSorted.reverse();
      otuLabelsSorted = otuLabelsSorted.reverse();
      
      //Finally, pass data to chart builder function
      //Bar Chart
      buildChart(sampleValsSorted, otuIdTextSorted, otuIdTextSorted, otuLabelsSorted, "bar", "h", "Top 10 OTU's", "bar");

      //Bubble Chart
      buildChart(otuIdNumUnsorted, sampleValsUnsorted, otuLabelsUnsorted, otuLabelsUnsorted, "bubble", "none", "OTU Bubble Chart", "bubble", "markers" );

      //Get all metadata
      metaData = data.metadata;

      //Filter metadata
      var filteredMetaData = metaData.filter(dataSample => parseInt(dataSample.id) === parseInt(newSample)); //for each data point in samples dataset, compare dataset sample value to dropdown sample value
      //console.log(filteredMetaData);

      //Build metadata
      buildMetadata(filteredMetaData[0]);
    })
  }
  
  // Initialize the dashboard
  init();