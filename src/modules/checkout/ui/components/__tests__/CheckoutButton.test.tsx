import { vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import CheckoutButton from "../CheckoutButton";
import { useCart } from "../../../hooks/useCart";

vi.mock("../../../hooks/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.join(" "),
  generateTenantURL: (tenantSlug: string) => `tenant/${tenantSlug}`,
}));

vi.mock("@/lib/data/routes", () => ({
  CHECKOUT_ROUTE: "checkout",
}));

describe("CheckoutButton", () => {
  const tenantSlug = "test-tenant";

  it("renders correctly with items in the cart", () => {
    (useCart as Mock).mockReturnValue({ totalItems: 3 });

    render(<CheckoutButton tenantSlug={tenantSlug} />);

    const button = screen.getByTestId("checkout-button");
    expect(button).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "tenant/test-tenant/checkout");

    const cartIcon = screen.getByTestId("checkout-button-shoppingcart-icon");
    expect(cartIcon).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders correctly with no items in the cart", () => {
    (useCart as Mock).mockReturnValue({ totalItems: 0 });

    render(<CheckoutButton tenantSlug={tenantSlug} />);

    const button = screen.getByTestId("checkout-button");
    expect(button).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "tenant/test-tenant/checkout");

    const cartIcon = screen.getByTestId("checkout-button-shoppingcart-icon");
    expect(cartIcon).toBeInTheDocument();

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("does not render when hideIfEmpty is true and cart is empty", () => {
    (useCart as Mock).mockReturnValue({ totalItems: 0 });

    const { container } = render(
      <CheckoutButton tenantSlug={tenantSlug} hideIfEmpty />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with one item in the cart", () => {
    (useCart as Mock).mockReturnValue({ totalItems: 1 });

    render(<CheckoutButton tenantSlug={tenantSlug} />);

    const button = screen.getByTestId("checkout-button");
    expect(button).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
