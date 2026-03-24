---
title: "Drawing the Audience Engagement Pie"
description: "code alert"
pubDate: "Feb 08 2023"
# heroImage: "/blog-placeholder-3.jpg"
---

### Given Data Example

- x
  - a = 10 posts
  - b = 21 posts
- y
  - c = 30 posts
- z
  - d = 3 posts
  - e = 24 posts
  - f = 3 posts

### Steps

1. **Total Posts for Each Category**:
   - Total for x = 10 + 21 = 31
   - Total for y = 30
   - Total for z = 3 + 24 + 3 = 30
2. **Total Posts Overall** = 31 + 30 + 30 = 91
3. **Percentage for Each Category**:
   - x = (31 / 91) \* 100 ≈ 34.07%
   - y = (30 / 91) \* 100 ≈ 32.97%
   - z = (30 / 91) \* 100 ≈ 32.97%
4. **Percentage for Each Subcategory**:
   - For x:
     - a = (10 / 31) \* 100 ≈ 32.26%
     - b = (21 / 31) \* 100 ≈ 67.74%
   - For y:
     - c = (30 / 30) \* 100 = 100%
   - For z:
     - d = (3 / 30) \* 100 = 10%
     - e = (24 / 30) \* 100 = 80%
     - f = (3 / 30) \* 100 = 10%

### Implementation

```ts
const categories = [
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

export function propagateValueWithPercentage(
  categories: InputCategory<InputSubcategory>[]
): OutputCategory<OutputSubcategory>[] {
  const overallTotal = categories.reduce(
    (acc, category) =>
      acc +
      category.subcategories.reduce(
        (accSub, subcategory) => accSub + subcategory.value,
        0
      ),
    0
  );

  return categories.map((category) => {
    const categoryValue = category.subcategories.reduce(
      (total, sub) => total + sub.value,
      0
    );
    let categoryPercentage = (categoryValue / overallTotal) * 100;

    let subcategoriesWithPercentages = category.subcategories.map(
      (subcategory) => {
        const subPercentage = (subcategory.value / categoryValue) * 100;
        return {
          ...subcategory,
          percentage: parseFloat(subPercentage.toFixed(2)),
        };
      }
    );

    // Adjust the last subcategory percentage to ensure the sum is 100%
    const subPercentageSum = subcategoriesWithPercentages.reduce(
      (acc, sub) => acc + sub.percentage,
      0
    );
    const lastSubIndex = subcategoriesWithPercentages.length - 1;
    subcategoriesWithPercentages[lastSubIndex]!.percentage += parseFloat(
      (100 - subPercentageSum).toFixed(2)
    );

    // Adjust the category percentage to ensure sum of all category percentages is 100%
    // This is calculated and applied similarly to the subcategory adjustment method
    // if applying this method to categories directly in a larger context

    return {
      ...category,
      value: categoryValue,
      percentage: parseFloat(categoryPercentage.toFixed(2)),
      subcategories: subcategoriesWithPercentages,
    };
  });
}

console.log(propagateValueWithPercentage(categories));
```
