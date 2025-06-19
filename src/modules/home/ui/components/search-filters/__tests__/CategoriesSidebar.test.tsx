import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoriesSidebar from "../CategoriesSidebar";
import { CategoriesGetManyOutput } from "@/lib/data/types";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const rootCategories: CategoriesGetManyOutput[1][] = [
  {
    id: "1",
    name: "Root A",
    slug: "root-a",
    subcategories: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "Root B",
    slug: "root-b",
    subcategories: [
      {
        id: "3",
        name: "Sub B1",
        slug: "sub-b1",
        subcategories: undefined,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    name: "All Categories",
    slug: "all",
    subcategories: [],
    createdAt: "",
    updatedAt: "",
  },
];

jest.mock("@/trpc/client", () => ({
  useTRPC: () => ({/*  */
    categories: {
      getMany: {
        queryOptions: () => ({
          queryKey: ["categories.getMany"],
          queryFn: async () => rootCategories,
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
      data: rootCategories,
      isLoading: false,
      isError: false,
    }),
  };
});

describe("CategoriesSidebar (with TRPC)", () => {
  const onOpenChangeMock = jest.fn();

  beforeEach(() => {
    pushMock.mockClear();
    onOpenChangeMock.mockClear();
  });

  it("renders when open is true", () => {
    render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Root A")).toBeInTheDocument();
    expect(screen.getByText("Root B")).toBeInTheDocument();
    expect(screen.getByText("All Categories")).toBeInTheDocument();
  });

  it("calls router.push to /root-a and closes sidebar", async () => {
    render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    const btn = screen.getByText("Root A");
    await userEvent.click(btn);
    expect(pushMock).toHaveBeenCalledWith("/root-a");
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it("navigates to / when clicking slug === 'all'", async () => {
    render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    const btn = screen.getByText("All Categories");
    await userEvent.click(btn);
    expect(pushMock).toHaveBeenCalledWith("/");
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it("opens subcategories when a category has children", async () => {
    render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    const btn = screen.getByText("Root B");
    await userEvent.click(btn);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Sub B1")).toBeInTheDocument();
  });

  it("navigates to nested subcategory path", async () => {
    render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByText("Root B"));
    await userEvent.click(screen.getByText("Sub B1"));
    expect(pushMock).toHaveBeenCalledWith("/root-b/sub-b1");
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it("clicking back resets submenu state", async () => {
    render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByText("Root B"));
    await userEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Root A")).toBeInTheDocument();
    expect(screen.queryByText("Sub B1")).not.toBeInTheDocument();
  });

  it("resets state when handleOpenChange is triggered by Sheet", async () => {
    const { rerender } = render(<CategoriesSidebar open onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByText("Root B"));
    rerender(<CategoriesSidebar open={false} onOpenChange={onOpenChangeMock} />);
    expect(screen.queryByText("Sub B1")).not.toBeInTheDocument();
  });
});
