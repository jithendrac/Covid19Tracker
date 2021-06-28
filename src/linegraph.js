import { red } from "@material-ui/core/colors";
import { value } from "numeral";
import React,{useState, useEffect} from "react"
import { Line } from "react-chartjs-2"
import numeral from "numeral"

const options = {
    legend:{
        display:false,
    },
    elements:{
        point: {
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                tricks: {
                    callback: function (value, index, values) {
                            return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

function LineGraph({casesType}) {
    const [chartDataset, setChartDataset] = useState([]);
    console.log(casesType)
    const buildChartData = (data, casesType) => {
        let lastDataPoint;
        const chartData=[]
        for(let d in data[casesType]){
            if(lastDataPoint){
                let newDatapoint ={
                    x: d,
                    y: data[casesType][d]-lastDataPoint
                }
                chartData.push(newDatapoint);
            }
            lastDataPoint = data[casesType][d];
        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async() => {
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) => response.json())
            .then((data) => {
                console.log(casesType)
                const chartData = buildChartData(data,casesType);
                console.log(chartData)
                setChartDataset(chartData);
            });
        }
        fetchData();
    },[casesType])

    return (
        <div>
            {chartDataset?.length > 0 && (
                <Line 
                options={options}
                data={{
                        datasets:[
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor:"#CC1034",
                                data: chartDataset,
                            }
                        ]
                }}
            />
            )}
        </div> 
    )
}

export default LineGraph;