import { useEffect, useRef, useState } from 'react';
import styles from './EffectPlayer.module.css';

const VALID_EXTENSIONS = ['mp4', 'webm', 'ogg'];

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
            console.log(`playing video number ${videoIndex}: ${videoQueue[videoIndex]}`);
            const [, extension] = videoQueue[videoIndex].split('.');

            // Skip invalid files.
            if (!VALID_EXTENSIONS.includes(extension)) {
                console.log(`skipping video number ${videoIndex}: ${videoQueue[videoIndex]} (invalid extension)`);
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
        <div className={styles.videofx}>
            {
                isPlaying &&
                <video autoPlay muted ref={videoRef} onEnded={onEnded}>
                    <source src={`./videos/${videoQueue[videoIndex]}`} type={`video/${videoExtension}`} />
                </video>
            }
        </div>
    );
}