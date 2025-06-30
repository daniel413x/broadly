import { render } from "@testing-library/react";
import SubcategoryMenu from "../SubcategoryMenu";
import { CategoriesGetManyOutput } from "@/lib/data/types";

const baseCategory: CategoriesGetManyOutput[1] = {
  id: "1",
  name: "Parent Category",
  slug: "parent-category",
  color: null,
  parent: null,
  subcategories: [],
  updatedAt: "",
  createdAt: "",
};

describe("SubcategoryMenu", () => {
  it("returns null when isOpen is false", () => {
    const { container } = render(
      <SubcategoryMenu
        category={{ ...baseCategory }}
        isOpen={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when subcategories are empty", () => {
    const { container } = render(
      <SubcategoryMenu
        category={{ ...baseCategory, subcategories: [] }}
        isOpen={true}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
