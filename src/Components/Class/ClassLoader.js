import React from 'react'

import Loader from '../../Assets/Images/loader.svg'

const Loading = () => (
  <>
    <div id="loading-image">
      <div id="image-parent">
        <img src={Loader} alt="Class Loading.." />
      </div>
    </div>
  </>
)

const ClassLoader = () => (
  <>
    <div className="loader">
      <Loading />
      <p className="sub-text bolder" id="loading-text">
        We are loading your class..
      </p>
    </div>
  </>
)

export default ClassLoader
