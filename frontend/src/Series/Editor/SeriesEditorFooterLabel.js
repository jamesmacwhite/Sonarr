import React, { PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import SpinnerIcon from 'Components/SpinnerIcon';
import styles from './SeriesEditorFooterLabel.css';

function SeriesEditorFooterLabel(props) {
  const {
    label,
    isSaving
  } = props;

  return (
    <div className={styles.label}>
      {label}

      {
        isSaving &&
          <SpinnerIcon
            className={styles.savingIcon}
            name={icons.SPINNER}
            isSpinning={true}
          />
      }
    </div>
  );
}

SeriesEditorFooterLabel.propTypes = {
  label: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired
};

export default SeriesEditorFooterLabel;
