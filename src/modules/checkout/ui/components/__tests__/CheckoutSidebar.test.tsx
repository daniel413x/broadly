import { render, screen, fireEvent } from "@testing-library/react";
import CheckoutSidebar from "../CheckoutSidebar";

describe("CheckoutSidebar", () => {
  it("renders the total amount when provided", () => {
    render(<CheckoutSidebar total={100} onCheckout={jest.fn()} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  it("does not render the total amount when not provided", () => {
    render(<CheckoutSidebar onCheckout={jest.fn()} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.queryByText("$")).not.toBeInTheDocument();
  });

  it("renders the checkout button and calls onCheckout when clicked", () => {
    const onCheckoutMock = jest.fn();
    render(<CheckoutSidebar onCheckout={onCheckoutMock} />);
    const button = screen.getByRole("button", { name: /checkout/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onCheckoutMock).toHaveBeenCalledTimes(1);
  });

  it("disables the checkout button when isPending is true", () => {
    render(<CheckoutSidebar onCheckout={jest.fn()} isPending={true} />);
    const button = screen.getByRole("button", { name: /checkout/i });
    expect(button).toBeDisabled();
  });

  it("shows the error message when isCanceled is true", () => {
    render(<CheckoutSidebar onCheckout={jest.fn()} isCanceled={true} />);
    expect(screen.getByText("Checkout failed. Please try again.")).toBeInTheDocument();
  });

  it("does not show the error message when isCanceled is false", () => {
    render(<CheckoutSidebar onCheckout={jest.fn()} isCanceled={false} />);
    expect(screen.queryByText("Checkout failed. Please try again.")).not.toBeInTheDocument();
  });
});
