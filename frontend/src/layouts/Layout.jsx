import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Toaster } from "sonner"

const Layout = () => {
    return (
        <>
            <Navbar />
            <Toaster />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
