import React from 'react';

import styles from './styles';

export default ({ input, label, className, meta: { touched, error } }) => {
  if (!input) return null;
  const options = ['Percentage', 'Value'].map((item, index) => ({ display: item, val: index }));

  return (
    <div>
      {label !== 'VN' ? (
        <label className="col-md-4 col-lg-4 col-sm-4 formlabel"> {label}</label>
      ) : (
        <span style={{ width: 0 }} />
      )}

      <div>
        <div style={styles.parentDiv}>
          <select style={styles.select} className={className} {...input}>
            <option>{'Please select a coupon type'}</option>

            {options.map((option, index) => (
              <option key={index} value={option.val}>
                {option.display}
              </option>
            ))}
          </select>
        </div>

        {touched &&
          (error && (
            <span style={{ color: 'red', textAlign: 'center', display: 'block' }}>{error}</span>
          ))}
      </div>
    </div>
  );
};
