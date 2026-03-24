import { describe, it, expect } from "vitest";
import { propagateValueWithPercentage } from "./categories"; // Adjust the import path as necessary

describe("calculateCategoryPercentages", () => {
  it("correctly calculates percentages for categories and subcategories", () => {
    const inputCategories = [
      {
        name: "x",
        subcategories: [
          { name: "a", value: 10 },
          { name: "b", value: 21 },
        ],
      },
      { name: "y", subcategories: [{ name: "c", value: 30 }] },
      {
        name: "z",
        subcategories: [
          { name: "d", value: 3 },
          { name: "e", value: 24 },
          { name: "f", value: 3 },
        ],
      },
    ];

    const expectedCategories = [
      {
        name: "x",
        percentage: 34.07,
        value: 31,
        subcategories: [
          { name: "a", value: 10, percentage: 32.26 },
          { name: "b", value: 21, percentage: 67.74 },
        ],
      },
      {
        name: "y",
        percentage: 32.97,
        value: 30,
        subcategories: [{ name: "c", value: 30, percentage: 100 }],
      },
      {
        name: "z",
        percentage: 32.97,
        value: 30,
        subcategories: [
          { name: "d", value: 3, percentage: 10 },
          { name: "e", value: 24, percentage: 80 },
          { name: "f", value: 3, percentage: 10 },
        ],
      },
    ];

    // Using deep equality check to compare the calculated result with the expected result
    expect(expectedCategories).toEqual(
      propagateValueWithPercentage(inputCategories)
    );
  });
});
