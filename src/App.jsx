import { useState } from 'react'
import NavBar from './components/header/Navbar'
import {
  RouterProvider,
  Routes,
  Route,
  Router,
  Link,
} from "react-router-dom";
import Home from "./pages/Home"
import NewDoc from "./pages/NewDoc"



const App = () => {
  return (
    <>
      <NavBar />
      <main className='main-content' id='content'>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/nova-faktura" element={<NewDoc />}/>
        </Routes>
      </main>
    </>
  )
}

export default App
