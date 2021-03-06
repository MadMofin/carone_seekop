import React, { useEffect } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import AlertP from 'src/components/Alert';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles(() => ({
  root: {}
}));



const JWTLogin = ({ className, ...rest }) => {

  
  const classes = useStyles();
  const { t } = useTranslation();

  const { login, error, clearState } = useAuth();
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    clearState()
    //eslint-disable-next-line
  }, [])
 
  if (localStorage.getItem('token')) {
  
    return <Redirect to="/app/management/omsLeads" />
  }else {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email(t("Yup.Email")).max(255).required(t("Yup.EmailReq")),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await login(values);

          if (isMountedRef.current) {
            if(!error){
              setStatus({ success: true });
              setSubmitting(false);
            }
          }
        } catch (err) {
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.error });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label={t("Forms.Email")}
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label={t("Forms.Password")}
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />

          {error && <AlertP severity="error" msg={error.error}/>}
            
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {t("Login.Login")}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
          }
};

JWTLogin.propTypes = {
  className: PropTypes.string,
};

export default JWTLogin;
