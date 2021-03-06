import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import useCompany from 'src/hooks/useCompany';
import Details from './Details';
import { useParams } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const CompanyDetailsView = () => {
  const classes = useStyles();
  const { company, getCompany } = useCompany();

  const { id } = useParams();

  useEffect(() => {

    getCompany(id);

    // eslint-disable-next-line
  }, []);

  return (
    <Page className={classes.root} title="Company Details">
      <Container maxWidth={false}>
        <Header company={company} />
        <Divider />
        <Box mt={3}>
          <Details company={company} />
        </Box>
      </Container>
    </Page>
  );
};

export default CompanyDetailsView;
