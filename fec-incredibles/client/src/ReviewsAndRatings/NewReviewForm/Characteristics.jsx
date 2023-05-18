import React, { useState }  from 'react';

import { scaleDetail } from '../characteristics.js';

const Characteristics = ({ factor, id }) => {

  const [ selected, setSelected ] = useState(0)

  const handleChange = (e) => {
    // console.log(e.target.value)
    setSelected(e.target.value)
  }

  return (
    <div >
      <div className='form-row' >

        <label htmlFor={"factor-" + id}>{factor}</label>


        <div>
          {[1, 2, 3, 4, 5].map((scale, idx) =>
            <input
              key={idx}
              type="radio" name={"factor-" + id}
              value={scale} id={"factor-" + id}
              checked={selected == scale}
              onChange={handleChange}/>
          )}
        </div>

        <i>{scaleDetail[factor][selected]}</i>


      </div>
      {/* <div className="factor-labels">
        {scaleDetail[factor].map((scale, idx) =>
          <i key={idx} >{scale}</i>
        )}
      </div> */}

    </div>
  );
}

export default Characteristics;