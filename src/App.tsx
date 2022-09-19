import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Component/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:movieId/*" element={<Home/>}/>
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/:tvId/*" element={<Tv/>}/>
        </Route>

        <Route path="/search" element={<Search />}>
          <Route path="/search/tv/:tvId/*" element={<Search/>}/>
          <Route path="/search/movie/:movieId/*" element={<Search/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
