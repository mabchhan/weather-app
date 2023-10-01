import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios
        .get(url)
        .then((response) => {
          console.log("data from weather api");
          console.log(response.data);

          console.log(response.data.name);

          fetch(`http://localhost:8082/api/weather/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              city: `${response.data.name}`.toLocaleLowerCase(),
              // searchDate: "2023-09-26",
            }),
          })
            .then((res) => {
              res.json();
              //console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });

          setData(response.data);
        })
        .catch((error) => {
          alert("Invalid Location");
        });

      setLocation("");
    }
  };

  useEffect(() => {
    fetch(
      `http://localhost:8082/api/weather/history?limit=10`,
      { method: "GET" },
      { headers: { "Content-Type": "application/json" } }
    )
      .then((res) => res.json())
      .then((data) => {
        setSearchHistory(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setSearchHistory]);

  // const reFetchData=()=>{
  //   fetch(url, { method: "GET" }, { headers: { "Content-Type": "application/json" } }) );
  // };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      <div className="container">
        <div className="leftside">
          <div className="search-history">
            <p className="bold">Search History</p>
            <div className="history">
              {searchHistory.map((item, index) => (
                // <div key={item.id} className="history-item">
                <div key={index}>
                  {/* <button>{item}</button> */}
                  <p className="searched-history">{item}</p>
                </div>

                // </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rightside">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          {data.name !== undefined && (
            <div className="bottom">
              <div className="feels">
                {data.main ? (
                  <p className="bold">{data.main.feels_like.toFixed()}°F</p>
                ) : null}
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                {data.main ? (
                  <p className="bold">{data.main.humidity}%</p>
                ) : null}
                <p>Humidity</p>
              </div>
              <div className="wind">
                {data.wind ? (
                  <p className="bold">{data.wind.speed.toFixed()} MPH</p>
                ) : null}
                <p>Wind Speed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
