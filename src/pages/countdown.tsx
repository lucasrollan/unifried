import React, { useState, useEffect } from 'react';
import styles from './countdown.module.css';

const TARGET_DATE = new Date('2025-01-01T00:00:00-03:00').getTime();
// const TARGET_DATE = new Date('2024-12-31T19:02:00-03:00').getTime();

const generateRandomPosition = () => {
    const size = 100 + Math.random() * 200
    const blur = 5 + Math.random() * 45 * (size/300)
    const duration = 30 + Math.random() * 100 * (size/200)

    return ({
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${duration}s`, // Random duration between 20s and 65s
        animationDelay: `${Math.random() * 5}s`, // Random delay between 0s and 45s
        size: `${size}px`, // Random size between 100px and 300px
        blur: `${blur}px`, // Random blur between 10px and 50px
    })
};

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState(TARGET_DATE - Date.now());
    const [circles, setCircles] = useState(Array.from({ length: 40 }, generateRandomPosition));
    const [isCountdownOver, setIsCountdownOver] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const timeRemaining = TARGET_DATE - Date.now();
            if (timeRemaining <= 1000) {
                setIsCountdownOver(true);
                clearInterval(interval);
            } else {
                setTimeLeft(timeRemaining);
            }
        }, 1000 / 10); // 10fps

        return () => clearInterval(interval);
    }, []);

    if (isCountdownOver) {
        return (
            <div className={styles.container}>
                <div className={styles.background}>
                    {circles.map((style, index) => (
                        <div
                            key={index}
                            className={styles.circle}
                            style={{ top: style.top, left: style.left, animationDuration: style.animationDuration, animationDelay: style.animationDelay, width: style.size, height: style.size, filter: `blur(${style.blur})` }}
                        ></div>
                    ))}
                </div>
                <div className={styles.countdown} style={{ fontSize: '18rem' }}>
                    <div className={styles.happy}>Feliz</div>
                    <div>2025</div>
                </div>
            </div>
        );
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    const displayHours = hours > 0 ? String(hours).padStart(2, '0') : '';
    const displayMinutes = hours > 0 || minutes > 0 ? String(minutes).padStart(2, '0') : '';
    const displaySeconds = hours === 0 && minutes === 0 ? String(seconds) : String(seconds).padStart(2, '0');
    const fontSize = hours === 0 && minutes === 0 ? '18rem' : hours === 0 ? '14rem' : '12rem';

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                {circles.map((style, index) => (
                    <div
                        key={index}
                        className={styles.circle}
                        style={{ top: style.top, left: style.left, animationDuration: style.animationDuration, animationDelay: style.animationDelay, width: style.size, height: style.size, filter: `blur(${style.blur})` }}
                    ></div>
                ))}
            </div>
            <div className={styles.countdown} style={{ fontSize }}>
                <div className={styles.timeUnit}>
                    {displayHours}
                    <div className={styles.label}>{hours > 0 ? 'horas' : ''}</div>
                </div>
                {hours > 0 && <div className={styles.colon}>:</div>}
                <div className={styles.timeUnit}>
                    {displayMinutes}
                    <div className={styles.label}>{hours > 0 || minutes > 0 ? 'minutos' : ''}</div>
                </div>
                {(hours > 0 || minutes > 0) && <div className={styles.colon}>:</div>}
                <div className={styles.timeUnit}>
                    {displaySeconds}
                    {(hours > 0 || minutes > 0) && <div className={styles.label}>segundos</div>}
                </div>
            </div>
        </div>
    );
};

export default Countdown;
