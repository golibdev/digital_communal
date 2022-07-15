import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { AppLayout } from "./layouts/AppLayout";
import { Loader } from "./components/Loader";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Home } from "./pages/Home";
import { Organization } from "./pages/Organization/Organization";
import { OrganizationCreate } from "./pages/Organization/OrganizationCreate";
import { OrganizationUpdate } from "./pages/Organization/OrganizationUpdate";
import { Services } from "./pages/Services/Services";
import { CreateService } from "./pages/Services/CreateService";
import './App.css'

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
            <Route path="organization/update/:id" element={<OrganizationUpdate t={t} />} />
            <Route path="services" element={<Services t={t} />}/>
            <Route path="services/create" element={<CreateService t={t} />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
  return <Loader/>
}

export default App
