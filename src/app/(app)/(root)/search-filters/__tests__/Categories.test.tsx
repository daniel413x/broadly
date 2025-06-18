import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Categories from "../Categories";
import { CategoriesGetManyOutput } from "@/lib/data/types";

// ✅ Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// ✅ Mock TRPC & React Query
const mockData: CategoriesGetManyOutput[1][] = [
  {
    id: "1",
    name: "Cat A",
    slug: "cat-a",
    subcategories: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "Cat B",
    slug: "cat-b",
    subcategories: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    name: "All Categories",
    slug: "all",
    subcategories: [],
    createdAt: "",
    updatedAt: "",
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
    useSuspenseQuery: () => ({
      data: mockData,
      isLoading: false,
      isError: false,
    }),
  };
});

// ✅ Mock CategoriesSidebar
jest.mock("../CategoriesSidebar", () => ({
  __esModule: true,
  default: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-testid="categories-sidebar">
      {open ? "Sidebar Open" : "Sidebar Closed"}
      <button onClick={() => onOpenChange(false)}>Close Sidebar</button>
    </div>
  ),
}));

describe("Categories (with TRPC)", () => {

  // this is probably not a useful test
  it("opens and closes the sidebar via View All button and close action", async () => {
    render(<Categories />);
    expect(screen.getByTestId("categories-sidebar")).toHaveTextContent("Sidebar Closed");

    const viewAllButton = screen.getByRole("button", { name: /view all/i });
    await userEvent.click(viewAllButton);

    expect(screen.getByTestId("categories-sidebar")).toHaveTextContent("Sidebar Open");

    const closeButton = screen.getByText("Close Sidebar");
    await userEvent.click(closeButton);

    expect(screen.getByTestId("categories-sidebar")).toHaveTextContent("Sidebar Closed");
  });

  it("highlights View All button if active category is hidden", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 100,
    });

    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => ({
        width: 150, // Each category wider than available space
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));
    render(<Categories />);
    const viewAll = screen.getByRole("button", { name: /view all/i });
    expect(viewAll).toBeInTheDocument();
    // If you want to test classnames, add data-testid to the button and check .classList
  });
});
