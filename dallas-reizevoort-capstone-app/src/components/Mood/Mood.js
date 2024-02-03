import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import SpotifyWebApi from "spotify-web-api-node";

function Mood({ accessToken }) {
  const ref = useRef();
  const spotifyApi = useRef(
    new SpotifyWebApi({
      clientId: "6ba0cc8b29e145ea99f2401c09a35e6e",
    })
  );

  // Define the zoomed function outside of the useEffect hook
  function zoomed(event) {
    const g = d3.select(ref.current).select("g");
    g.attr("transform", event.transform);
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.current.setAccessToken(accessToken);
    spotifyApi.current
      .getMyRecentlyPlayedTracks({ limit: 50 })
      .then((response) => {
        const trackIds = response.body.items.map(item => item.track.id);
        return spotifyApi.current.getAudioFeaturesForTracks(trackIds);
        })
        .then((response) => {
    const audioFeatures = response.body.audio_features;

        const moodData = audioFeatures.map((features, index) => ({
          date: new Date().getTime() - index * 1000 * 60 * 60 * 24, // This is a placeholder. You should use the actual play time of each track.
          valence: features.valence,
        }));

        const moodCategory = (valence) =>
          valence < 0.33 ? "Sad" : valence < 0.66 ? "Neutral" : "Happy";
        moodData.forEach((d) => {
          d.mood = moodCategory(d.valence);
        });

        const svg = d3.select(ref.current);
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const xScale = d3
          .scaleTime()
          .domain(d3.extent(moodData, (d) => d.date))
          .range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

        const line = d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.valence));

        const g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .append("text")
          .attr("fill", "#fff")
          .attr("y", 20)
          .attr("x", width / 2)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Time");

        g.append("g")
          .call(d3.axisLeft(yScale))
          .append("text")
          .attr("fill", "#fff")
          .attr("transform", "rotate(-90)")
          .attr("y", -40)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Mood (valence)");

        g.append("path")
          .datum(moodData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 20)
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("text-decoration", "underline")
          .style("fill", "#fff")
          .text("Mood Over Time");

      

          const tooltip = d3.select("body").append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden")
          .style("background", "#333")
          .style("border-radius", "5px")
          .style("color", "#fff")
          .style("padding", "10px")
          .style("opacity", "0.7")
          .text("a simple tooltip");

        g.selectAll(".mood-label")
          .on("mouseover", function (d) {
            tooltip.text(`Mood: ${d.mood}, Valence: ${d.valence}`);
            return tooltip.style("visibility", "visible");
          })
          .on("mousemove", function (event) {
            return tooltip
              .style("top", event.pageY - 10 + "px")
              .style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
          });

        const zoom = d3
          .zoom()
          .scaleExtent([1, 10])
          .translateExtent([
            [0, 0],
            [width, height],
          ])
          .on("zoom", zoomed); // Use the zoomed function here

        svg.call(zoom);
      })
      .catch((err) => {
        console.error("Something went wrong:", err);
      });
  }, [accessToken]);

  return <svg ref={ref} width="960" height="500" />;
}

export default Mood;
