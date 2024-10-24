import styles from './CommunicationError.module.css';

export default function CommunicationError() {
    return (
        <div className={styles.content}>
            <span>{'There was a communication error with OBS. Please reload the Videofx browser source.'}</span>
        </div>
    );
}