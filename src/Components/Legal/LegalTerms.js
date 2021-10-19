import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Hidden, useMediaQuery } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Logo from '../../Assets/Images/edvi-logo-blue.png'
import image from '../../Assets/Images/legal.svg'

const useStyles = makeStyles({
  gridContainer: {
    height: '100%',
  },
  left_grid: {
    backgroundColor: '#eff3fd',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  right_grid: {
    alignSelf: 'center',
    padding: '0 2.5rem',
  },
  right_grid_responsive: {
    alignSelf: 'center',
  },
  edvi_logo: {
    padding: '30px 40px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  feature_image: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 80,
    position: 'fixed',
    marginLeft: '8%',
  },
  body_text: {
    color: '#666',
    lineHeight: '1.56',
    fontSize: '1rem',
    margin: '1rem 0 0 0',
    textAlign: 'justify',
  },
  head_text: {
    color: '#6480e4',
    lineHeight: '1.06',
    fontWeight: 600,
    fontSize: '1.75rem',
    margin: '2rem 0 0 0',
    position: 'relative',
    '&::after': {
      content: '""',
      width: '78px',
      height: '4px',
      backgroundColor: '#6480e4',
      borderRadius: 2,
      position: 'absolute',
      top: 40,
      left: 0,
    },
  },
  content: {
    margin: '3rem 0 0 0',
  },
})

const LegalTerms = ({ heading, content }) => {
  const classes = useStyles()
  const history = useHistory()
  const matches = useMediaQuery('(min-width:600px)')
  return (
    <Grid
      container
      direction={matches === true ? 'row' : 'column-reverse'}
      className={classes.gridContainer}
    >
      <Hidden smDown>
        <Grid item md={5} className={classes.left_grid}>
          <Grid container>
            <Grid item sm={12}>
              <div
                role="button"
                tabIndex={0}
                className={classes.edvi_logo}
                onClick={() => history.push('/')}
                onKeyDown={() => history.push('/')}
              >
                <img src={Logo} alt="edvi logo" height={40} width={90} />
              </div>
              <div className={classes.feature_image}>
                <img
                  src={image}
                  alt="teacher sitting with laptop"
                  className="legal-img"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
      <Grid
        item
        md={7}
        sm={12}
        className={matches ? classes.right_grid : classes.right_grid_responsive}
      >
        <div>
          <p className={classes.head_text}>{heading}</p>
        </div>
        <div className={classes.content}>{content}</div>
      </Grid>
    </Grid>
  )
}

export default LegalTerms
