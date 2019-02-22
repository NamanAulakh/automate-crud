import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import List from './List';
import PostComponent from './PostComponent';
import { update, deleteRec, mapStateToPropsWrap, initialize, create, edit } from './func';
import LayoutWrapper from 'app/components/common/layoutWrapper';

class Post extends Component {
  state = { edit: false, item: {}, showDeleteModal: false, showPayTcModal: false };

  componentDidMount = () => initialize({ self: this });

  render() {
    const { storeData, pathObj, keys, isModal, editProp, reservationId, path } = this.props;
    const userType = get(this, 'props.store.auth.user.userType', null);
    const isTcAdminAndTrip = userType === 'tcAdmin' && path === '/trip';
    const isTcAdminAndTcAdmin = userType === 'tcAdmin' && path === '/tcAdmin';
    const { edit: editableItem, item } = this.state;
    if (!pathObj) return <div>Something went wrong</div>;
    const { heading, formName, filteredKeys = [] } = pathObj;
    const Comp = (
      <div className="row animate">
        <div className="row">
          {keys && !editProp && !reservationId && !isTcAdminAndTrip && !isTcAdminAndTcAdmin && (
            <PostComponent
              {...this.props}
              onSubmit={() => create({ self: this })}
              heading={heading}
              formName={formName}
            />
          )}

          <List
            {...this.props}
            {...this.state}
            isTcAdminAndTcAdmin={isTcAdminAndTcAdmin}
            onHide={() => this.setState({ showDeleteModal: false })}
            onShow={() => this.setState({ showDeleteModal: true })}
            onHideTcPay={() => this.setState({ showPayTcModal: false })}
            onShowTcPay={() => this.setState({ showPayTcModal: true })}
            heading={heading}
            filteredKeys={filteredKeys}
            data={storeData}
            onSubmit={() => create({ self: this })}
            editItem={({ item, fillForm }) => edit({ self: this, item, fillForm })}
            edit={editableItem}
            onCancel={() => this.setState({ edit: false })}
            onUpdate={isSignUp => update({ self: this, isSignUp })}
            onDelete={() => deleteRec({ self: this })}
            item={item}
          />
        </div>
      </div>
    );
    if (isModal) return Comp;

    return <LayoutWrapper render={() => Comp} />;
  }
}

const mapStateToProps = (store, ownProps) => mapStateToPropsWrap(store, ownProps);
const bindActions = dispatch => ({ dispatch });
export default withRouter(
  connect(
    mapStateToProps,
    bindActions
  )(Post)
);
