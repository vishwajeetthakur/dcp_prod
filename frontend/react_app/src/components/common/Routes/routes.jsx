// Packages
import { cloneElement, StrictMode, Suspense, useEffect } from 'react'
import { Navigate, Outlet, useRoutes, useLocation, } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AnimatePresence, motion } from "framer-motion";

// Components
import { Layout } from '..'

// Hooks
import { useKeycloakUser } from '../../hooks'

// Utilites
import { actions } from '../../../store'
import { checkRoles, routes } from './routesConfig'


const pageTransitionOptions = {
  initial: "hidden",
  animate: "visible",
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15
    }
  },
}

const ProtectedRoute = ({
  children,
  isAllowed,
  redirectPath = '/',
}) => {

  // if user is not allowed, navigate back to home page
  if (!isAllowed) return <Navigate to={redirectPath} replace />

  // otherwise return the requested route
  else return children
    ? (
      <motion.div {...pageTransitionOptions}>
        {children}
      </motion.div>
    ) : (
      <motion.div {...pageTransitionOptions}>
        <Outlet />
      </motion.div>
    )
}

const Routes = () => {
  const dispatch = useDispatch()
  const { keycloakUser } = useKeycloakUser()
  const location = useLocation()
  const app = useRoutes([
    {
      path: '/', 
      element: (
        <StrictMode>
          <Suspense fallback="Loading...">
            <Layout/>
          </Suspense>
        </StrictMode>
      ),
      children: routes.map(({ element, path, roles = [], children }) => ({
        key: path + '_route',
        path,
        element: <ProtectedRoute isAllowed={checkRoles(roles, keycloakUser)} children={element} />,
        children,
      })),
    },
  ])

  useEffect(() => {
    // ... clear any alerts in global state upon changing pages
    dispatch(actions.createAlert({ type: null, message: null }))
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      {cloneElement(app, { key: location.pathname })}
    </AnimatePresence>
  )
}

export default Routes