import { vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CheckoutSidebar from "../CheckoutSidebar";

describe("CheckoutSidebar", () => {
  it("renders the total amount when provided", () => {
    render(<CheckoutSidebar total={100} onCheckout={vi.fn()} />);
    expect(screen.getByText("Total")).toBeDefined();
    expect(screen.getByText("$100")).toBeDefined();
  });

  it("does not render the total amount when not provided", () => {
    render(<CheckoutSidebar onCheckout={vi.fn()} />);
    expect(screen.getByText("Total")).not.toBeNull();
    expect(screen.queryByText("$")).toBeNull();
  });

  it("renders the checkout button and calls onCheckout when clicked", () => {
    const onCheckoutMock = vi.fn();
    render(<CheckoutSidebar onCheckout={onCheckoutMock} />);
    const button = screen.getByRole("button", { name: /checkout/i });
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(onCheckoutMock).toHaveBeenCalledTimes(1);
  });

  it("disables the checkout button when isPending is true", () => {
    render(<CheckoutSidebar onCheckout={vi.fn()} isPending={true} />);
    const button = screen.getByRole("button", { name: /checkout/i });
    expect(button).toHaveProperty("disabled");
  });

  it("shows the error message when isCanceled is true", () => {
    render(<CheckoutSidebar onCheckout={vi.fn()} isCanceled={true} />);
    expect(screen.getByText("Checkout failed. Please try again.")).toBeDefined();
  });

  it("does not show the error message when isCanceled is false", () => {
    render(<CheckoutSidebar onCheckout={vi.fn()} isCanceled={false} />);
    expect(screen.queryByText("Checkout failed. Please try again.")).toBeNull();
  });
});
