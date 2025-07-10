import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "../SearchInput";
import { vi } from "vitest";

// ✅ Mock useRouter (for internal use in CategoriesSidebar)
// solve invariant expected app router to be mounted
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
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

vi.mock("@/trpc/client", () => ({
  useTRPC: () => ({
    auth: {
      session: {
        queryOptions: () => {},
      },
    },
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

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    session: {
      data: {
        user: {},
      },
    },
  }),
}));

vi.mock("@tanstack/react-query", () => {
  const actual = vi.importActual("@tanstack/react-query");
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
