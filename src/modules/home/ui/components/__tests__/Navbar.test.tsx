import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Navbar from "@/modules/home/ui/components/Navbar";

vi.mock("next/font/google", () => ({
  Poppins: vi.fn(() => ({
    className: "poppins-font",
  })),
}));

vi.mock("@/trpc/client", () => ({
  useTRPC: () => ({
    auth: {
      session: {
        queryOptions: () => ({}),
      },
    },
  }),
}));

// fix error Error: useTRPC() can only be used inside of a <TRPCProvider>
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    session: {
      data: {
        user: {},
      },
    },
  }),
}));

describe("Navbar", () => {
  it("opens the mobile sidebar", async () => {
    render(<Navbar />);
    const menuButton = screen.getByTestId("navbar-menu-button");
    await userEvent.click(menuButton);
    const navbarSidebarContent = screen.getByTestId("navbar-sidebar-content");
    expect(navbarSidebarContent).toBeDefined();
  });
});
