// src/components/Filters.js
import React from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";

const Filters = ({ filters, setFilters, data }) => {
  const getUniqueValues = (field) => [
    ...new Set(data.map((item) => item[field]).filter(Boolean)),
  ];

  const handleChange = (event, filterType) => {
    setFilters({ ...filters, [filterType]: event.target.value });
  };

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "20px",
        borderRadius: "10px",
        background: "#f4f4f4",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {[
        "end_year",
        "topic",
        "sector",
        "region",
        "pestle",
        "source",
        "swot",
        "country",
        "city",
      ].map((filterType) => (
        <FormControl
          key={filterType}
          style={{ minWidth: "30%", marginBottom: "10px" }}
        >
          <InputLabel>{filterType.replace("_", " ").toUpperCase()}</InputLabel>
          <Select
            value={filters[filterType] || ""}
            onChange={(e) => handleChange(e, filterType)}
            label={filterType.replace("_", " ").toUpperCase()}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {getUniqueValues(filterType).map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </div>
  );
};

export default Filters;
