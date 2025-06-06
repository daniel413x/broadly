import { render, screen } from "@testing-library/react";
import SubcategoryMenu from "../SubcategoryMenu";
import { NoDocCategory } from "@/lib/data/types";

const baseCategory: NoDocCategory = {
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
        position={{ top: 0, left: 0 }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when subcategories are empty", () => {
    const { container } = render(
      <SubcategoryMenu
        category={{ ...baseCategory, subcategories: [] }}
        isOpen={true}
        position={{ top: 0, left: 0 }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders subcategory links when isOpen is true and subcategories exist", () => {
    const categoryWithSubs: NoDocCategory = {
      ...baseCategory,
      color: "#ABCDEF",
      subcategories: [
        {
          ...baseCategory,
          id: "2",
          name: "Subcat 1",
          slug: "subcat-1",
          subcategories: [],
        },
        {
          ...baseCategory,
          id: "3",
          name: "Subcat 2",
          slug: "subcat-2",
          subcategories: [],
        },
      ],
    };

    render(
      <SubcategoryMenu
        category={categoryWithSubs}
        isOpen={true}
        position={{ top: 100, left: 200 }}
      />
    );

    // Check subcategory names
    expect(screen.getByText("Subcat 1")).toBeDefined();
    expect(screen.getByText("Subcat 2")).toBeDefined();

    // Check top and left style
    const menuContainer = screen.getByText("Subcat 1").closest(".fixed");
    expect(menuContainer).toHaveStyle({ top: "100px", left: "200px" });
  });
});
