import * as React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTracking } from "react-tracking";
import { Keycloak } from "./components/common";
import { actions } from "./store";
import Routes from "./components/common/Routes";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { Track } = useTracking(
    { page: location.pathname },
    {
      dispatch: (data) => {
        dispatch(actions.tracking(data));
      },
    }
  );

  return (
    <Track>
      <div className="App">
        {/* <Keycloak /> */}
        <Routes></Routes>
      </div>
    </Track>
  );
}

export default App;
