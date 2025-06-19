import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/modules/home/ui/components/Navbar";

// solve:
/*
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.
*/ 
jest.mock("@/trpc/client", () => ({
  useTRPC: () => ({
    auth: {
      session: {
        queryOptions: () => {},
      },
    },
  }),
}));

jest.mock("@tanstack/react-query", () => ({
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
