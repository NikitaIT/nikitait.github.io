/* eslint-disable @typescript-eslint/no-unsafe-assignment -- ok */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- ok */
import * as d3 from "d3";
import type { OutputCategory, OutputSubcategory } from "./categories";

function createSvg(
  document: Document,
  width: number,
  height: number
): SVGSVGElement {
  const svg = document.createElement("svg") as unknown as SVGSVGElement;
  // svg.setAttribute("width", width + "");
  // svg.setAttribute("height", height + "");
  svg.setAttribute("width", "100%");
  // svg.setAttribute("height", "auto");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMin slice");
  return svg;
}

// Function to adjust the color based on value
function getColorForSubcategory(
  parentColor: string,
  subcategoryValue: number,
  minValue: number,
  maxValue: number
): string {
  // Normalize the value to a 0-1 scale based on its range
  const normalizedValue = (subcategoryValue - minValue) / (maxValue - minValue);
  const normalizedValueOrDefault = Number.isNaN(normalizedValue)
    ? 1
    : normalizedValue;
  // Convert the parent color to HSL
  const hsl = d3.hsl(parentColor);

  // Adjust lightness based on value; you could also adjust saturation or hue
  // Here we increase lightness for higher values within a controlled range to keep the color variation perceptible but related
  const adjustedLightness = hsl.l * (0.75 + 0.25 * normalizedValueOrDefault); // Adjust the range as needed

  // Return the modified color
  return d3.hsl(hsl.h, hsl.s, adjustedLightness).toString();
}
type WithColor = {
  color: string;
};
export function addColor(
  categories: OutputCategory<OutputSubcategory>[]
): (OutputCategory<OutputSubcategory & WithColor> & WithColor)[] {
  const colorByNameFn = d3
    .scaleOrdinal<string>(d3.schemeTableau10)
    .domain(categories.map((x) => x.name));

  // Process data to assign colors
  const processedData = categories.map((category) => {
    const parentColor = colorByNameFn(category.name);

    // Find the min and max values within subcategories for relative adjustments
    const values = category.subcategories.map((sub) => sub.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Assign and adjust colors for subcategories
    const subcategoriesWithColors = category.subcategories.map(
      (subcategory) => ({
        ...subcategory,
        color: getColorForSubcategory(
          parentColor,
          subcategory.value,
          minValue,
          maxValue
        ),
      })
    );

    return {
      ...category,
      color: parentColor,
      subcategories: subcategoriesWithColors,
    };
  });
  return processedData;
}
export function toOpt(categories: OutputCategory<OutputSubcategory>[]): Opt {
  const results = addColor(categories);
  const result = {
    innerData: results.map(({ name, value, color, link }) => ({
      label: name,
      value,
      color,
      link,
    })),
    outerData: results
      .flatMap((x) => x.subcategories)
      .map(({ name, value, color, link }) => ({
        label: name,
        value,
        color,
        link,
      })),
  };
  return {
    innerData: () => result.innerData,
    innerColor: (x: string) =>
      result.innerData.find((y) => y.label === x)?.color || "#fff",
    outerData: () => result.outerData,
    outerColor: (x: string) =>
      result.outerData.find((y) => y.label === x)?.color || "#fff",
  };
}
const width = 900;

interface Opt {
  innerData: () => Datum[];
  innerColor: (x: string) => string;
  outerData: () => Datum[];
  outerColor: (x: string) => string;
}
export function pieChart(
  document: Document,
  opt: Opt
): SVGSVGElement & {
  update(): void;
} {
  const height = width * 0.3;
  const theSvg = d3
    .select(createSvg(document, width, height))
    .attr("id", "the-chart");

  const g = theSvg.append("g").attr("class", "outerG");
  g.append("g").attr("class", "slices");
  g.append("g").attr("class", "labels");
  g.append("g").attr("class", "lines");
  g.attr("transform", `translate(${width / 2},${height / 2})`);

  const g2 = theSvg.append("g").attr("class", "innerG");
  g2.append("g").attr("class", "slices");
  g2.append("g").attr("class", "labels");
  g2.append("g").attr("class", "lines");
  g2.attr("transform", `translate(${width / 2},${height / 2})`);

  const radius = Math.min(width, height) / 2;
  const change = render(radius, g);
  const change2 = render(radius, g2, {
    arc: {
      outer: 0.3,
      inner: 0.1,
    },
    outerArc: {
      outer: 0.3,
      inner: 0.3,
    },
  });
  function update(): void {
    change2(opt.innerData(), opt.innerColor);
    change(opt.outerData(), opt.outerColor);
  }
  update();
  const node = theSvg.node();

  if (!node) {
    throw new Error("node is null");
  }

  return Object.assign(node, {
    update,
  });
}

function render(
  radius: number,
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  opt = {
    arc: {
      outer: 0.8,
      inner: 0.4,
    },
    outerArc: {
      outer: 0.9,
      inner: 0.9,
    },
  }
): (data: Datum[], color: (x: string) => string) => void {
  const pie = d3
    .pie<Datum>()
    .sort(null)
    .value((d) => d.value);

  const arc = d3
    .arc<number>()
    .outerRadius(radius * opt.arc.outer)
    .innerRadius(radius * opt.arc.inner);

  const outerArc = d3
    .arc<Datum>()
    .innerRadius(radius * opt.outerArc.inner)
    .outerRadius(radius * opt.outerArc.outer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ok
  const key = (d: any): string => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access -- ok
    return d.data.label;
  };

  function change(data: Datum[], color: (x: string) => string): void {
    const SLICES = "slices";
    /* ------- PIE SLICES -------*/

    const pieData = pie(data);
    const slice = g
      .select(`.${SLICES}`)
      .selectAll("path.slice")
      .data<d3.PieArcDatum<Datum>>(pieData, key);

    slice
      .enter()
      .insert("path")
      .style("fill", (d) => {
        return color(d.data.label);
      })
      .attr("class", "slice") //<-- enter selection
      // @ts-expect-error -- ok
      .merge(slice) //<-- merge back in update selection
      // @ts-expect-error -- ok
      .attr("d", (d) => arc(d))
      .transition()
      .duration(1000)
      .attrTween("d", function __(d) {
        // @ts-expect-error -- ok
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ok
        this._current = this._current || d;
        // @ts-expect-error -- ok
        const interpolate = d3.interpolate(this._current, d);
        // @ts-expect-error -- ok
        this._current = interpolate(0);
        return (t) => {
          const x = interpolate(t);
          // @ts-expect-error -- ok
          return arc(x);
        };
      });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    const text = g.select(".labels").selectAll("text").data(pie(data), key);

    function midAngle(d: d3.PieArcDatum<Datum>): number {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    text
      .enter()
      .append("a")
      .attr("aria-label", (d) => {
        return d.data.label;
      })
      .attr("xlink:href", (d) => {
        return d.data.link || "#";
      })
      .attr("target", "_blank")
      .append("text")
      .attr("dy", ".35em")
      .text((d) => d.data.label)
      .style("fill", (d) => {
        return color(d.data.label);
      })
      // @ts-expect-error -- ok
      .merge(text)
      .attr("transform", (d2) => {
        // @ts-expect-error -- ok
        const pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- ok
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) => {
        return midAngle(d) < Math.PI ? "start" : "end";
      })
      .transition()
      .duration(1000)
      .attrTween("transform", function __(d) {
        // @ts-expect-error -- ok
        this._current = this._current || d;
        // @ts-expect-error -- ok
        const interpolate = d3.interpolate(this._current, d);
        // @ts-expect-error -- ok
        this._current = interpolate(0);
        return (t) => {
          const d2 = interpolate(t);
          // @ts-expect-error -- ok
          const pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- ok
          return `translate(${pos})`;
        };
      })
      .styleTween("text-anchor", function __(d) {
        // @ts-expect-error -- ok
        this._current = this._current || d;
        // @ts-expect-error -- ok
        const interpolate = d3.interpolate(this._current, d);
        // @ts-expect-error -- ok
        this._current = interpolate(0);
        return (t) => {
          const d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    text.exit().remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    const polyline = g
      .select(".lines")
      .selectAll("polyline")
      .data(pie(data), key);

    polyline
      .join("polyline")
      // @ts-expect-error -- ok
      .attr("points", (d2) => {
        // @ts-expect-error -- ok
        const pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        // @ts-expect-error -- ok
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      })
      .transition()
      .duration(1000)
      // @ts-expect-error -- ok
      .attrTween("points", function __(d) {
        // @ts-expect-error -- ok
        this._current = this._current || d;
        // @ts-expect-error -- ok
        const interpolate = d3.interpolate(this._current, d);
        // @ts-expect-error -- ok
        this._current = interpolate(0);
        return (t) => {
          const d2 = interpolate(t);
          // @ts-expect-error -- ok
          const pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          // @ts-expect-error -- ok
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }
  return change;
}

type Datum = {
  label: string;
  value: number;
  link?: string | undefined;
};
