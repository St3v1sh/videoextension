import { useEffect, useRef, useState } from 'react';
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

export default function EffectPlayer({ videoQueue }) {
    const [videoIndex, setVideoIndex] = useState(0);
    const [videoExtension, setVideoExtension] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const onEnded = () => {
        if (videoIndex < videoQueue.length - 1) {
            console.log('setting up next video');
            setVideoIndex((previousIndex) => previousIndex + 1);
        } else {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (videoQueue.length > 0 && isPlaying) {
            console.log(`playing video number ${videoIndex}: ${JSON.stringify(videoQueue[videoIndex])}`);
            const [, extension] = videoQueue[videoIndex].fileName.split('.');

            // Skip invalid files.
            if (!VALID_EXTENSIONS.includes(extension)) {
                console.log(`skipping video number ${videoIndex}: ${JSON.stringify(videoQueue[videoIndex])} (invalid extension)`);
                onEnded();
            } else {
                setVideoExtension(extension);
                videoRef.current?.load();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoIndex, isPlaying]);

    useEffect(() => {
        if (videoQueue.length > 0 && !isPlaying) {
            console.log('starting the video player');
            setVideoIndex(videoQueue.length - 1);
            setIsPlaying(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoQueue]);

    return (
        <div className={styles.videofx + (videoQueue.length > 0 ? (' ' + styles[H_ALIGNMENTS_MAP[videoQueue[videoIndex].hAlignment]] + ' ' + styles[V_ALIGNMENTS_MAP[videoQueue[videoIndex].vAlignment]]) : '')}>
            {
                isPlaying &&
                <video className={styles['video-player']} style={{ left: `${videoQueue[videoIndex].xOffset}px`, top: `${videoQueue[videoIndex].yOffset}px` }} autoPlay muted ref={videoRef} onEnded={onEnded}>
                    <source src={`./videos/${videoQueue[videoIndex].fileName}`} type={`video/${videoExtension}`} />
                </video>
            }
        </div>
    );
}