import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryDropdown from "../CategoryDropdown";

jest.mock("../hooks/useDropdownPosition", () => ({
  // solve TypeError: (0 , _useDropdownPosition.default) is not a function
  __esModule: true,
  default: () => ({
    getDropdownPosition: () => ({ top: 100, left: 200 }),
  }),
}));

jest.mock("../SubcategoryMenu", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    <div data-testid="subcategory-menu">{isOpen ? "Open" : "Closed"}</div>,
}));

describe("CategoryDropdown", () => {
  const categoryWithSubcats = {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    subcategories: [
      {
        id: "2",
        name: "Phones",
        slug: "phones",
        subcategories: [],
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "",
    updatedAt: "",
  };

  const categoryWithoutSubcats = {
    ...categoryWithSubcats,
    subcategories: [],
  };

  it("renders the button with correct text and link", () => {
    render(
      <CategoryDropdown
        category={categoryWithSubcats}
        isActive={false}
        isNavigationHovered={false}
      />
    );
    const link = screen.getByRole("link", { name: "Electronics" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/electronics");
  });

  it("applies active class styles when isActive is true and not hovered", () => {
    render(
      <CategoryDropdown
        category={categoryWithSubcats}
        isActive={true}
        isNavigationHovered={false}
      />
    );
    const button = screen.getByRole("link");
    expect(button).toHaveClass("bg-white");
    expect(button).toHaveClass("border-primary");
  });

  it("shows subcategory menu on hover if subcategories exist", async () => {
    render(
      <CategoryDropdown
        category={categoryWithSubcats}
        isActive={false}
        isNavigationHovered={false}
      />
    );
     
    const wrapper = screen.getByTestId("electronics-category-dropdown").parentElement!;
    expect(screen.getByTestId("subcategory-menu")).toHaveTextContent("Closed");
    await userEvent.hover(wrapper);
    expect(screen.getByTestId("subcategory-menu")).toHaveTextContent("Open");
  });

  it("does not render triangle if no subcategories", () => {
    render(
      <CategoryDropdown
        category={categoryWithoutSubcats}
        isActive={false}
        isNavigationHovered={false}
      />
    );
    const triangle = screen.queryByTestId("dropdown-triangle");
    expect(triangle).not.toBeInTheDocument();
  });

  it("renders triangle and applies opacity when open", async () => {
    render(
      <CategoryDropdown
        category={categoryWithSubcats}
        isActive={false}
        isNavigationHovered={false}
      />
    );
     
    const wrapper = screen.getByTestId("electronics-category-dropdown").parentElement!;
    await userEvent.hover(wrapper);
    const triangle = wrapper.querySelector("div[class*='border-b']");
    expect(triangle).toHaveClass("opacity-100");
  });
});
