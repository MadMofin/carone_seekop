import React, {  useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import clsx from 'clsx';  
import { CapitalizeNames } from 'src/utils/capitalize';
import { useParams } from 'react-router';
import useVehicle from 'src/hooks/useVehicle';
import useMake from 'src/hooks/useMake';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    FormHelperText,
    makeStyles,
  } from '@material-ui/core';
  import {
    Edit as EditIcon
  
  } from 'react-feather';
import { useTranslation } from 'react-i18next';
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    cell: {
      padding: theme.spacing(1)
    }
  }));
  
  const UpdateModel = ({ className, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();  
    const { makes, getMakes } = useMake();
    const { updateVehicle, vehicle, getVehicle } = useVehicle();
    const route = useParams();
    const { t } = useTranslation()
    useEffect(() => {
      getMakes();
      // eslint-disable-next-line
    }, [])
    
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title={t("Vehicles.Make")} />
        <Divider />
        <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            make: vehicle && vehicle.make && vehicle.make._id
          }}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              await updateVehicle(values, route.id);
              await getVehicle(route.id)
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar(t("SnackBar.MakeUpdated"), {
                variant: 'success'
              });
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
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
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    name="make"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.make}                  
                    variant="outlined"
                    >
                    {makes.map((make) => (
                        <option
                        key={make._id}
                        value={make._id}
                        >
                        {make && CapitalizeNames(make.name)}
                        </option>
                      ))}
                </TextField>
                {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>
                        {errors.submit}
                      </FormHelperText>
                    </Box>
                )}
                <Divider />
                <Box
                  mt={2}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        size="large"
                        fullWidth
                        color="primary"
                        startIcon={<EditIcon />}
                        >
                        {t("Buttons.Update")} {t("Makes.Make")}
                    </Button>
                </Box>
            </form>
          )}
        </Formik>
        </CardContent>
      </Card>
    );
  };
  
  UpdateModel.propTypes = {
    className: PropTypes.string,
  };
  
  export default UpdateModel;
  