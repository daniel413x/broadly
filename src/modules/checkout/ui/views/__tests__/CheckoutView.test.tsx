import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ReactQuery from "@tanstack/react-query";
import CheckoutView from "../CheckoutView";
import { toast } from "sonner";
import { useCart } from "../../../hooks/useCart";
import { useTRPC } from "@/trpc/client";
import { ReactNode } from "react";
import { vi, Mock } from "vitest";

// solve: frustratingly rendering only the loading state
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof ReactQuery>();
  return {
    ...actual,
    useQuery: vi.fn(), // override only useQuery
  };
});
vi.mock("../../../hooks/useCart");
vi.mock("@/trpc/client");
// vi.mock("@tanstack/react-query");
vi.mock("sonner", () => ({
  toast: {
    warning: vi.fn(),
  },
}));

const mockUseQuery = ReactQuery.useQuery as unknown as Mock;
const mockUseCart = useCart as Mock;
const mockUseTRPC = useTRPC as Mock;
// const mockUseQuery = useQuery as Mock;

const queryClient = new QueryClient();

const renderWithProviders = (ui: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("CheckoutView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseCart.mockReturnValue({
      productIds: [],
      clearAllCarts: vi.fn(),
      removeProduct: vi.fn(),
    });
    mockUseTRPC.mockReturnValue({
      checkout: {
        getProducts: {
          queryOptions: vi.fn(),
        },
      },
    });
    mockUseQuery.mockReturnValue({
      data: {
        docs: [],
      },
      error: undefined,
      isLoading: true,
    });

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    expect(screen.getByTestId("loading-wrapper")).toBeInTheDocument();
  });

  it("renders no products found state", async () => {
    mockUseCart.mockReturnValue({
      productIds: [],
      clearAllCarts: vi.fn(),
      removeProduct: vi.fn(),
    });
    mockUseTRPC.mockReturnValue({
      checkout: {
        getProducts: {
          queryOptions: vi.fn(),
        },
      },
    });
    mockUseQuery.mockReturnValue({
      data: {
        docs: [],
      },
      error: undefined,
      isLoading: false,
    });

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    await waitFor(() => {
      expect(screen.getByTestId("no-products-found-wrapper")).toBeInTheDocument();
    });
  });

  it("renders products and sidebar", async () => {
    mockUseCart.mockReturnValue({
      productIds: ["1", "2"],
      clearAllCarts: vi.fn(),
      removeProduct: vi.fn(),
    });
    mockUseQuery.mockReturnValue({
      data: {
        docs: [
          {
            id: "1",
            name: "Product 1",
            image: { url: "/product1.png" },
            tenant: { slug: "tenant1", name: "Tenant 1" },
            price: 100,
          },
        ],
        totalPrice: 100,
      },
      error: undefined,
      isLoading: false,
    });
    mockUseTRPC.mockReturnValue({
      checkout: {
        getProducts: {
          queryOptions: vi.fn(),
        },
      },
    });

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    await waitFor(() => {
      const wrapper = screen.getByTestId("products-found-wrapper");
      expect(wrapper).toBeInTheDocument();
    });
  });

  it("clears cart and shows warning on NOT_FOUND error", async () => {
    const clearAllCartsMock = vi.fn();
    mockUseCart.mockReturnValue({
      productIds: ["1", "2"],
      clearAllCarts: clearAllCartsMock,
      removeProduct: vi.fn(),
    });
    mockUseQuery.mockReturnValue({
      data: {
        docs: [
          {
            id: "1",
            name: "Product 1",
            image: { url: "/product1.png" },
            tenant: { slug: "tenant1", name: "Tenant 1" },
            price: 100,
          },
          {
            id: "2",
            name: "Product 2",
            image: { url: "/product1.png" },
            tenant: { slug: "tenant1", name: "Tenant 1" },
            price: 100,
          },
        ],
        totalPrice: 200,
      },
      error: { data: { code: "NOT_FOUND" } },
      isLoading: false,
    });
    mockUseTRPC.mockReturnValue({
      checkout: {
        getProducts: {
          queryOptions: vi.fn(),
        },
      },
    });

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    await waitFor(() => {
      expect(clearAllCartsMock).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith(
        "Invalid products found, cart cleared"
      );
    });
  });
});
