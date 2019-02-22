import React from 'react';
import styles from './styles';

export default ({
  input,
  label,
  placeholder,
  type,
  className,
  options,
  meta: { touched, error },
  style = {},
}) => (
  // const jab = null;
  // console.log(style, 'style');
  <div style={style}>
    {label !== 'VN' ? (
      <label className="col-md-4 col-lg-4 col-sm-4 formlabel"> {label}</label>
    ) : (
      <span style={{ width: 0 }} />
    )}

    <div>
      <div style={styles.parentDiv}>
        {options ? (
          <select style={styles.select} className={className} {...input}>
            <option value="" disabled hidden>
              Please select an option
            </option>

            {options.map((option, index) => (
              <option key={index} value={option.val}>
                {option.display}
              </option>
            ))}
          </select>
        ) : (
          <input
            style={styles.input}
            className={className}
            {...input}
            type={type}
            placeholder={placeholder}
          />
        )}
      </div>

      {touched &&
        (error && (
          <span style={{ color: 'red', textAlign: 'center', display: 'block' }}>{error}</span>
        ))}
    </div>
  </div>
);
