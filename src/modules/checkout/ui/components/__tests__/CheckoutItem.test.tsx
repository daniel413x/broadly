import { render, screen, fireEvent } from "@testing-library/react";
import CheckoutItem from "../CheckoutItem";

describe("CheckoutItem", () => {
  const mockOnRemove = jest.fn();
  const defaultProps = {
    id: "1",
    name: "Test Product",
    productUrl: "/product/test-product",
    tenantUrl: "/tenant/test-tenant",
    tenantName: "Test Tenant",
    onRemove: mockOnRemove,
    price: 100,
    imageUrl: "/test-image.jpg",
    isLast: false,
  };

  it("renders the product name, tenant name, and price", () => {
    render(<CheckoutItem {...defaultProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Tenant")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", () => {
    render(<CheckoutItem {...defaultProps} />);
    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledWith("1");
  });

  it("applies the correct border class when isLast is true", () => {
    const { container } = render(<CheckoutItem {...defaultProps} isLast={true} />);
    expect(container.firstChild).toHaveClass("border-b-0");
  });

  it("renders links to the product and tenant pages", () => {
    render(<CheckoutItem {...defaultProps} />);
    const productLink = screen.getByText("Test Product").closest("a");
    const tenantLink = screen.getByText("Test Tenant").closest("a");

    expect(productLink).toHaveAttribute("href", "/product/test-product");
    expect(tenantLink).toHaveAttribute("href", "/tenant/test-tenant");
  });
});
