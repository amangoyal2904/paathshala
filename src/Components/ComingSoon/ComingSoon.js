import { Link } from '@material-ui/core'
import React, { useContext } from 'react'
import { BatchContext } from '../../Context/BatchContext'

const ComingSoon = ({ id, src, content }) => {
  const { batchByCode } = useContext(BatchContext)
  return (
    <div>
      <div className="ebook-title">
        <div className="ebook-title__title">e-Books</div>
        <div>
          <Link color="inherit" href="/dashboard">
            Dashboard
          </Link>
          {'>'}
          <Link color="inherit" href={`/dashboard/view/${id}`}>
            {batchByCode.name}
          </Link>
          {'>e-Books'}
        </div>
      </div>
      <div className="coming-soon text-align-center">
        <div>
          <img src={src} alt="Coming Soon" className="coming-soon__img" />
        </div>
        <div className="coming-soon__text">
          <div className="coming-soon__text-heading">
            <h1>Coming Soon!!</h1>
          </div>
          <div className="coming-soon__text-content">
            <h2>{content}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
