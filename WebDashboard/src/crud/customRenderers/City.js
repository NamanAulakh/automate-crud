import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import styles from './styles';

class City extends Component {
  render() {
    const {
      input,
      label,
      className,
      meta: { touched, error, warning },
      cities,
      source,
    } = this.props;
    // console.log(this.props, '......City.......');
    // console.log(source, '*******', input, '&&&&&&&&', cities);
    const condition1 = input.name === 'source';
    const condition2 = input.name === 'destination';
    let defaultTxt = condition2 ? 'Please select a source first' : 'Please select an option';
    let options = [];

    if (condition1) options = cities.map(city => ({ display: city.name, val: city.name }));

    if (condition2 && source && source !== 'Please select an option') {
      defaultTxt = 'Please select an option';
      options = cities
        .map(city => ({ display: city.name, val: city.name }))
        .filter(item => item.val !== source);
    }
    // console.log(options, '....City.......', input);
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
              <option>{defaultTxt}</option>

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
  }
}

const mapStateToProps = (store, ownProps) => {
  const { city, form } = store;
  const { formName } = ownProps;
  return {
    cities: city.data,
    source: get(form, `${formName}.values.source`, null),
  };
};
const bindActions = dispatch => ({ dispatch });
export default withRouter(
  connect(
    mapStateToProps,
    bindActions
  )(City)
);
