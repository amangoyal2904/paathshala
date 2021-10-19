import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Controls from '../Controls/Controls'

const OtpField = ({ otp, setOtp, handleChange }) => {
  const classes = useStyles()
  return (
    <>
      <div className="row">
        <div className={classes.container}>
          <div>
            {otp.map((data, index) => (
              <input
                className={classes.input}
                type="text"
                name="otp"
                maxLength="1"
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                value={data}
                inputProps={{ maxLength: 1 }}
                onChange={(e) => {
                  handleChange(e.target, index)
                }}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          <div>
            <Controls.Button onClick={() => setOtp([...otp.map(() => '')])}>
              Clear
            </Controls.Button>
          </div>
          {/* <p>OTP Entered - {otp.join('')}</p> */}
        </div>
      </div>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      width: 40,
      height: 40,
      textAlign: 'center',
      marginInline: 2,
      marginBlock: 10,
      fontSize: 20,
      fontWeight: 'bold',
      borderRadius: 5,
      border: '1px solid grey',
      '&:focus': {
        outline: 'none',
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
)

export default OtpField
