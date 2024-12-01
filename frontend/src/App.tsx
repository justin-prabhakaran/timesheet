
import UserManagementPage from "@/pages/UserManagementPage.tsx";
import {ProjectManagement} from "@/pages/ProjectManagement.tsx";
import ProjectEditPage from "@/pages/projectEditPage.tsx";
import TimeLogManagement from "@/pages/TimeLogManagment.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import { Route, Routes} from "react-router-dom";

export default function App() {
    return (
        <>
            <Routes>
                <Route path={"/"}  element={<LoginPage/>}/>
                <Route path={"/project"} element={<ProjectManagement />} />
                <Route path={"/users"} element={<UserManagementPage/> } />
                <Route path={"/edit/:projectId"} element={<ProjectEditPage />} />
                <Route path={"timelog"} element={<TimeLogManagement/>} />
            </Routes>

        </>
    );
}
