import React, { useCallback, useEffect, useRef } from 'react';
import API_KEYS from '../data/api_keys.json';
import styled from 'styled-components';

const MapStyle = styled.div`
  width: 100%;
`;

const GoogleMap = ({location}) => {
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
        zoom: 17,
        center: location,
      });
      new google.maps.Marker({
        position: location,
        map,
      });
    }, [location]);

    useEffect(() => {
      const script = window.document.getElementsByTagName('script')[0];
      const GOOGLE_MAPS_KEY = API_KEYS.GOOGLE_MAPS_KEY;
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