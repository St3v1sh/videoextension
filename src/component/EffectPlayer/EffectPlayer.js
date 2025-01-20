import { useEffect } from 'react';
import styles from './EffectPlayer.module.css';

const VALID_EXTENSIONS = ['mp4', 'webm', 'ogg'];
const H_ALIGNMENTS_MAP = {
    'left': 'h-left',
    'center': 'h-center',
    'right': 'h-right',
};
const V_ALIGNMENTS_MAP = {
    'top': 'v-top',
    'center': 'v-center',
    'bottom': 'v-bottom',
};

export default function EffectPlayer({ videoQueue, onEnded }) {

    useEffect(() => {
        videoQueue.forEach((videoData) => {
            if (!VALID_EXTENSIONS.includes(videoData.fileName.split('.').pop())) {
                console.error(`Invalid file extension for video: ${videoData.fileName}`);
                onEnded(videoData.id);
            }
        });
    }, [videoQueue, onEnded]);

    return (
        <>
            {videoQueue.map((videoData) => (
                <div key={videoData.id} className={styles.videofx + ' ' + styles[H_ALIGNMENTS_MAP[videoData.hAlignment]] + ' ' + styles[V_ALIGNMENTS_MAP[videoData.vAlignment]]}>
                    <video className={styles['video-player']} style={{ left: `${videoData.xOffset}px`, top: `${videoData.yOffset}px` }} autoPlay muted onEnded={() => onEnded(videoData.id)}>
                        <source src={`./videos/${videoData.fileName}`} type={`video/${videoData.fileName.split('.').pop()}`} />
                    </video>
                </div>
            ))}
        </>
    );
}