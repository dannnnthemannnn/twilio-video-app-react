import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import PreflightTest from './PreflightTest/PreflightTest';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useLocation } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Video, { TwilioError } from 'twilio-video';
import { TimeToLeave } from '@material-ui/icons';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { setError, setTitle } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [step] = useState(Steps.deviceSelectionStep);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name')!;
  const title = queryParams.get('title')!;
  const token = queryParams.get('token')!;

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (!name) {
      setError(new Error('Must provide user\'s name in url params. Please try again.') as TwilioError);
      return;
    }
    if (!title) {
      setError(new Error('Must provide title in url params. Please try again.') as TwilioError);
      return;
    }
    setTitle(title);
    if (!token) {
      setError(new Error('Must provide token in url params. Please try again.') as TwilioError);
      return;
    }
  }, []);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step]);

  const SubContent = (
      <MediaErrorSnackbar error={mediaError} />
  );

  return (
    <IntroContainer subContent={step === Steps.deviceSelectionStep && SubContent}>
      <DeviceSelectionScreen name={name} title={title} token={token} />
    </IntroContainer>
  );
}
