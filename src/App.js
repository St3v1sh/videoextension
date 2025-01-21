import { useEffect, useMemo, useState } from 'react';
import './App.css';
import ConnectDialogue from './component/ConnectDialogue/ConnectDialogue';
import CommunicationError from './component/CommunicationError/CommunicationError';
import OBSWebSocket from 'obs-websocket-js';
import { EffectPlayer, EffectPlayerSync } from './component/EffectPlayer/EffectPlayer';
import { VideoData } from './utils/video-data';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const settings = useMemo(() => window.tailGachaSettings, []);
    const [connecting, setConnecting] = useState(true);
    const [connectSuccess, setConnectSuccess] = useState(false);

    // Video queue state.
    const [videoQueue, setVideoQueue] = useState([]);
    // Video queue state for synchronous playback.
    const [videoQueueSync, setVideoQueueSync] = useState([]);

    const [showConnectDialogue, setShowConnectDialogue] = useState(true);

    useEffect(() => {
        // Set up WebSocket.
        const obs = new OBSWebSocket();

        obs.on('ConnectionClosed', () => {
            setConnectSuccess(false);
        });

        obs.on('CustomEvent', (payload) => {
            const { effectName, xOffset, yOffset, hAlignment = 'center', vAlignment = 'center', synchronous = false } = payload;
            if (effectName) {
                const normalizedPath = effectName.replace(/\\/g, '/');
                const fileName = normalizedPath.split('/').pop();
                const videoData = new VideoData(uuidv4(), fileName, xOffset, yOffset, hAlignment.toString().toLowerCase(), vAlignment.toString().toLowerCase(), synchronous);

                if (synchronous) {
                    setVideoQueueSync((previousVideoQueue) => [...previousVideoQueue, videoData]);
                } else {
                    setVideoQueue((previousVideoQueue) => [...previousVideoQueue, videoData]);
                }
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

    const deleteVideoAsync = (id) => {
        setVideoQueue((previousVideoQueue) => previousVideoQueue.filter((video) => video.id !== id));
    };

    return (
        <div className="App">
            {showConnectDialogue && <ConnectDialogue isConnecting={connecting} isConnectSuccess={connectSuccess} />}
            {!showConnectDialogue && !connecting && !connectSuccess && <CommunicationError />}
            {!showConnectDialogue && !connecting && connectSuccess &&
                <>
                    <div className="video-player-container">
                        <EffectPlayer videoQueue={videoQueue} onEnded={deleteVideoAsync} />
                    </div>
                    <div className="video-player-container">
                        <EffectPlayerSync videoQueue={videoQueueSync} />
                    </div>
                </>
            }
        </div>
    );
}

export default App;
