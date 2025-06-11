import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "../SearchInput";

// ✅ Mock useRouter (for internal use in CategoriesSidebar)
// solve invariant expected app router to be mounted
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// ✅ Mock TRPC client
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
    slug: "category-b",
    subcategories: [],
    updatedAt: "",
    createdAt: "",
  },
];

jest.mock("@/trpc/client", () => ({
  useTRPC: () => ({
    categories: {
      getMany: {
        queryOptions: () => ({
          queryKey: ["categories.getMany"],
          queryFn: async () => mockData,
        }),
      },
    },
  }),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: () => ({
      data: mockData,
      isLoading: false,
      isError: false,
    }),
  };
});

describe("SearchInput", () => {
  it("renders search input and button", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText("Search products")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("disables input when disabled prop is true", () => {
    render(<SearchInput disabled />);
    const input = screen.getByPlaceholderText("Search products");
    expect(input).toBeDisabled();
  });

  it("opens sidebar when filter button is clicked", async () => {
    render(<SearchInput />);
    const filterBtn = screen.getByRole("button");
    await userEvent.click(filterBtn);
    expect(screen.getByText("Category A")).toBeInTheDocument(); // Sidebar content appears
  });
});
