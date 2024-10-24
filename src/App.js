import { useEffect, useMemo, useState } from 'react';
import './App.css';
import ConnectDialogue from './component/ConnectDialogue/ConnectDialogue';
import CommunicationError from './component/CommunicationError/CommunicationError';
import OBSWebSocket from 'obs-websocket-js';
import EffectPlayer from './component/EffectPlayer/EffectPlayer';

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
      const { effectName } = payload;
      if (effectName) {
        setVideoQueue((previousVideoQueue) => [...previousVideoQueue, effectName]);
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
      <EffectPlayer videoQueue={videoQueue} />
      {showConnectDialogue && <ConnectDialogue isConnecting={connecting} isConnectSuccess={connectSuccess} />}
      {!showConnectDialogue && !connecting && !connectSuccess && <CommunicationError />}
    </div>
  );
}

export default App;
