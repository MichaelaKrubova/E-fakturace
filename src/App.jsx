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
import MyAccount from './pages/MyAccount';
import MyDocuments from './pages/MyDocuments';
import EditDocument from './pages/EditDocument';
import PdfView from './pages/PdfView';


const App = () => {
  return (
    <>
      <NavBar />
      <main className='main-content' id='content'>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/nova-faktura" element={<NewDoc />}/>
          <Route path="/muj-ucet" element={<MyAccount />}/>
          <Route path="/moje-dokumenty" element={<MyDocuments />}/>
          <Route path="/edit/:id" element={<EditDocument />} />
          <Route path="//pdf-view/:id" element={<PdfView />} />
        </Routes>
      </main>
    </>
  )
}

export default App
