import PatientJourneyLanding from "../components/features/patientJourney/Landing/PatientJourneyLanding";
import Account from "../components/features/patientJourney/Pages/Account";
import Resources from "../components/features/patientJourney/Pages/Resources";
import TouchPoints from "../components/features/patientJourney/Pages/TouchPoints";

export const privateRoutes = [
          { path: "/home", element: <PatientJourneyLanding /> },
          { path: "/touchpoints", element: <TouchPoints /> },
          { path: "/resources", element: <Resources /> },
          { path: "/account", element: <Account /> },
        ]