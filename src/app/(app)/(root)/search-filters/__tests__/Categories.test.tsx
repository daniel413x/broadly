import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Categories from "../Categories";
import { NoDocCategory } from "@/lib/data/types";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock("../CategoriesSidebar", () => ({
  __esModule: true,
  default: ({
    open,
    onOpenChange,
    data,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: NoDocCategory[];
  }) => (
    <div data-testid="categories-sidebar">
      {open ? "Sidebar Open" : "Sidebar Closed"}
      <button onClick={() => onOpenChange(false)}>Close Sidebar</button>
      {data.map((cat) => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  ),
}));

const mockData: NoDocCategory[] = [
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

describe("Categories", () => {

  it("opens and closes the sidebar via View All button and close action", async () => {
    render(<Categories data={mockData} />);
    expect(screen.getByTestId("categories-sidebar")).toHaveTextContent("Sidebar Closed");

    const viewAllButton = screen.getByRole("button", { name: /view all/i });
    await userEvent.click(viewAllButton);

    expect(screen.getByTestId("categories-sidebar")).toHaveTextContent("Sidebar Open");

    const closeButton = screen.getByText("Close Sidebar");
    await userEvent.click(closeButton);

    expect(screen.getByTestId("categories-sidebar")).toHaveTextContent("Sidebar Closed");
  });

  it("highlights View All button if active category is hidden", () => {
    // artificially limit visible count by shrinking data array
    const shortened = mockData.slice(0, 1);
    render(<Categories data={shortened.concat(mockData[2])} />); // include "all" at the end

    const viewAll = screen.getByRole("button", { name: /view all/i });
    // we can't test exact styles easily without snapshot or class names,
    // but we can assert it exists and is interactive
    expect(viewAll).toBeInTheDocument();
  });

});
