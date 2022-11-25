import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const MapStyle = styled.div`
  width: 100%;
`;

const GoogleMap = ({location, data, setInfo}) => {
    const mapRef = useRef(null);

    const loadScript = useCallback((url) => {
      const firstScript = window.document.getElementsByTagName('script')[0];
      const newScript = window.document.createElement('script');
      newScript.src = url;
      newScript.async = true;
      newScript.defer = true;
      firstScript?.parentNode?.insertBefore(newScript, firstScript);
    }, []);


    const initMap = useCallback(() => {
      const { google } = window;
      if (!mapRef.current || !google) return;

      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 17,
      });
      new google.maps.Marker({
        position: location,
        map,
        label: "현재 위치",
      });

      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      });
      const markers = data.map(dat => {
        const position = {lat: dat.LAT, lng: dat.LNG};

        const marker = new google.maps.Marker({
          position,
        });
        
        marker.addListener("click", () => {
          infoWindow.setContent(dat.PJT_NAME);
          infoWindow.open(map, marker);
          setInfo(dat);
        });
        return marker;
      });
    
      new MarkerClusterer({ markers, map });
    }, [location, data]);

    useEffect(() => {
      const script = window.document.getElementsByTagName('script')[0];
      const includeCheck = script.src.startsWith(
        'https://maps.googleapis.com/maps/api'
      );

      if (includeCheck) return initMap();

      window.initMap = initMap;
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap&language=ko`
      );
    }, [initMap, loadScript]);

    return <MapStyle ref={mapRef} />;
  }

  export default GoogleMap;

  GoogleMap.defaultProps= {
    location: { lat: 37.5408325, lng: 126.9459381 },
    zoom: 17,
  };