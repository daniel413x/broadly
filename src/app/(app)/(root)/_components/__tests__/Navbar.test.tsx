import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/app/(app)/(root)/_components/Navbar";

describe("Navbar", () => {
  it("opens the mobile sidebar", async () => {
    render(<Navbar />);
    const menuButton = screen.getByTestId("navbar-menu-button");
    await userEvent.click(menuButton);
    const navbarSidebarContent = screen.getByTestId("navbar-sidebar-content");
    expect(navbarSidebarContent).toBeDefined();
  });
});
