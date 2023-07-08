// Use the D3 library to read in samples.json from the URL 

// Get the endpoint
const endpt = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Fetch the JSON data and console log using for loop
d3.json(endpt).then(function(data) {
    console.log(typeof data);
    list = data.names; 
    belly = d3.select("#selDataset");

    //append data to each sample
    for (let i = 0; i < list.length; i++) {
        belly.append("option").text(list[i]).attr("value", list[i]);
    }
});

// Populate the dropdown menu with all Sample ID's
function optionChanged(id) {
    d3.json(endpt).then(function(data){
        console.log(data);
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == id);

        console.log(resultArray);
        
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        let trace1 = resultArray.map(sample => sample.otu_ids);
        let trace2 = resultArray.map(sample => sample.sample_values);
        let trace3 = resultArray.map(sample => sample.otu_labels);

        // Create the chart
        let trace = [{
            x: trace2[0].slice(0, 10).reverse(),
            y: trace1[0].slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: trace3[0].slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
            
        }];
                 
        let layout = {
            title: "Top 10 OTUs Found",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };
           
        Plotly.newPlot("bar", trace, layout);

        //Create a bubble chart that displays each sample.
        let bubtrace = [{
            x: trace1[0],
            y: trace2[0],
            text: trace3[0],
            mode: 'markers',
            marker: {
            size: trace2[0].map(num => num * 0.25),
            color: trace1[0]
            },
        }];
                 
        let bublayout = {
            // title: "Top 10 OTUs Found",
            xaxis: { title: "OTU ID" }
            // yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bubble", bubtrace, bublayout);

 // Display metadata/demographic info in the Demographic Info box
        // extract metadata from 'data' json object
        let metadata = data.metadata;

        // filter metadata by id- results in a list inside a list [[...]]
        let resultArray2 = metadata.filter(sampleObj => sampleObj.id == id);

        // extract the list from the list 
        let result = resultArray2[0];

        // add demographic info to id from html
        let panel = d3.select("#sample-metadata");

        // clear any existing metadata
        panel.html("");

        // convert 'result' into an array of k/v pairs. then iterate over array
        Object.entries(result).forEach(([key, value]) => {       
        console.log(key, value);

        //
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });}
    