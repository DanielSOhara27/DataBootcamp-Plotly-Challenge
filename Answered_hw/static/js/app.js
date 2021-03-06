function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  let selectedOption = d3.select("#selDataset");

  d3.json(`metadata/${selectedOption.property("value")}`).then(response => {
    let metadataContainer = d3.select("#sample-metadata");
    metadataContainer.html("");

    let myTable = metadataContainer.append('table').attr('class','table-responsive').append('tbody').attr('class','table-striped').append("thead").attr("class", 'thead-dark');
    Object.entries(response).forEach((valueArray) => {
      let row = myTable.append('tr');
      row.append('td').text(`${valueArray[0]}`);
      row.append('td').text(` : ${valueArray[1]}`);
    });

  });


    // @TODO Build Gauge Chart
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildPieChart(response){
  // which are the top ten? The first ten? The ones with the highest sample_value?
  let trace = {
    "labels": (response["otu_ids"].map( data => data)).slice(0,9),
    "values": (response["sample_values"].map( data => data)).slice(0,9),
    "hovertext": (response["otu_labels"].map( data => data)).slice(0,9),
    "type" : "pie"
  };

  let data = [trace];

  Plotly.newPlot("pie", data);
}

function buildBubbleChart(response){
  let trace = {
    x: response["otu_ids"].map(data => data),
    y: response["sample_values"].map(data => data),
    text : response["otu_labels"].map(data => data),
    mode: 'markers',
    marker: {
      size: response["sample_values"].map(data => data),
      color: response["otu_ids"].map(data => data)
    }
  };

  let data =[trace];

  Plotly.newPlot("bubble", data);
}


function buildCharts(sample) {

  let url = `/samples/${sample}`;
  d3.json(url).then( response => {
    console.log(response);
    buildPieChart(response);
    buildBubbleChart(response);
  });

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
