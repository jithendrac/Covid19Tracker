import React,{ useEffect, useState} from "react";
import './App.css';

import InfoBox from './infoBox'
import Map from './map'
import Table from './table'
import {sortData} from './util'
import LineGraph from './linegraph'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import "leaflet/dist/leaflet.css"
import { convert } from "./util"

function App() {
  const [countries, setCountries]=useState([]);
  const [selectedCountry, setSelectedCountry]=useState("worldwide");
  const [countryInfo, setCountryInfo]=useState([]);
  const [tableData, setTableData]=useState([]);
  const [mapCenter, setMapCenter]=useState({lat: 34.80746, lng: -40.4786})
  const [mapZoom, setMapZoom]=useState(3);
  const [allCountryInfo, setAllCountryInfo]=useState([]);
  const [caseType, setCaseType]=useState("cases");

  useEffect(() =>{
    //This function gets executed once when the component loads and when the countries value changes.
    //async is used because we need to send a request wait for the response then execute over the response.

    const getcountriesdata = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
          setAllCountryInfo(data);
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }
          ));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    }
    getcountriesdata();
  },[])

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[])

  const onCountryChange = async(event) => {
    const selected = event.target.value;
    console.log(selected)
    const url = selected === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${selected}`;
    
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setSelectedCountry(selected)
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    });
  };

  return (
    <div className="App">
      <div className="app_left">
      <div className="app_header">
          <h1>COVID 19 TRACKER</h1>
        <Select
          value={selectedCountry}
          onChange={onCountryChange}
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
          ))
          }
        </Select>
      </div>
      <div className="app_stats">
          <InfoBox onClick={(e) => setCaseType('cases')} title="Corona Virus Cases" cases={convert(countryInfo.todayCases)} total={convert(countryInfo.cases)} />
          <InfoBox onClick={(e) => setCaseType('recovered')} title="Recovered" cases={convert(countryInfo.todayRecovered)} total={convert(countryInfo.recovered)} />
          <InfoBox onClick={(e) => setCaseType('deaths')} title="Deaths" cases={convert(countryInfo.todayDeaths)} total={convert(countryInfo.deaths)} />
      </div>
      <div className="app_map">
          <Map countries={allCountryInfo} casesType={caseType} center={mapCenter} zoom={mapZoom} />
      </div>
      </div>
  
      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by Country</h2>
          <Table tableData={tableData} />
          <h2>World Wide New {caseType}</h2>
          <LineGraph casesType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
