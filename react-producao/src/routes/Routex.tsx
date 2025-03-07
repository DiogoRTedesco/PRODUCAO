
import { Routes as Switch, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../pages/layer";

import { DashboardCHxCIONE } from "../pages/chxcione";
import { DashboardCH } from '../pages/panelCornHouse';
import { PanelRateioEmb } from "../pages/panelRateio";
import { LoginPage } from "../pages/login";
import { LoginAuth, PrivateRoute } from "./PrivateRoutes";
import { NotFound } from "../notFound";
import { Unauthorized } from "../unauthorized";
import { UserProfilePage } from "../pages/usuario";
import { LogSearchPage } from "../pages/logsSystem";


const Routes = () => {

  return (
    <>
      {/* Barra de navegação, exceto na página de login */}

      <Switch>
        {/* Página de login */}
        <Route
          path="/login"
          element={
            <LoginAuth>
              <LoginPage />
            </LoginAuth>
          }
        />
        <Route path="/PanelCione" element={<Dashboard />} />
        <Route path="/PanelCioneCornHouse" element={<DashboardCHxCIONE />} />
        <Route path="/PanelCornHouse" element={<DashboardCH />} />

        {/* Rota protegida */}
        <Route element={<PrivateRoute roles={["Admin"]} />}>
          <Route path="/users" element={<UserProfilePage />} />
          <Route path="/logs" element={<LogSearchPage />} />
        </Route>

        <Route element={<PrivateRoute roles={["User"]} />}>
          <Route path="/Rateio" element={<PanelRateioEmb />} />
          {/* <Route path="/arquivo/:id" element={<EmployeeDetails />} />*/}
        </Route>

        {/* Página de autorização negada */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Switch>
    </>
  );
};

export { Routes };
