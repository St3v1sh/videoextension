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

export function EffectPlayer({ videoQueue, onEnded }) {
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

export function EffectPlayerSync({ videoQueue }) {
    const [videoIndex, setVideoIndex] = useState(0);
    const [videoExtension, setVideoExtension] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const onEnded = () => {
        if (videoIndex < videoQueue.length - 1) {
            setVideoIndex((previousIndex) => previousIndex + 1);
        } else {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (videoQueue.length > 0 && isPlaying) {
            const [, extension] = videoQueue[videoIndex].fileName.split('.');

            // Skip invalid files.
            if (!VALID_EXTENSIONS.includes(extension)) {
                console.log(`Invalid file extension for video: ${JSON.stringify(videoQueue[videoIndex])}`);
                onEnded();
            } else {
                setVideoExtension(extension);
                videoRef.current?.load();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoIndex, isPlaying]);

    useEffect(() => {
        if (videoQueue.length > videoIndex && !isPlaying) {
            setVideoIndex(videoIndex === 0 ? 0 : videoIndex + 1);
            setIsPlaying(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoQueue]);

    const { fileName, xOffset, yOffset, hAlignment, vAlignment } = videoQueue[videoIndex] || {};

    return (
        <div className={styles.videofx + (videoQueue.length > 0 ? (' ' + styles[H_ALIGNMENTS_MAP[hAlignment]] + ' ' + styles[V_ALIGNMENTS_MAP[vAlignment]]) : '')}>
            {
                isPlaying &&
                <video className={styles['video-player']} style={{ left: `${xOffset}px`, top: `${yOffset}px` }} autoPlay muted ref={videoRef} onEnded={onEnded}>
                    <source src={`./videos/${fileName}`} type={`video/${videoExtension}`} />
                </video>
            }
        </div>
    );
}
