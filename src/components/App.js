import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import '../style/App.scss';
import Header from './Header';
import GoogleMap from './GoogleMap';
import API_KEYS from '../data/api_keys.json';
import { FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

function App() {
  const [location, setLocation] = useState({lat: 37.5408325, lng: 126.9459381});
  const [result, setResult] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const SEOUL_KEY = API_KEYS.SEOUL_KEY;
      const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_KEY}/xml/ListOnePMISBizInfo/1/5`;
      try {
        const data = await axios({
          method: 'get',
          url: url,
        });
        setResult(data);
      }
      catch(err) {
        alert(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="app_wrap">
      <Header location={location} setLocation={setLocation}>
        헤더
      </Header>
      <div className='body_wrap'>
        <GoogleMap location={location} />
        <aside>
          {/* 조감도 있을 때만 나타내기 */}
          <div>
            <span className='header'>조감도</span>
            <span className='body'>
              <img src="https://cis.seoul.go.kr/data/edms//202103/210329161699950551709.edm" alt="사진 없음"/>
            </span>
          </div>
          <div>
            <span className='header'>주무기관</span>
            <span className='body'>서울주택도시공사</span>
          </div>
          <div>
            <span className='header'>공사명</span>
            <span className='body'>강동센터 임대아파트 시설물 유지보수공사</span>
          </div>
          <div>
            <span className='header'>공사기간</span>
            <span className='body'>	2021-04-01 ~ 2023-03-31</span>
          </div>
          <div>
            <span className='header'>D-Day</span>
            <span className='body'>128일</span>
          </div>
          <div>
            <span className='header'>공사위치</span>
            <span className='body'>서울 강동구 아리수로93가길 25 등 강동센터 관내 임대아파트</span>
          </div>
          <div>
            <span className='header'>시공사</span>
            <span className='body'>제이엠종합건설(주)</span>
          </div>
          <div>
            <span className='header'>현장대리인</span>
            <span className='body'>박호봉(Tel: 02-535-7149)</span>
          </div>
          <div>
            <span className='header'>공사규모</span>
            <span className='body'>	강동센터 임대아파트 시설물 유지보수공사</span>
          </div>
          <div>
            <span className='header'>웹페이지</span>
            <span className='body'>
              <a href="https://cis.seoul.go.kr/TotalAlimi_new/PopInfo.action?cmd=info1&pjt_cd=7042021032995" target="_blank" rel="noopener noreferrer" >
                https://cis.seoul.go.kr/TotalAlimi_new/PopInfo.action?cmd=info1&pjt_cd=7042021032995
              </a>
              </span>
          </div>
        </aside>
      </div>
      <footer>
        <div>
          <div>
            <FaGithub className='icon' />
            <h5>
              https://github/LeongCrab
            </h5>
          </div>
          <div>
            <MdEmail className='icon' /> 
            <h5>
              dladuscjf8@gmail.com
            </h5>
          </div>
          
        </div> 
      </footer>
    </div>
  );
}

export default App;