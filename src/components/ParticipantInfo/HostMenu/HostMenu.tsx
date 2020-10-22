import React, { useCallback, useRef, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { Participant } from 'twilio-video';
import { useLocation } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface HostMenuProps {
    participant: Participant;
}

const useStyles = makeStyles((theme: Theme) => ({
    mainContent: {
      color: 'black',
    },
  }));
  
  
export default function HostMenu({ participant }: HostMenuProps) {

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [showErrorKicking, setShowErrorKicking] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')!;
  const juntoId = queryParams.get('juntoId')!;
  const topicId = queryParams.get('topicId')!;
  const isDev = queryParams.get('isDev');

  const kickParticipant = useCallback(() => {
    setIsKicking(true);
    
    const kickUrl = isDev 
        ? 'https://us-central1-juntochat-dev.cloudfunctions.net/KickParticipant'
        : 'https://us-central1-juntochat.cloudfunctions.net/KickParticipant';
    fetch(kickUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            juntoId: juntoId,
            topicId: topicId,
            kickParticipant: participant.identity,
            lockRoom: lockRoom,
           }),
        })
        .then((value) => console.log(value))
        .catch((error) => {
            console.log(error);
            setShowErrorKicking(true);
        })
        .finally(() => {
            setIsKicking(false);
            setKickDialogOpen(false);
        });
  }, [participant, lockRoom]);


  const classes = useStyles();

  return (
    <div>
        <Tooltip title="Admin Actions" placement="top">
            <Button 
                ref={anchorRef}
                onClick={() => setMenuOpen(true)}
                startIcon={<MoreVert style={{ color: "white"}} />}
                >
                <span></span>
            </Button>
        </Tooltip>
        <MenuContainer
            open={menuOpen}
            onClose={() => setMenuOpen(isOpen => !isOpen)}
            anchorEl={anchorRef.current}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical:  -45,
                horizontal: 'center',
            }}
        >
            <MenuItem 
                onClick={() => {
                    setMenuOpen(false);
                    setKickDialogOpen(true);
                    }}>
                <Typography variant="body1">Remove Participant</Typography>
            </MenuItem>
        </MenuContainer>
        <Dialog open={kickDialogOpen} onClose={() => setKickDialogOpen(false)} fullWidth={true} maxWidth="xs">
            <DialogTitle>Remove Participant</DialogTitle>
            <DialogContent>
                <DialogContentText className={classes.mainContent}>Ban {participant.identity} from the meeting? They will not be able to rejoin. </DialogContentText>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={lockRoom}
                        onChange={(e, checked) => setLockRoom(checked)}
                        name="lockRoom"
                        color="primary"
                    />
                    }
                    label="Lock room to prevent any one new from joining?"
                />
            </DialogContent>
            <DialogActions>
                {isKicking && <CircularProgress />}
                <Button onClick={kickParticipant} color="primary" variant="contained">
                Remove Participant
                </Button>
                <Button onClick={() => setKickDialogOpen(false)} color="primary" autoFocus>
                No, Cancel
                </Button>
            </DialogActions>
        </Dialog>


        <Dialog open={showErrorKicking} onClose={() => setShowErrorKicking(false)} fullWidth={true} maxWidth="xs">
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>There was an error removing {participant.identity}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowErrorKicking(false)} color="primary" variant="contained">
                Ok
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}
