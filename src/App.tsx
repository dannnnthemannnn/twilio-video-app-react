import React, { useEffect, useRef, useState } from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import useDominantSpeakerWithNull from './hooks/useDominantSpeaker/useDominantSpeakerWithNull';
import { useLocation } from 'react-router-dom';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import DisconnectedScreen from './components/DisconnectedScreen/DisconnectedScreen';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

export default function App() {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  const [enteredRoom, setEnteredRoom] = useState<boolean>(false);

  const dominantSpeaker = useDominantSpeakerWithNull();
  const location = useLocation();
  const {
    room: { localParticipant },
  } = useVideoContext();

  const localParticipantRef = useRef(localParticipant);

  useEffect(() => {
    localParticipantRef.current = localParticipant;
  }, [localParticipant]);

  useEffect(() => {
    if (roomState === 'connected' && !enteredRoom) {
      setEnteredRoom(true);
    }
  }, [roomState]);

  /*useEffect(() => {
    console.log('speaker changed');
    console.log(dominantSpeaker?.sid);

    fetch('https://us-central1-juntochat-dev.cloudfunctions.net/TwilioMeetingDominantSpeakerUpdate', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({ 
            dominantSpeakerSid: dominantSpeaker?.sid, 
            senderUid: localParticipantRef.current?.sid,
            token
           }),
        });
  }, [dominantSpeaker]);*/

  var content;
  if (roomState === 'disconnected' && !enteredRoom) {
    content = <PreJoinScreens />;
  } else if (roomState === 'disconnected' && enteredRoom) {
    content = <DisconnectedScreen />;
  } else {
    content = 
    <Main>
      <ReconnectingNotification />
      <MobileTopMenuBar />
      <Room />
      <MenuBar />
    </Main>;
  }

  return (
    <Container style={{ height: '100%' }}>
      {content}
    </Container>
  );
}
