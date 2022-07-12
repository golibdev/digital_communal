import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { AppLayout } from "./layouts/AppLayout";
import { Loader } from "./components/Loader";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Home } from "./pages/Home";
import { Organization } from "./pages/Organization";
import { OrganizationCreate } from "./pages/OrganizationCreate";

function App() {
  const { t, i18n, ready } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  if(ready) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login t={t} />} />
          <Route path="/admin" element={<AppLayout t={t} changeLanguage={changeLanguage} />} >
            <Route index element={<div>Admin</div>} />
            <Route path="users" element={<Users t={t} />} />
            <Route path="organization" element={<Organization t={t} />} />
            <Route path="organization/create" element={<OrganizationCreate t={t} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
  return <Loader/>
}

export default App
