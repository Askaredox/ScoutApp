import styles from './styles.module.css';

import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">

            <div className={styles.loader}></div>
        </div>
    )
};

export default Loader;