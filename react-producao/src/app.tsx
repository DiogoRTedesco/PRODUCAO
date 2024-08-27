import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from "./pages/layer";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/>,
  },
  {
    path: "/Panel",
    element: <Dashboard/>,
  },
 
  {
    path: "*",
    element: <Dashboard/>,
  }
]);
export function App() {
  return(<RouterProvider router={router} />)
      
    

}


