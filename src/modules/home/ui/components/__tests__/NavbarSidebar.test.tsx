import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import NavbarSidebar from "@/modules/home/ui/components/NavbarSidebar";

describe("NavbarSidebar", () => {
  it("calls onOpenChange(false) when a link is clicked", async () => {
    const onOpenChangeMock = vi.fn();

    render(
      <NavbarSidebar
        items={[{ href: "/navbarSidebarTestItem", children: "navbarSidebarTestItem" }]}
        open={true}
        onOpenChange={onOpenChangeMock}
      />
    );

    const closeButton = screen.getByText("navbarSidebarTestItem");
    await userEvent.click(closeButton);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
