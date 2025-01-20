import { useEffect, useMemo, useState } from 'react';
import './App.css';
import ConnectDialogue from './component/ConnectDialogue/ConnectDialogue';
import CommunicationError from './component/CommunicationError/CommunicationError';
import OBSWebSocket from 'obs-websocket-js';
import EffectPlayer from './component/EffectPlayer/EffectPlayer';
import { VideoData } from './utils/video-data';

function App() {
  const settings = useMemo(() => window.tailGachaSettings, []);
  const [connecting, setConnecting] = useState(true);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [videoQueue, setVideoQueue] = useState([]);

  const [showConnectDialogue, setShowConnectDialogue] = useState(true);

  useEffect(() => {
    // Set up WebSocket.
    const obs = new OBSWebSocket();

    obs.on('ConnectionClosed', () => {
      setConnectSuccess(false);
    });

    obs.on('CustomEvent', (payload) => {
      const { effectName, xOffset, yOffset, hAlignment = 'center', vAlignment = 'center', mute = false } = payload;
      if (effectName) {
        const normalizedPath = effectName.replace(/\\/g, '/');
        const fileName = normalizedPath.split('/').pop();
        const videoData = new VideoData(fileName, xOffset, yOffset, hAlignment.toString().toLowerCase(), vAlignment.toString().toLowerCase(), mute);

        setVideoQueue((previousVideoQueue) => [...previousVideoQueue, videoData]);
      }
    });

    obs.connect(settings.obsWebSocket, settings.password)
      .then(() => {
        setConnecting(false);
        setConnectSuccess(true);
      })
      .catch(() => {
        setConnecting(false);
        setConnectSuccess(false);
      });

    return () => {
      obs.disconnect();
    };
  }, [settings]);

  useEffect(() => {
    if (connectSuccess) {
      const timer = setTimeout(() => {
        setShowConnectDialogue(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  });

  return (
    <div className="App">
      {showConnectDialogue && <ConnectDialogue isConnecting={connecting} isConnectSuccess={connectSuccess} />}
      {!showConnectDialogue && !connecting && !connectSuccess && <CommunicationError />}
      {!showConnectDialogue && !connecting && connectSuccess && <EffectPlayer videoQueue={videoQueue} />}
    </div>
  );
}

export default App;
