import React from 'react';
import s from './player.scss';
import classNames from 'classnames';

export const Player = () => {
    return (
        <div className={classNames(s.player, s.audioPlayer)} id="player">
            <div className={s.info}>
                <div className={s.cover}>
                    <img className={s.coverImg} src="" alt="Cover трека" />
                </div>
                <div className={s.text}>
                    <h3 className={s.title}>Название трека</h3>
                    <h4 className={s.artist}>Автор трека</h4>
                </div>
            </div>
            <div className={s.control}>
                <div className={s.controlButtons}>
                    <button className={classNames(s.controlPrev, s.cssButtonFullyRoundedGreen)}>
                        <i className="fas fa-backward"></i>
                    </button>
                    <button className={classNames(s.controlPlay, s.cssButtonFullyRoundedGreen)}>
                        <i className="fas fa-play"></i>
                    </button>
                    <button className={classNames(s.controlNext, s.cssButtonFullyRoundedGreen)}>
                        <i className="fas fa-forward"></i>
                    </button>
                </div>
                <div className={s.controlDuration}>
                    <p className={classNames(s.controlDuration1, s.color)}>Длительность трека</p>
                    <input
                        className={s.playerControlDurationScroll}
                        type="range"
                        value="0"
                        id="progressSlider"
                    />
                    <p className={classNames(s.controlDuration2, s.color)}>Длительность трека</p>
                </div>
            </div>
            <div className={s.controlVolume}>
                <input type="range" min="0" max="1" step="0.01" id="volumeSlider" />
            </div>
        </div>
    );
};
