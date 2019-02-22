import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { reduxForm, Field } from 'redux-form';
import 'app/styles/common/add_driver.scss';
import styles from './styles';

const renderField = ({ input, label, placeholder, type, className, options, meta, disabled }) => {
  const { touched, error } = meta;

  return (
    <div>
      {label !== 'VN' ? (
        <label className="col-md-4 col-lg-4 col-sm-4 formlabel"> {label}</label>
      ) : (
        <span style={{ width: 0 }} />
      )}

      <div>
        <div style={styles.parentDiv}>
          {options ? (
            <select style={styles.select} className={className} {...input} disabled={disabled}>
              <option value={''}>Please select an option</option>

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
              disabled={disabled}
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
};

const Form = ({ props }) => {
  if (!props) return null;
  const {
    onSubmit,
    aliasObj,
    options,
    types,
    customRenderers,
    formName,
    onChange,
    disableField,
    hideField,
    extraKeys,
  } = props;
  if (extraKeys) props = extraKeys(props);

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="col-md-12 col-lg-12">
        {props.keys.map((key, index) => {
          const dispalyVal = aliasObj && aliasObj[key] ? aliasObj[key] : key;
          const type = get(types, `[${key}]`, 'text');
          let component = renderField;
          const customOnChange =
            onChange && onChange[key]
              ? (event, newValue) => onChange[key]({ val: newValue, props })
              : null;
          if (customRenderers && customRenderers[key])
            component = data => customRenderers[key]({ ...data, formName, props });
          if (hideField && hideField(props, key)) return null;
          // component = data => customRenderers[key]({ ...data, formName, ...props }); // Understand the cause of this error: The prop `store.subscribe` is marked as required in `Connect(PickUpDropdown)`, but its value is `undefined`

          return (
            <div key={index} className="col-md-6 col-lg-6 col-sm-6 formdiv">
              <Field
                className="col-md-8 col-lg-8 col-sm-8 formfield"
                name={key}
                component={component}
                type={type}
                label={`${dispalyVal}:`}
                placeholder={dispalyVal}
                options={options[key]}
                onChange={customOnChange}
                disabled={disableField ? disableField(props, key) : false}
              />
            </div>
          );
        })}
      </div>
    </form>
  );
};

export default class Wrapper extends Component {
  shouldComponentUpdate = () => false;

  render() {
    const { formName, storeKey, onCancel } = this.props;
    let Comp = reduxForm({
      form: formName,
      validate: () => {},
      props: this.props,
      enableReinitialize: !!onCancel,
    })(Form);

    if (onCancel)
      Comp = connect(
        store => ({ initialValues: store[storeKey].initialValues }),
        null
      )(Comp);

    return <Comp />;
  }
}
