import React from 'react';
import { Button, Card, CardActions, CardContent, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(40, 42, 43)',
    height: '100%',
  },
  cardAction: {
    justifyContent: 'center',
  },
}));


const DisconnectedScreen = () => {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <Card variant="outlined">
        <CardContent>
          <Typography gutterBottom>
            You were disconnected.
          </Typography>
        </CardContent>
        <CardActions className={classes.cardAction}>
          <Button onClick={() => window.top.location.reload()} color="primary" variant="contained">Refresh Page</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default DisconnectedScreen;
