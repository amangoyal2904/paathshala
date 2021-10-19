import React, { useContext, useEffect, useState, Suspense, lazy } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import Spinner from '../Components/Progress/Spinner'
import { AuthContext } from '../Context/AuthContext'
import { mobileCheck } from '../Global/Functions'
const Auth = lazy(() => import('../Pages/UserManagement/Auth'))
const Dashboard = lazy(() => import('../Pages/Dashboard'))
const Privacy = lazy(() => import('../Pages/PrivacyTermsConditions/Privacy'))
const TermsConditions = lazy(() =>
  import('../Pages/PrivacyTermsConditions/TermsConditions'),
)
const ValidationSuccessful = lazy(() =>
  import('../Pages/UserManagement/ValidateEmail/ValidationSuccessful'),
)
const ErrorCodePage = lazy(() => import('../Pages/ErrorPages/ErrorCodePage'))
const Download = lazy(() => import('../Pages/Download/Download'))
const MasterForm = lazy(() =>
  import('../Pages/UserManagement/Register/MasterForm/MasterForm'),
)
const RegisterSuccessFul = lazy(() =>
  import('../Pages/RegisterSuccessful/RegisterSuccessFul'),
)

const AppEntry = () => {
  const { isLoggedIn, Authenticate, loading } = useContext(AuthContext)
  const [checkMobile, setCheckMobile] = useState(false)

  const location = useLocation()

  useEffect(() => {
    const res = mobileCheck()
    setCheckMobile(res)
  }, [])

  useEffect(() => {
    Authenticate()
  }, [])

  return (
    <>
      {loading === true ? (
        <Spinner />
      ) : (
        <Suspense fallback={<Spinner />}>
          <>
            <>
              {checkMobile ? (
                <>
                  {location.pathname === '/auth/Register' ? (
                    <MasterForm />
                  ) : (
                    <>
                      {location.pathname === '/Register-successful' ? (
                        <RegisterSuccessFul />
                      ) : (
                        <>
                          {location.pathname === '/privacy' ? (
                            <Privacy />
                          ) : (
                            <>
                              {location.pathname === '/terms' ? (
                                <TermsConditions />
                              ) : (
                                <Download />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Switch>
                  <Route exact path="/">
                    {isLoggedIn ? (
                      <Redirect to="/dashboard" />
                    ) : (
                      <Redirect to="/auth/login" />
                    )}
                  </Route>
                  <Route
                    path="/auth/email-verified"
                    component={ValidationSuccessful}
                  />
                  <Route path="/auth/:action/:subaction" component={Auth} />
                  <Route path="/auth/:action" component={Auth} />
                  <Route path="/auth" component={Auth} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/terms" component={TermsConditions} />
                  <Route
                    path="/register-successful"
                    component={RegisterSuccessFul}
                  />
                  <ProtectedRoute
                    path="/dashboard"
                    isLoggedIn={isLoggedIn}
                    component={Dashboard}
                  />
                  <Route path="/internal-error">
                    <ErrorCodePage errCodeRecieved={500} />
                  </Route>
                  <Route path="*">
                    <ErrorCodePage errCodeRecieved={404} />
                  </Route>
                </Switch>
              )}
            </>
          </>
        </Suspense>
      )}
    </>
  )
}

export default AppEntry

const ProtectedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isLoggedIn) {
        return <Component {...rest} {...props} />
      }
      return (
        <Redirect
          to={{
            pathname: '/auth/login',
            state: {
              from: props.location,
            },
          }}
        />
      )
    }}
  />
)
