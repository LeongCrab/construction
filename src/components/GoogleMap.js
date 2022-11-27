import React, { useCallback, useEffect, useRef } from "react";
import "../style/googleMap.scss";
import styled from "styled-components";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const MapStyle = styled.div`
  width: 100%;
`;

const GoogleMap = ({ location, data }) => {
  const mapRef = useRef(null);

  const loadScript = useCallback((url) => {
    const firstScript = window.document.getElementsByTagName("script")[0];
    const newScript = window.document.createElement("script");
    newScript.src = url;
    newScript.async = true;
    newScript.defer = true;
    firstScript?.parentNode?.insertBefore(newScript, firstScript);
  }, []);

  const initMap = useCallback(() => {
    const { google } = window;
    if (!mapRef.current || !google) return;
    const zoom = 17;
    const map = new google.maps.Map(mapRef.current, {
      center: location,
      zoom,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      maxZoom: zoom + 3,
      restriction: {
        latLngBounds: {
          north: 37.715133,
          south: 37.413294,
          east: 127.269311,
          west: 126.734086,
        },
      },
    });

    new google.maps.Marker({
      position: location,
      map,
    });



    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 300,
      disableAutoPan: true,
    });
    const markers = data.map((dat) => {
      const position = { lat: dat.LAT, lng: dat.LNG };

      const contentString =
        '<div class="infoWrap">' +
        '<span class="infoHeader">공사명</span>' +
        '<span class="infoBody">'+dat.PJT_NAME +"</span>" +
        "</div>"+
        '<div class="infoWrap">' +
        '<span class="infoHeader">공사위치</span>' +
        '<span class="infoBody">'+dat.OFFICE_ADDR +"</span>" +
        "</div>"+
        '<div class="infoWrap">' +
        '<span class="infoHeader">공사기간</span>' +
        '<span class="infoBody">'+dat.DU_DATE +"</span>" +
        "</div>"+
        '<div class="infoWrap">' +
        '<span class="infoHeader">D-Day</span>' +
        '<span class="infoBody">'+dat.DT3 +" 일</span>" +
        "</div>"+
        '<div class="infoWrap">' +
        '<span class="infoHeader">발주처</span>' +
        '<span class="infoBody">'+dat.ORG_1 +"</span>" +
        "</div>"+
        '<div class="infoWrap">' +
        '<span class="infoHeader">시공사</span>' +
        '<span class="infoBody">'+dat.ORG_3 +"</span>" +
        "</div>"+
        '<div class="infoWrap">' +
        '<span class="infoHeader">공사규모</span>' +
        '<span class="infoBody">'+dat.PJT_SCALE +"</span>" +
        "</div>";

      const svgMarker = {
        path: "M7.68,107.18h16.25l6.72-23.29H92.3l6.65,23.29h16.25c4.22,0,7.68,3.46,7.68,7.68v0 c0,4.22-3.46,7.68-7.68,7.68H7.68c-4.22,0-7.68-3.46-7.68-7.68v0C0,110.64,3.46,107.18,7.68,107.18L7.68,107.18z M35.05,68.64 l6.74-23.36h39.49l6.67,23.36H35.05L35.05,68.64z M46.04,30.55l7.45-25.81c2.5-6.31,13.92-6.33,16.23,0.05l7.35,25.76H46.04 L46.04,30.55z",
        fillColor: "red",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.3,
        anchor: new google.maps.Point(15, 30),
      };

      const marker = new google.maps.Marker({
        position,
        icon: svgMarker,
        map: map,
      });
      marker.addListener("click", () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infoWindow.addListener("closeclick", () => {
          marker.setAnimation(null);
        });
      });
      return marker;
    });

    new MarkerClusterer({ markers, map });
  }, [location, data]);

  useEffect(() => {
    const script = window.document.getElementsByTagName("script")[0];
    const includeCheck = script.src.startsWith(
      "https://maps.googleapis.com/maps/api"
    );

    if (includeCheck) return initMap();

    window.initMap = initMap;
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap&language=ko`
    );
  }, [initMap, loadScript]);

  return <MapStyle ref={mapRef} />;
};

export default GoogleMap;

GoogleMap.defaultProps = {
  location: { lat: 37.5408325, lng: 126.9459381 },
  zoom: 17,
};
