import React from "react";
import '../style/info.scss';

const Info = ({info}) => {
    return(
      <aside>
        {info.AIR_VIEW_IMG && (
          <div>
            <span className='header'>조감도</span>
            <span className='body'>
              <img src={info.AIR_VIEW_IMG} alt={info.PJT_NAME}/>
            </span>
          </div>
        )}
        <div>
          <span className='header'>공사명</span>
          <span className='body'>{info.PJT_NAME}</span>
        </div>
        <div>
          <span className='header'>공사위치</span>
          <span className='body'>{info.OFFICE_ADDR}</span>
        </div>
        <div>
          <span className='header'>공사기간</span>
          <span className='body'>{info.DU_DATE}</span>
        </div>

        {info.DT3 !== 0 && (
          <div>
            <span className='header'>D-Day</span>
            <span className='body'>{info.DT3? `${info.DT3} 일`: ""}</span>
          </div>
        )}
        {info.ORG_1 && (
          <div>
            <span className='header'>발주처</span>
            <span className='body'>{info.ORG_1}</span>
          </div>
        )}
        {info.ORG_3 && (
          <div>
            <span className='header'>시공사</span>
            <span className='body'>{info.ORG_3}</span>
          </div>
        )}
        {info.PJT_SCALE !== '-' && (
          <div>
            <span className='header'>공사규모</span>
            <span className='body'>{info.PJT_SCALE}</span>
          </div>
        )}
      </aside>
    );
}

export default Info;