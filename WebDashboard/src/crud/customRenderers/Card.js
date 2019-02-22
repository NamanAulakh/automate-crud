import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import styles from './styles';

class Card extends Component {
  render() {
    const { input, label, className, meta, cards } = this.props;
    const { touched, error } = meta;
    const defaultTxt = 'Please select an option';
    const options = cards.map(({ last4, id }) => ({ display: last4, val: id }));

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

export default withRouter(
  connect(
    ({ card, form }, { formName }) => ({
      cards: card.data,
      source: get(form, `${formName}.values.source`, null),
    }),
    dispatch => ({ dispatch })
  )(Card)
);
