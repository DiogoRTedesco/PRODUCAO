import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from "./pages/layer";

import { DashboardCH } from './pages/panelCornHouse/index';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/PanelCornHouse",
    element: <DashboardCH />,
  },

  {
    path: "*",
    element: <Dashboard />,
  }
]);
export function App() {
  return (<RouterProvider router={router} />)



}


