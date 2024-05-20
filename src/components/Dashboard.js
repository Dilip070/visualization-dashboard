import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import Filters from "./Filters";
import getAllData from "../services/Data";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllData();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [filters, setFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    swot: "",
    country: "",
    city: "",
  });

  const filteredData = data.filter((item) => {
    return Object.keys(filters).every((key) => {
      return !filters[key] || item[key] === filters[key];
    });
  });

  const processChartData = () => {
    const years = [];
    const intensityData = [];
    const likelihoodData = [];
    const relevanceData = [];

    filteredData.forEach((insight) => {
      years.push(insight.start_year);
      intensityData.push(insight.intensity);
      likelihoodData.push(insight.likelihood);
      relevanceData.push(insight.relevance);
    });

    return { years, intensityData, likelihoodData, relevanceData };
  };

  const processTopicsData = () => {
    const topics = {};
    filteredData.forEach((insight) => {
      const topic = insight.topic || "Unknown";
      if (!topics[topic]) {
        topics[topic] = 0;
      }
      topics[topic]++;
    });
    const labels = Object.keys(topics);
    const data = Object.values(topics);
    return { labels, data };
  };

  const processCountryIntensityData = () => {
    const countries = {};
    filteredData.forEach((insight) => {
      const country = insight.country || "Unknown";
      if (!countries[country]) {
        countries[country] = 0;
      }
      countries[country] += insight.intensity;

    });
    const labels = Object.keys(countries);
    const data = Object.values(countries);
    return { labels: labels, data: data };
  };

  const processSectorData = () => {
    const sectors = {};
    filteredData.forEach((insight) => {
      const sector = insight.sector || "Unknown";
      if (!sectors[sector]) {
        sectors[sector] = {
          intensity: 0,
          likelihood: 0,
          relevance: 0,
          count: 0,
        };
      }
      sectors[sector].intensity += insight.intensity;
      sectors[sector].likelihood += insight.likelihood;
      sectors[sector].relevance += insight.relevance;
      sectors[sector].count++;
    });

    const labels = Object.keys(sectors);
    const intensityData = labels.map(
      (label) => sectors[label].intensity / sectors[label].count
    );
    const likelihoodData = labels.map(
      (label) => sectors[label].likelihood / sectors[label].count
    );
    const relevanceData = labels.map(
      (label) => sectors[label].relevance / sectors[label].count
    );

    return {
      labels,
      intensityData,
      likelihoodData,
      relevanceData
    };
  };

  const { years, intensityData, likelihoodData, relevanceData } =
    processChartData();
  const topicsData = processTopicsData();
  const countryIntensityData = processCountryIntensityData();
  const sectorData = processSectorData();

  return (
    <div>
      <Filters filters={filters} setFilters={setFilters} data={data} />
      {loading && <div>Loading dashboard</div>}
      {error && <div>Error fetching dashboard : {error.message}</div>}
      {!loading && !error && <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "45%",
            margin: "20px 0",
            padding: "20px",
            borderRadius: "10px",
            background: "#f4f4f4",
          }}
        >
          <h2>Intensity by Country</h2>
          <Bar
            data={{
              labels: countryIntensityData.labels,
              datasets: [
                {
                  label: "Intensity",
                  data: countryIntensityData.data,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
        <div
          style={{
            width: "45%",
            margin: "20px 0",
            padding: "20px",
            borderRadius: "10px",
            background: "#f4f4f4",
          }}
        >
          <h2>Intensity, Likelihood, and Relevance Over Time</h2>
          <Line
            data={{
              labels: years,
              datasets: [
                {
                  label: "Intensity",
                  data: intensityData,
                  borderColor: "rgba(75,192,192,1)",
                  fill: false,
                },
                {
                  label: "Likelihood",
                  data: likelihoodData,
                  borderColor: "rgba(153,102,255,1)",
                  fill: false,
                },
                {
                  label: "Relevance",
                  data: relevanceData,
                  borderColor: "rgba(255,159,64,1)",
                  fill: false,
                },
              ],
            }}
          />
        </div>
        <div
          style={{
            width: "30%",
            margin: "20px 0",
            padding: "20px",
            borderRadius: "10px",
            background: "#f4f4f4",
          }}
        >
          <h2>Distribution of Topics</h2>
          <Pie
            data={{
              labels: topicsData.labels,
              datasets: [
                {
                  data: topicsData.data,
                  backgroundColor: [
                    "rgba(255,99,132,0.2)",
                    "rgba(54,162,235,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(75,192,192,0.2)",
                    "rgba(153,102,255,0.2)",
                    "rgba(255,159,64,0.2)",
                  ],
                  borderColor: [
                    "rgba(255,99,132,1)",
                    "rgba(54,162,235,1)",
                    "rgba(255,206,86,1)",
                    "rgba(75,192,192,1)",
                    "rgba(153,102,255,1)",
                    "rgba(255,159,64,1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
        <div
          style={{
            width: "60%",
            margin: "20px 0",
            padding: "20px",
            borderRadius: "10px",
            background: "#f4f4f4",
          }}
        >
          <h2>Sector Analysis</h2>
          <Bar
            data={{
              labels: sectorData.labels,
              datasets: [
                {
                  label: "Intensity",
                  data: sectorData.intensityData,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 1,
                },
                {
                  label: "Likelihood",
                  data: sectorData.likelihoodData,
                  backgroundColor: "rgba(153,102,255,0.2)",
                  borderColor: "rgba(153,102,255,1)",
                  borderWidth: 1,
                },
                {
                  label: "Relevance",
                  data: sectorData.relevanceData,
                  backgroundColor: "rgba(255,159,64,0.2)",
                  borderColor: "rgba(255,159,64,1)",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>}
    </div>
  );
};

export default Dashboard;
