import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SimpleDialog from 'src/components/SimpleDialog'

import { useHistory, useParams } from 'react-router';
import {
  Breadcrumbs,
  Button,
  Grid,
  SvgIcon,
  Typography,
  makeStyles,
  Link
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Edit as EditIcon } from 'react-feather';
import { ArrowLeft as BackIcon } from 'react-feather';
import { CapitalizeNames } from 'src/utils/capitalize';

import useAuth from 'src/hooks/useAuth';
import useMake from 'src/hooks/useMake';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {},
  error: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: "#d0392e"
    },
    marginLeft: 15
  },
}));

const Header = ({ className, make, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { deleteMake } = useMake();
  const { enqueueSnackbar } = useSnackbar();  
  const history = useHistory();
  const route = useParams();
  const { t } = useTranslation()

  const [open, setOpen] = React.useState(false);
  const handleClose = async (value) => {
    setOpen(false);
    if(value === 'yes'){      
      deleteMake(route.id);
      enqueueSnackbar(t("Makes.MakeDeleted"), {
        variant: 'error'
      });
      history.push("/app/management/makes");
    }
  };


  
  return (
    
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
      <SimpleDialog open={open} onClose={handleClose} />

        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
                   
          <Link
            variant="body1"
            color="inherit"
            to="/app/management/makes"
            component={RouterLink}
          >
            {t("BreadCumbs.Management")}
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            {t("BreadCumbs.Makes")}
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {make && CapitalizeNames(make.name)}
        </Typography>
      </Grid>
      <Grid item>

      <Button
          color="secondary"
          variant="contained"
          startIcon={
            <SvgIcon fontSize="small">
              <BackIcon />
            </SvgIcon>
          }
          component={RouterLink}
          to="/app/management/makes"
        >
        
        {t("Buttons.GoBack")}
        </Button>
      { user && (user.role === 'rockstar'|| user.role === 'super admin') ? (
       <> <Button
          style={{marginLeft: 15}}
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={`/app/management/makes/${make && make._id}/edit`}
          startIcon={
            <SvgIcon fontSize="small">
              <EditIcon />
            </SvgIcon>
          }
        >
          {t("Buttons.Edit")}
        </Button>
        </>
      ) : false }
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  make: PropTypes.object.isRequired
};

export default Header;
