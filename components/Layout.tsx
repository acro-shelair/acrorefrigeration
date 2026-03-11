import { ReactNode } from "react";

// Navbar, Footer, and LoadingScreen now live in app/layout.tsx (mounted once).
// This component is kept as a passthrough so page components don't need changes.
const Layout = ({ children }: { children: ReactNode }) => <>{children}</>;

export default Layout;
