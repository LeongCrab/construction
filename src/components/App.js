import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import '../style/app.scss';
import Header from './Header';
import GoogleMap from './GoogleMap';
import Info from './Info';
import { FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const SEOUL_KEY = process.env.REACT_APP_SEOUL_KEY;

function App() {
  const [location, setLocation] = useState();
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(true);
  const [idx, setIdx] = useState(1);
  const [info, setInfo] = useState({});
  
  const fetchData = useCallback( async () => {
    const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_KEY}/json/ListOnePMISBizInfo/${idx}/${idx + 999}`;

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
        AIR_VIEW_IMG: dat.AIR_VIEW_IMG, // 조감도 링크
      };
      setData(prev => prev.concat(datum));
    }
    try {
      const loaded = await axios({
        method: 'get',
        url: url,
      });
      if (loaded.data.ListOnePMISBizInfo) {
        await loaded.data.ListOnePMISBizInfo.row.forEach(dat => saveData(dat));
        await setFetching(true);
      }
    }
    catch(err) {
      setFetching(false);
      alert(err);
    }
  }, [idx]);

  useEffect(() => {
    if (isFetching) {
      setFetching(false);
      fetchData(idx);
      console.log(data);
      setIdx(prev => prev + 1000);
    }
  }, [isFetching]);

  return (
    <div className="app_wrap">
      <Header setLocation={setLocation} />
      <div className='body_wrap'>
        <GoogleMap location={location} data={data} setInfo={setInfo}/>
        <Info info={info} />
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