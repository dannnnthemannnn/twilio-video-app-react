import { useEffect, useRef, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { RemoteParticipant } from 'twilio-video';

export default function useDominantSpeakerWithNull() {
  const { room } = useVideoContext();
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    // Sometimes, the 'dominantSpeakerChanged' event can emit 'null', which means that
    // there is no dominant speaker. If we change the main participant when 'null' is
    // emitted, the effect can be jarring to the user. Here we ignore any 'null' values
    // and continue to display the previous dominant speaker as the main participant.
    const handleDominantSpeakerChanged = (newDominantSpeaker: RemoteParticipant) => {
      console.log('dominant speaker changed');
      setDominantSpeaker(newDominantSpeaker);
    };

    room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
    return () => {
      room.off('dominantSpeakerChanged', handleDominantSpeakerChanged);
    };
  }, [room]);

  return dominantSpeaker;
}
