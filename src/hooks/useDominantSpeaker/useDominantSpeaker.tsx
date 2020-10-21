import { useEffect, useRef, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { RemoteParticipant } from 'twilio-video';
import useDominantSpeakerWithNull from './useDominantSpeakerWithNull';

export default function useDominantSpeaker() {
  const { room } = useVideoContext();
  const dominantSpeakerWithNull = useDominantSpeakerWithNull();
  const [dominantSpeaker, setDominantSpeaker] = useState(dominantSpeakerWithNull);

  useEffect(() => {
    // Sometimes, the 'dominantSpeakerChanged' event can emit 'null', which means that
    // there is no dominant speaker. If we change the main participant when 'null' is
    // emitted, the effect can be jarring to the user. Here we ignore any 'null' values
    // and continue to display the previous dominant speaker as the main participant.
    if (dominantSpeakerWithNull != null) {
      setDominantSpeaker(dominantSpeakerWithNull);
    }

    // Since 'null' values are ignored, we will need to listen for the 'participantDisconnected'
    // event, so we can set the dominantSpeaker to 'null' when they disconnect.
    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
      setDominantSpeaker(prevDominantSpeaker => {
        return prevDominantSpeaker === participant ? null : prevDominantSpeaker;
      });
    };

    room.on('participantDisconnected', handleParticipantDisconnected);
    return () => {
      room.off('participantDisconnected', handleParticipantDisconnected);
    };
  }, [room, dominantSpeakerWithNull]);

  return dominantSpeaker;
}
