import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import '../style/app.scss';
import Header from './Header';
import GoogleMap from './GoogleMap';
import { FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const SEOUL_KEY = process.env.REACT_APP_SEOUL_KEY;

function App() {
  const [location, setLocation] = useState();
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  
  const fetchData = useCallback( async () => {
    const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_KEY}/json/ListOnePMISBizInfo/${page}/${page + 999}`;

    const saveData = dat => {
      const datum = {
        PJT_CD: dat.PJT_CD, // 사업코드
        PJT_NAME: dat.PJT_NAME, // 사업명
        OFFICE_ADDR: dat.OFFICE_ADDR, // 공사위치
        LAT: dat.LAT, // 위도
        LNG: dat.LNG, // 경도
        DU_DATE: dat.DU_DATE, //공사기간
        DT3: dat.DT3, // D-Day
        ORG_1: dat.ORG_1, // 발주처
        ORG_3: dat.ORG_3, // 시공사 업체명
        PJT_SCALE: dat.PJT_SCALE, // 사업규모
      };
      setData(prev => prev.concat(datum));
    }
    try {
      const loaded = await axios({
        method: 'get',
        url: url,
      });
      if (loaded.data.ListOnePMISBizInfo) {
        setMessage("공사장 정보를 받아오는 중...");
        await loaded.data.ListOnePMISBizInfo.row.forEach(dat => saveData(dat));
        await setFetching(true);
      }
      else {
        setLoading(false);
        setMessage(null);
      }

    }
    catch(err) {
      setFetching(false);
      setMessage(err);
    }
  }, [page]);

  useEffect(() => {
    if (isFetching) {
      setFetching(false);
      fetchData(page);
      setPage(prev => prev + 1000);
    }
  }, [isFetching]);

  return (
    <div className="app_wrap">
      <Header setLocation={setLocation} setMessage={setMessage} />
      <div className='body_wrap'>
        {message && (<div className='message'>{message}</div> )}
        {message === null && (<GoogleMap isLoading={isLoading} location={location} data={data} setMessage={setMessage} />)}
      </div>
      <footer>
        <div>
          본 서비스는 서울시 내 건설 공사 정보를 제공합니다. 모든 데이터의 저작권은 서울특별시에 있습니다.
        </div>
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