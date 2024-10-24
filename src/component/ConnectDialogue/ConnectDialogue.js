import { useMemo } from 'react';
import styles from './ConnectDialogue.module.css';
import loadingMessages from '../../utils/loading-messages';

export default function ConnectDialogue({ isConnecting, isConnectSuccess }) {
    const loadingMessage = useMemo(() => loadingMessages[Math.floor(Math.random() * loadingMessages.length)], []);
    return (
        <div className={styles['connect-dialogue-container'] + ((!isConnecting && isConnectSuccess) ? ' ' + styles.success : '')}>
            <div className={styles.background}>
                <div className={styles.content}>
                    <span>
                        {(isConnecting || isConnectSuccess) ?
                            loadingMessage :
                            <>
                                {'Connection error. Are the OBS WebSocket address and password (if you set one) in '}<code>{'settings.json'}</code>{' correct?'}
                            </>
                        }
                    </span>
                </div>
            </div>
        </div>

    );
}