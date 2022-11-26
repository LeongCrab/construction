import "../style/Header.scss";
import { MdSearch, MdClose } from 'react-icons/md';
import React, { useState, useEffect, useRef } from "react";
import Geocode from "react-geocode";

const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;
Geocode.setApiKey(GOOGLE_MAPS_KEY);
Geocode.setLanguage('ko');
Geocode.setRegion('kr');
Geocode.enableDebug();

const addToLoc = async (address) => {
  return Geocode.fromAddress(address)
    .then( res => {
      const { lat, lng } = res.results[0].geometry.location;
      return { lat, lng }
    })
    .catch(err => alert("올바른 주소를 입력해주세요."))
}

const Header = ({setLocation, setMessage}) => {
  const [address, setAddress] = useState('');
  const [history, setHistory] = useState([]);
  const search = useRef(null);

  useEffect(() => {
    search.current.focus();
  }, []);

  const searchLocation = async (e) =>{
    if(e.key === 'Enter'){
      const {lat, lng} = await addToLoc(address);
      setLocation({lat: lat, lng: lng});
      setHistory(prev => [...new Set([address, ...prev])].slice(0, 5));
      setAddress("");
    }
  }
  const getLocation = () => {
    if (navigator.geolocation) {
      setMessage("Loading...")
      navigator.geolocation.getCurrentPosition((position) => {
        setMessage(null);
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(pos);
        },
        () => {
          setMessage("Unable to retrieve your location");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      setMessage("Geolocation is not supported by your browser");
    }
  };

  const HistoryList = () => {
    const HistoryTag = ({address}) => {
      const deleteHistory = (e) => {
        e.stopPropagation();
        setHistory(history.filter(el => el !== address));
      }
      return(
        <div onClick={() => setAddress(address)}>
          {address}
        <button type="button" onClick={deleteHistory}>
          <MdClose className="closeIcon" />
        </button>
      </div>
      );
    }

    return(
      <div className="historyList">
        {history.map((element,idx) => <HistoryTag key={element+idx} address={element}/>)}
      </div>
    );
  }

  return(
    <header>
      <div className="logoWrap">
        <img src="./img/logo.png" className="logo" alt="top_logo"/>
      </div>
      <div className="headerWrap">
        <input
          ref={search}
          placeholder="궁금한 주소를 입력하세요."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          onKeyDown={searchLocation}
        />
        <MdSearch className="searchIcon" />
        <button className="locationBtn" onClick={getLocation}>현재 위치</button>
        <h4>최근 검색</h4>
        <HistoryList />
      </div>
    </header>
  );
};

export default Header;
