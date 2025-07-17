import { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ReactQuery from "@tanstack/react-query";
import CheckoutView from "../CheckoutView";
import { toast } from "sonner";
import { useCart } from "../../../hooks/useCart";
import { useTRPC } from "@/trpc/client";
import { vi, Mock } from "vitest";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

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

const mockBasicState = () => {
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
      purchase: {
        mutationOptions: vi.fn(),
      },
    },
    library: {
      getMany: {
        infiniteQueryOptions: vi.fn(),
        infiniteQueryFilter: vi.fn(),
      }
    }
  });
  mockUseQuery.mockReturnValue({
    data: {
      docs: [],
    },
    error: undefined,
    isLoading: false,
  });
};

const queryClient = new QueryClient();

const renderWithProviders = (ui: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    {
      // solve:
      // Error: [nuqs] nuqs requires an adapter to work with your framework.
      wrapper: withNuqsTestingAdapter(),
    }
  );
};

describe("CheckoutView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockBasicState();
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
    mockBasicState();

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    await waitFor(() => {
      expect(screen.getByTestId("no-products-found-wrapper")).toBeInTheDocument();
    });
  });

  it("renders products and sidebar", async () => {
    mockBasicState();
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
            image: { url: "/product.png" },
            tenant: { slug: "tenant1", name: "Tenant 1" },
            price: 100,
          },
          {
            id: "2",
            name: "Product 2",
            image: { url: "/product.png" },
            tenant: { slug: "tenant1", name: "Tenant 1" },
            price: 100,
          },
        ],
        totalPrice: 100,
      },
      error: undefined,
      isLoading: false,
    });

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    await waitFor(() => {
      const wrapper = screen.getByTestId("products-found-wrapper");
      expect(wrapper).toBeInTheDocument();
    });
  });

  it("clears cart and shows warning on NOT_FOUND error", async () => {
    const clearCartMock = vi.fn();
    mockUseCart.mockReturnValue({
      productIds: ["1", "2"],
      clearCart: clearCartMock,
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

    renderWithProviders(<CheckoutView tenantSlug="test-tenant" />);

    await waitFor(() => {
      expect(clearCartMock).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith(
        "Invalid products found, cart cleared"
      );
    });
  });
});
