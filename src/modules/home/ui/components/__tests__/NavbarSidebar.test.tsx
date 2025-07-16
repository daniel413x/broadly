import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import NavbarSidebar from "@/modules/home/ui/components/NavbarSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/trpc/client", () => ({
  useTRPC: () => ({
    auth: {
      session: {
        queryOptions: () => ({}),
      },
    },
  }),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("NavbarSidebar", () => {
  it("calls onOpenChange(false) when a link is clicked", async () => {
    const onOpenChangeMock = vi.fn();

    renderWithProviders(
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
