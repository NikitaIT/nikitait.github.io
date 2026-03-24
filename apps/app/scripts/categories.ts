export type ItemId = {
  name: string;
  link?: string;
};
export type InputSubcategory = ItemId & {
  value: number;
};

export type InputCategory<TSubcategory> = ItemId & {
  subcategories: TSubcategory[];
};

export type SubcategoryIncrement = {
  percentage: number;
};
export type CategoryIncrement = {
  value: number;
  percentage: number;
};

export type OutputSubcategory = InputSubcategory & SubcategoryIncrement;
export type OutputCategory<TSubcategory> = InputCategory<TSubcategory> &
  CategoryIncrement;

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
    const categoryPercentage = (categoryValue / overallTotal) * 100;

    const subcategoriesWithPercentages = category.subcategories.map(
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
    const last = subcategoriesWithPercentages[lastSubIndex];
    if (!last) {
      throw new Error("no last subcategory found");
    }
    last.percentage += parseFloat((100 - subPercentageSum).toFixed(2));

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
