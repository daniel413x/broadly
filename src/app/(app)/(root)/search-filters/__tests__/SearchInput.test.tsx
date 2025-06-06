import { render, screen } from "@testing-library/react";
import SearchInput from "../SearchInput";

// solve: invariant expected app router to be mounted
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("SearchInput", () => {
  const mockData = [
    {
      id: "1",
      name: "Category A",
      slug: "category-a",
      subcategories: [],
      updatedAt: "",
      createdAt: "",
    },
    {
      id: "2",
      name: "Category B",
      slug: "category-a",
      subcategories: [],
      updatedAt: "",
      createdAt: "",
    },
  ];

  it("renders search input and button", () => {
    render(<SearchInput data={mockData} />);
    expect(screen.getByPlaceholderText("Search products")).toBeDefined();
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("disables input when disabled prop is true", () => {
    render(<SearchInput data={mockData} disabled />);
    
    const input = screen.getByPlaceholderText("Search products");
    expect(input).toHaveProperty("disabled");
  });
});
